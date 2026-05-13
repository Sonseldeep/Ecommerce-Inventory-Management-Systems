using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Application.Interfaces.Services;
using Ecomm.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Ecomm.Application.Services;

public class ProductImportContextLoader : IProductImportContextLoader
{
    private readonly IProductRepository _products;
    private readonly ICategoryRepository _categories;
    private readonly ILogger<ProductImportContextLoader> _logger;

    public ProductImportContextLoader(
        IProductRepository products,
        ICategoryRepository categories,
        ILogger<ProductImportContextLoader> logger)
    {
        _products = products;
        _categories = categories;
        _logger = logger;
    }

    public async Task<HashSet<string>> LoadExistingSKUsAsync(CancellationToken ct)
    {
        _logger.LogInformation("[CONTEXT] Loading existing SKUs");

        var existingSKUs = await _products.Query()
            .Where(p => !p.IsDeleted)
            .Select(p => p.SKU.ToLower())
            .ToHashSetAsync(ct);

        _logger.LogInformation("[CONTEXT] Found {Count} existing SKUs", existingSKUs.Count);
        return existingSKUs;
    }

    public async Task<Dictionary<string, Category>> LoadCategoriesDictAsync(CancellationToken ct)
    {
        _logger.LogInformation("[CONTEXT] Loading categories");

        var allCategories = await _categories.GetAllAsync(ct);
        var categoriesDict = allCategories
            .ToDictionary(c => c.Name.ToLower(), StringComparer.OrdinalIgnoreCase);

        _logger.LogInformation("[CONTEXT] Found {Count} categories", categoriesDict.Count);
        return categoriesDict;
    }
}