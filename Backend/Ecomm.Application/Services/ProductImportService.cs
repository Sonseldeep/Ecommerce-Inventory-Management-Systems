using ClosedXML.Excel;
using Ecomm.Application.Common;
using Ecomm.Application.DTOs.Product;
using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Application.Interfaces.Services;
using Ecomm.Domain.Entities;
using FluentValidation;

namespace Ecomm.Application.Services;

public class ProductImportService : IProductImportService
{
    private const long MaxFileSizeBytes = 10 * 1024 * 1024;
    private const int MaxRows = 5000;

    private readonly IProductRepository _products;
    private readonly ICategoryRepository _categories;
    private readonly IUnitOfWork _uow;
    private readonly IValidator<ProductImportRowDto> _rowValidator;

    public ProductImportService(
        IProductRepository products,
        ICategoryRepository categories,
        IUnitOfWork uow,
        IValidator<ProductImportRowDto> rowValidator)
    {
        _products = products;
        _categories = categories;
        _uow = uow;
        _rowValidator = rowValidator;
    }

    public async Task<ProductImportResultDto> ImportAsync(ProductImportRequestDto request, CancellationToken ct = default)
    {
        if (request.Length <= 0)
            throw new BadRequestException("File is required.");

        if (!Path.GetExtension(request.FileName).Equals(".xlsx", StringComparison.OrdinalIgnoreCase))
            throw new BadRequestException("Only .xlsx files are allowed.");

        if (request.Length > MaxFileSizeBytes)
            throw new BadRequestException("Max file size is 10MB.");

        using var workbook = new XLWorkbook(request.FileStream);
        var sheet = workbook.Worksheets.First();
        var rows = sheet.RowsUsed();

        var startRow = request.HasHeader ? 2 : 1;
        var dataRows = rows.Where(r => r.RowNumber() >= startRow).ToList();
        var totalRows = dataRows.Count;

        if (totalRows > MaxRows)
            throw new BadRequestException($"Excel file exceeds {MaxRows} rows.");

        var rowErrors = new List<ProductImportRowResultDto>();
        var productsToInsert = new List<Product>();
        var skuSet = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        foreach (var row in dataRows)
        {
            var rowNumber = row.RowNumber();

            var dto = new ProductImportRowDto(
                Name: row.Cell(1).GetString(),
                SKU: row.Cell(2).GetString(),
                Description: row.Cell(3).GetString(),
                Price: row.Cell(4).GetValue<decimal>(),
                DiscountPrice: row.Cell(5).IsEmpty() ? null : row.Cell(5).GetValue<decimal>(),
                QuantityInStock: row.Cell(6).GetValue<int>(),
                ReorderLevel: row.Cell(7).GetValue<int>(),
                CategoryName: row.Cell(8).GetString(),   // ✅ name
                IsActive: row.Cell(9).GetValue<bool>()
            );

            var validation = await _rowValidator.ValidateAsync(dto, ct);
            var errors = validation.Errors.Select(e => e.ErrorMessage).ToList();

            if (!string.IsNullOrWhiteSpace(dto.SKU) && !skuSet.Add(dto.SKU.Trim()))
                errors.Add("SKU is duplicated in the file.");

            if (!string.IsNullOrWhiteSpace(dto.SKU) &&
                await _products.ExistsBySkuAsync(dto.SKU.Trim(), ct))
                errors.Add("SKU already exists.");

            Category? category = null;
            if (!string.IsNullOrWhiteSpace(dto.CategoryName))
            {
                category = await _categories.GetByNameAsync(dto.CategoryName.Trim(), ct);
                if (category is null)
                    errors.Add($"Category '{dto.CategoryName}' not found.");
                else if (!category.IsActive)
                    errors.Add($"Category '{category.Name}' is inactive.");
            }

            if (errors.Count > 0)
            {
                rowErrors.Add(new ProductImportRowResultDto(rowNumber, errors));
                continue;
            }

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
                CategoryId = category!.Id,   // ✅ resolved
                IsActive = dto.IsActive
            });
        }

        if (productsToInsert.Count > 0)
        {
            await _products.AddRangeAsync(productsToInsert, ct);
            await _uow.SaveChangesAsync(ct);
        }

        return new ProductImportResultDto(
            TotalRows: totalRows,
            SuccessCount: productsToInsert.Count,
            FailedCount: rowErrors.Count,
            RowErrors: rowErrors
        );
    }
}