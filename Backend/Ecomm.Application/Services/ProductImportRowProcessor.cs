using Ecomm.Application.DTOs.Product;
using Ecomm.Application.Interfaces.Services;
using Ecomm.Domain.Entities;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace Ecomm.Application.Services;

public class ProductImportRowProcessor : IProductImportRowProcessor
{
    private readonly IValidator<ProductImportRowDto> _validator;
    private readonly ILogger<ProductImportRowProcessor> _logger;

    public ProductImportRowProcessor(
        IValidator<ProductImportRowDto> validator,
        ILogger<ProductImportRowProcessor> logger)
    {
        _validator = validator;
        _logger = logger;
    }

    public (Product? product, List<string> errors) ProcessRow(
        ProductImportRowDto dto,
        int rowNumber,
        HashSet<string> existingSKUs,
        Dictionary<string, Category> categoriesDict,
        HashSet<string> fileSkus)
    {
        var errors = new List<string>();

        // 1. Validate DTO using FluentValidation
        var validation = _validator.Validate(dto);
        if (!validation.IsValid)
        {
            errors.AddRange(validation.Errors.Select(e => e.ErrorMessage));
        }

        // 2. Check duplicate SKU in file
        if (!string.IsNullOrWhiteSpace(dto.SKU) && !fileSkus.Add(dto.SKU.Trim()))
        {
            errors.Add("SKU is duplicated in the file.");
        }

        // 3. Check SKU in database
        if (!string.IsNullOrWhiteSpace(dto.SKU) && 
            existingSKUs.Contains(dto.SKU.Trim().ToLower()))
        {
            errors.Add("SKU already exists in database.");
        }

        // 4. Validate category
        Category? category = null;
        if (!string.IsNullOrWhiteSpace(dto.CategoryName))
        {
            var categoryKey = dto.CategoryName.Trim().ToLower();

            if (!categoriesDict.TryGetValue(categoryKey, out category))
            {
                errors.Add($"Category '{dto.CategoryName}' not found.");
            }
            else if (!category.IsActive)
            {
                errors.Add($"Category '{category.Name}' is inactive.");
            }
        }
        else
        {
            errors.Add("Category name is required.");
        }

        // If errors exist, return null product
        if (errors.Count > 0)
        {
            _logger.LogWarning("[PROCESS] Row {Row}: {Count} errors", rowNumber, errors.Count);
            return (null, errors);
        }

        // 5. Create product
        var product = new Product
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
           
        };

        _logger.LogDebug("[PROCESS] Row {Row}: Valid - {SKU}", rowNumber, product.SKU);
        return (product, errors);
    }
}