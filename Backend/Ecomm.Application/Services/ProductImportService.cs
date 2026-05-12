using ClosedXML.Excel;
using Ecomm.Application.Common;
using Ecomm.Application.DTOs.Product;
using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Application.Interfaces.Services;
using Ecomm.Domain.Entities;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace Ecomm.Application.Services;

public class ProductImportService : IProductImportService
{
    private const long MaxFileSizeBytes = 10 * 1024 * 1024;
    private const int MaxRows = 5000;

    private readonly IProductRepository _products;
    private readonly ICategoryRepository _categories;
    private readonly IUnitOfWork _uow;
    private readonly IValidator<ProductImportRowDto> _rowValidator;
    private readonly ILogger<ProductImportService> _logger;

    public ProductImportService(
        IProductRepository products,
        ICategoryRepository categories,
        IUnitOfWork uow,
        IValidator<ProductImportRowDto> rowValidator, ILogger<ProductImportService> logger)
    {
        _products = products;
        _categories = categories;
        _uow = uow;
        _rowValidator = rowValidator;
        _logger = logger;
    }
    /// <summary>
    /// Main import method - orchestrates entire process
    /// </summary>

    public async Task<ProductImportResultDto> ImportAsync(ProductImportRequestDto request, CancellationToken ct = default)
    {
        // STEP 1: VALIDATE REQUEST
        if (request.Length <= 0)
        {
            _logger.LogWarning("Import failed: File is required.");
            throw new BadRequestException("File is required.");
        }


        if (!Path.GetExtension(request.FileName).Equals(".xlsx", StringComparison.OrdinalIgnoreCase))
        {
            _logger.LogWarning("Import failed: Invalid file extension for file: {FileName}", request.FileName);
            throw new BadRequestException("Only .xlsx files are allowed.");
        }


        if (request.Length > MaxFileSizeBytes)
        {
            _logger.LogWarning("Import failed: File too large ({FileSize} bytes) for file: {FileName}", request.Length, request.FileName);
            throw new BadRequestException("Max file size is 10MB.");
        }
        _logger.LogInformation("File validation passed. Starting Excel processing...");


        // STEP 2: PARSE EXCEL FILE
        // ClosedXML: Library that reads/writes Excel files in memory
        using var workbook = new XLWorkbook(request.FileStream);
        var sheet = workbook.Worksheets.First();
        var rows = sheet.RowsUsed();
        

        // STEP 3: EXTRACT DATA ROWS
        // Skip header if HasHeader=true, otherwise start from row 1
        var startRow = request.HasHeader ? 2 : 1;
        var dataRows = rows.Where(r => r.RowNumber() >= startRow).ToList();
        var totalRows = dataRows.Count;
        
        _logger.LogInformation("Excel file parsed successfully. Total rows to process: {TotalRows}", totalRows);


        // STEP 4: CHECK ROW COUNT LIMIT
        if (totalRows > MaxRows)
        {
            _logger.LogWarning("Import failed: Too many rows ({TotalRows}) exceeds limit of {MaxRows}", totalRows, MaxRows);
            throw new BadRequestException($"Excel file exceeds {MaxRows} rows.");
        }
           

        // STEP 4: CHECK ROW COUNT LIMIT
        var rowErrors = new List<ProductImportRowResultDto>();
        var productsToInsert = new List<Product>();
        var skuSet = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        
        _logger.LogInformation("Starting row-by-row processing...");


        // STEP 6: PROCESS EACH ROW
        foreach (var row in dataRows)
        {
            var rowNumber = row.RowNumber();

            // 6i: Extract cell values into DTO
            var dto = new ProductImportRowDto(
                Name: row.Cell(1).GetString(),
                SKU: row.Cell(2).GetString(),
                Description: row.Cell(3).GetString(),
                Price: row.Cell(4).GetValue<decimal>(),
                DiscountPrice: row.Cell(5).IsEmpty() ? null : row.Cell(5).GetValue<decimal>(),
                QuantityInStock: row.Cell(6).GetValue<int>(),
                ReorderLevel: row.Cell(7).GetValue<int>(),
                CategoryName: row.Cell(8).GetString(),  
                IsActive: row.Cell(9).GetValue<bool>()
            );

            _logger.LogDebug("Processing row {RowNumber}: SKU={SKU}, Name={Name}", rowNumber, dto.SKU, dto.Name);

            // 6ii: Validate using FluentValidation
            var validation = await _rowValidator.ValidateAsync(dto, ct);
            var errors = validation.Errors.Select(e => e.ErrorMessage).ToList();

            // 6C: Check SKU duplicates in current file
            if (!string.IsNullOrWhiteSpace(dto.SKU) && !skuSet.Add(dto.SKU.Trim()))
            {
                errors.Add("SKU is duplicated in the file.");
                _logger.LogDebug("Row {RowNumber}: Duplicate SKU found in file: {SKU}", rowNumber, dto.SKU);

            }
              

            // 6C: Check SKU duplicates in current file
            if (!string.IsNullOrWhiteSpace(dto.SKU) &&
                await _products.ExistsBySkuAsync(dto.SKU.Trim(), ct))
            {
                errors.Add("SKU already exists.");
                _logger.LogDebug("Row {RowNumber}: SKU already exists in database: {SKU}", rowNumber, dto.SKU);
            }
            


            // 6E: Check category exists and is active
            Category? category = null;
            if (!string.IsNullOrWhiteSpace(dto.CategoryName))
            {
                category = await _categories.GetByNameAsync(dto.CategoryName.Trim(), ct);
                if (category is null)
                {
                    errors.Add($"Category '{dto.CategoryName}' not found.");
                    _logger.LogDebug("Row {RowNumber}: Category not found: {CategoryName}", rowNumber, dto.CategoryName);

                }
                    
                else if (!category.IsActive)
                {
                    errors.Add($"Category '{category.Name}' is inactive.");
                    _logger.LogDebug("Row {RowNumber}: Category is inactive: {CategoryName}", rowNumber, category.Name);

                }
                    
            }

            // 6F: If errors, skip row and collect error
            if (errors.Count > 0)
            {
                rowErrors.Add(new ProductImportRowResultDto(rowNumber, errors));
                _logger.LogDebug("Row {RowNumber}: Validation failed with {ErrorCount} errors", rowNumber, errors.Count);

                continue;
            }

            // 6G: Valid row - create Product entity for batch insert
            productsToInsert.Add(new Product
            {
                Id = Guid.NewGuid(),
                Name = dto.Name.Trim(),
                SKU = dto.SKU.Trim(),
                Description = dto.Description?.Trim() ?? string.Empty,
                Price = dto.Price,
                DiscountPrice = dto.DiscountPrice,
                QuantityInStock = dto.QuantityInStock,
                ReorderLevel = dto.ReorderLevel,
                CategoryId = category!.Id,   
                IsActive = dto.IsActive
            });
            _logger.LogDebug("Row {RowNumber}: Successfully validated and queued for insertion", rowNumber);

        }

        _logger.LogInformation("Row processing completed. Valid rows: {ValidRows}, Failed rows: {FailedRows}",
            productsToInsert.Count, rowErrors.Count);
        
        // STEP 7: BATCH INSERT ALL VALID PRODUCTS
        if (productsToInsert.Count > 0)
        {
            _logger.LogInformation("Starting batch insert of {ProductCount} products", productsToInsert.Count);

            await _products.AddRangeAsync(productsToInsert, ct);
            await _uow.SaveChangesAsync(ct);
            _logger.LogInformation("Successfully inserted {ProductCount} products into database", productsToInsert.Count);

        }

        // STEP 8: RETURN RESULTS
        return new ProductImportResultDto(
            TotalRows: totalRows,
            SuccessCount: productsToInsert.Count,
            FailedCount: rowErrors.Count,
            RowErrors: rowErrors
        );
    }
}