using ClosedXML.Excel;
using Ecomm.Application.Common;
using Ecomm.Application.DTOs.Product;
using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Application.Interfaces.Services;
using Ecomm.Domain.Entities;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
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
        IValidator<ProductImportRowDto> rowValidator,
        ILogger<ProductImportService> logger)
    {
        _products = products;
        _categories = categories;
        _uow = uow;
        _rowValidator = rowValidator;
        _logger = logger;
    }

    public async Task<ProductImportResultDto> ImportAsync(
        ProductImportRequestDto request,
        CancellationToken ct = default)
    {
        _logger.LogInformation("📥 [IMPORT] Starting import from file: {FileName}", request.FileName);

        try
        {
            // STEP 1: VALIDATE REQUEST
            if (request.Length <= 0)
                throw new BadRequestException("File is required.");

            if (!Path.GetExtension(request.FileName).Equals(".xlsx", StringComparison.OrdinalIgnoreCase))
                throw new BadRequestException("Only .xlsx files are allowed.");

            if (request.Length > MaxFileSizeBytes)
                throw new BadRequestException("Max file size is 10MB.");

            // STEP 2: PARSE EXCEL - Handle parsing errors
            IXLWorkbook workbook;
            IXLWorksheet sheet;
            try
            {
                workbook = new XLWorkbook(request.FileStream);
                sheet = workbook.Worksheets.FirstOrDefault();
                if (sheet == null)
                    throw new BadRequestException("Excel file has no worksheets.");
            }
            catch (Exception ex) when (!(ex is BadRequestException))
            {
                _logger.LogError(ex, "Failed to parse Excel file");
                throw new BadRequestException($"Invalid Excel file format: {ex.Message}");
            }

            var rows = sheet.RowsUsed();
            var startRow = request.HasHeader ? 2 : 1;
            var dataRows = rows.Where(r => r.RowNumber() >= startRow).ToList();
            var totalRows = dataRows.Count;

            if (totalRows == 0)
                throw new BadRequestException("No data rows found in the Excel file.");

            if (totalRows > MaxRows)
                throw new BadRequestException($"Excel file exceeds {MaxRows} rows.");

            _logger.LogInformation("📄 [IMPORT] Found {RowCount} rows to process", totalRows);

            // STEP 3: Load existing data ONCE
            _logger.LogInformation("🔍 [IMPORT] Loading existing SKUs (single query)");
            var existingSKUs = await _products.Query()
                .Where(p => !p.IsDeleted)
                .Select(p => p.SKU.ToLower())
                .ToHashSetAsync(ct);

            _logger.LogInformation("📊 [IMPORT] Found {SKUCount} existing SKUs in database", existingSKUs.Count);

            _logger.LogInformation("🔍 [IMPORT] Loading all categories (single query)");
            var allCategories = await _categories.GetAllAsync(ct);
            var categoriesDict = allCategories
                .ToDictionary(c => c.Name.ToLower(), StringComparer.OrdinalIgnoreCase);

            _logger.LogInformation("📊 [IMPORT] Found {CategoryCount} categories", categoriesDict.Count);

            // STEP 4: PROCESS ROWS
            var rowErrors = new List<ProductImportRowResultDto>();
            var productsToInsert = new List<Product>();
            var skuSet = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            foreach (var row in dataRows)
            {
                var rowNumber = row.RowNumber();
                var rowErrorList = new List<string>();

                try
                {
                    // STEP 5: EXTRACT CELL VALUES WITH ERROR HANDLING
                    ProductImportRowDto dto;
                    try
                    {
                        dto = ExtractRowData(row, rowNumber, out var extractionErrors);
                        rowErrorList.AddRange(extractionErrors);

                        if (rowErrorList.Count > 0)
                        {
                            rowErrors.Add(new ProductImportRowResultDto(rowNumber, rowErrorList));
                            _logger.LogWarning("⚠️ [IMPORT] Row {Row}: Extraction errors - {Errors}", 
                                rowNumber, string.Join("; ", rowErrorList));
                            continue;
                        }
                    }
                    catch (Exception ex)
                    {
                        rowErrorList.Add($"Failed to extract row data: {ex.Message}");
                        rowErrors.Add(new ProductImportRowResultDto(rowNumber, rowErrorList));
                        _logger.LogWarning(ex, "⚠️ [IMPORT] Row {Row}: Extraction failed", rowNumber);
                        continue;
                    }

                    // STEP 6: VALIDATE USING FLUENTVALIDATION
                    var validation = await _rowValidator.ValidateAsync(dto, ct);
                    if (!validation.IsValid)
                    {
                        rowErrorList.AddRange(validation.Errors.Select(e => e.ErrorMessage));
                    }

                    // STEP 7: CHECK DUPLICATE SKU IN FILE
                    if (!string.IsNullOrWhiteSpace(dto.SKU) && !skuSet.Add(dto.SKU.Trim()))
                        rowErrorList.Add("SKU is duplicated in the file.");

                    // STEP 8: CHECK SKU IN DATABASE
                    if (!string.IsNullOrWhiteSpace(dto.SKU) && 
                        existingSKUs.Contains(dto.SKU.Trim().ToLower()))
                        rowErrorList.Add("SKU already exists in database.");

                    // STEP 9: VALIDATE CATEGORY
                    Category? category = null;
                    if (!string.IsNullOrWhiteSpace(dto.CategoryName))
                    {
                        var categoryKey = dto.CategoryName.Trim().ToLower();
                        
                        if (!categoriesDict.TryGetValue(categoryKey, out category))
                            rowErrorList.Add($"Category '{dto.CategoryName}' not found.");
                        else if (!category.IsActive)
                            rowErrorList.Add($"Category '{category.Name}' is inactive.");
                    }
                    else
                    {
                        rowErrorList.Add("Category name is required.");
                    }

                    // STEP 10: IF ERRORS, SKIP ROW
                    if (rowErrorList.Count > 0)
                    {
                        rowErrors.Add(new ProductImportRowResultDto(rowNumber, rowErrorList));
                        _logger.LogWarning("⚠️ [IMPORT] Row {Row}: {ErrorCount} validation errors", 
                            rowNumber, rowErrorList.Count);
                        continue;
                    }

                    // STEP 11: VALID ROW - QUEUE FOR INSERT
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

                    _logger.LogDebug("✅ [IMPORT] Row {Row}: Valid - queued for insertion", rowNumber);
                }
                catch (Exception ex)
                {
                    rowErrorList.Add($"Unexpected error: {ex.Message}");
                    rowErrors.Add(new ProductImportRowResultDto(rowNumber, rowErrorList));
                    _logger.LogError(ex, "❌ [IMPORT] Row {Row}: Unexpected error", rowNumber);
                }
            }

            _logger.LogInformation("📊 [IMPORT] Row processing completed. Valid: {Valid}, Failed: {Failed}",
                productsToInsert.Count, rowErrors.Count);

            // STEP 12: BATCH INSERT WITH TRANSACTION HANDLING
            if (productsToInsert.Count > 0)
            {
                try
                {
                    _logger.LogInformation("💾 [IMPORT] Inserting {Count} products to database", 
                        productsToInsert.Count);

                    await _products.AddRangeAsync(productsToInsert, ct);
                    await _uow.SaveChangesAsync(ct);

                    _logger.LogInformation("✅ [IMPORT] Successfully inserted {Count} products", 
                        productsToInsert.Count);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "❌ [IMPORT] Database insertion failed");
                    throw new BadRequestException($"Failed to insert products to database: {ex.Message}");
                }
            }

            _logger.LogInformation(
                "📊 [IMPORT] Complete - Total: {Total}, Success: {Success}, Failed: {Failed}",
                totalRows, productsToInsert.Count, rowErrors.Count);

            return new ProductImportResultDto(
                TotalRows: totalRows,
                SuccessCount: productsToInsert.Count,
                FailedCount: rowErrors.Count,
                RowErrors: rowErrors
            );
        }
        catch (BadRequestException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ [IMPORT] Unexpected error during import");
            throw new BadRequestException($"Import failed: {ex.Message}");
        }
    }

    /// <summary>
    /// Safely extract cell data with comprehensive error handling
    /// </summary>
    private ProductImportRowDto ExtractRowData(IXLRow row, int rowNumber, out List<string> errors)
    {
        errors = new List<string>();

        // Helper to safely get string value
        string? GetStringValue(int column)
        {
            try
            {
                var cell = row.Cell(column);
                if (cell.IsEmpty())
                    return null;

                var value = cell.GetString()?.Trim();
                return string.IsNullOrWhiteSpace(value) ? null : value;
            }
            catch (Exception ex)
            {
                _logger.LogWarning("⚠️ Row {Row}, Column {Col}: Failed to extract string - {Error}",
                    rowNumber, column, ex.Message);
                return null;
            }
        }

        // Helper to safely get decimal value
        var errors1 = errors;

        decimal? GetDecimalValue(int column, bool required = true)
        {
            try
            {
                var cell = row.Cell(column);
                if (cell.IsEmpty())
                    return null;

                // Try parsing as decimal
                if (decimal.TryParse(cell.GetString() ?? cell.Value.ToString(), out var result))
                    return result;

                try
                {
                    return cell.GetValue<decimal>();
                }
                catch
                {
                    if (required)
                        errors1.Add($"Column {column}: Invalid decimal format '{cell.Value}'");
                    return null;
                }
            }
            catch (Exception ex)
            {
                if (required)
                    errors1.Add($"Column {column}: Invalid decimal - {ex.Message}");
                _logger.LogWarning("⚠️ Row {Row}, Column {Col}: Failed to extract decimal - {Error}",
                    rowNumber, column, ex.Message);
                return null;
            }
        }

        // Helper to safely get int value
        var list1 = errors;

        int? GetIntValue(int column, bool required = true)
        {
            try
            {
                var cell = row.Cell(column);
                if (cell.IsEmpty())
                    return null;

                if (int.TryParse(cell.GetString() ?? cell.Value.ToString(), out var result))
                    return result;

                try
                {
                    return cell.GetValue<int>();
                }
                catch
                {
                    if (required)
                        list1.Add($"Column {column}: Invalid integer format '{cell.Value}'");
                    return null;
                }
            }
            catch (Exception ex)
            {
                if (required)
                    list1.Add($"Column {column}: Invalid integer - {ex.Message}");
                _logger.LogWarning("⚠️ Row {Row}, Column {Col}: Failed to extract int - {Error}",
                    rowNumber, column, ex.Message);
                return null;
            }
        }

        // Helper to safely get bool value
        var list = errors;

        bool? GetBoolValue(int column, bool required = true)
        {
            try
            {
                var cell = row.Cell(column);
                if (cell.IsEmpty())
                    return null;

                var strValue = cell.GetString()?.ToLower().Trim();
                if (strValue == "true" || strValue == "yes" || strValue == "1")
                    return true;
                if (strValue == "false" || strValue == "no" || strValue == "0")
                    return false;

                try
                {
                    return cell.GetValue<bool>();
                }
                catch
                {
                    if (required)
                        list.Add($"Column {column}: Invalid boolean format '{cell.Value}' (expected: true/false, yes/no, 0/1)");
                    return null;
                }
            }
            catch (Exception ex)
            {
                if (required)
                    list.Add($"Column {column}: Invalid boolean - {ex.Message}");
                _logger.LogWarning("⚠️ Row {Row}, Column {Col}: Failed to extract bool - {Error}",
                    rowNumber, column, ex.Message);
                return null;
            }
        }

        // EXTRACT ALL COLUMNS (Columns: 1=Name, 2=SKU, 3=Description, 4=Price, 5=DiscountPrice, 6=Qty, 7=ReorderLevel, 8=Category, 9=IsActive)
        var name = GetStringValue(1);
        var sku = GetStringValue(2);
        var description = GetStringValue(3);
        var price = GetDecimalValue(4, required: true);
        var discountPrice = GetDecimalValue(5, required: false);
        var quantity = GetIntValue(6, required: true);
        var reorderLevel = GetIntValue(7, required: true);
        var categoryName = GetStringValue(8);
        var isActive = GetBoolValue(9, required: true);

        // Validate extracted values
        if (string.IsNullOrWhiteSpace(name))
            errors.Add("Column 1 (Name): Required field is empty");
        if (string.IsNullOrWhiteSpace(sku))
            errors.Add("Column 2 (SKU): Required field is empty");
        if (price == null)
            errors.Add("Column 4 (Price): Required field or invalid format");
        if (quantity == null)
            errors.Add("Column 6 (Quantity): Required field or invalid format");
        if (reorderLevel == null)
            errors.Add("Column 7 (ReorderLevel): Required field or invalid format");
        if (isActive == null)
            errors.Add("Column 9 (IsActive): Required field or invalid format");

        return new ProductImportRowDto(
            Name: name ?? string.Empty,
            SKU: sku ?? string.Empty,
            Description: description ?? string.Empty,
            Price: price ?? 0,
            DiscountPrice: discountPrice,
            QuantityInStock: quantity ?? 0,
            ReorderLevel: reorderLevel ?? 0,
            CategoryName: categoryName ?? string.Empty,
            IsActive: isActive ?? false
        );
    }
}