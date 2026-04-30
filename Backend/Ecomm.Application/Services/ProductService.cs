using Ecomm.Application.Common;
using Ecomm.Application.DTOs.Product;
using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Application.Interfaces.Services;
using Ecomm.Application.Mappings;
using Ecomm.Application.Validators.Product;
using Ecomm.Domain.Entities;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace Ecomm.Application.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _products;
    private readonly ICategoryRepository _categories;
    private readonly IRepository<ProductImage> _productImages;
    private readonly IUnitOfWork _uow;
    private readonly ILogger<ProductService> _logger;
    private readonly IRealtimeNotifier _realtime;
    private readonly IValidator<CreateProductRequestDto> _createValidator;
    private readonly IValidator<UpdateProductRequestDto> _updateValidator;

    public ProductService(
        IProductRepository products,
        ICategoryRepository categories,
        IRepository<ProductImage> productImages,
        IUnitOfWork uow,
        ILogger<ProductService> logger,
        IRealtimeNotifier realtime,
        IValidator<CreateProductRequestDto> createValidator,
        IValidator<UpdateProductRequestDto> updateValidator)
    {
        _products = products;
        _categories = categories;
        _productImages = productImages;
        _uow = uow;
        _logger = logger;
        _realtime = realtime;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
    }

    public async Task<ProductResponseDto> CreateAsync(CreateProductRequestDto request, CancellationToken ct = default)
    {
        await _createValidator.ValidateAndThrowAsync(request, ct);

        var category = await _categories.GetByIdAsync(request.CategoryId, ct);
        if (category is null)
            throw new NotFoundException("Category not found.");

        if (await _products.ExistsBySkuAsync(request.SKU.Trim(), ct))
            throw new BadRequestException("SKU already exists.");

        var product = request.ToEntity();
        await _products.AddAsync(product, ct);
        await _uow.SaveChangesAsync(ct);

        // optional backward-compatible support:
        if (request.ImageUrls is { Count: > 0 })
        {
            var sort = 0;
            foreach (var url in request.ImageUrls.Where(x => !string.IsNullOrWhiteSpace(x)))
            {
                await _productImages.AddAsync(new ProductImage
                {
                    ProductId = product.Id,
                    ImageUrl = url.Trim(),
                    IsPrimary = sort == 0,
                    SortOrder = sort++
                }, ct);
            }

            await _uow.SaveChangesAsync(ct);
        }

        var created = await _products.GetByIdWithDetailsAsync(product.Id, ct)
            ?? throw new NotFoundException("Created product not found.");
        
        var response = created.ToDto();

        await _realtime.ProductCreatedAsync(response, ct);

        
        _logger.LogInformation("Product created: {Sku}", created.SKU);
        return response;
    }

    public async Task<IEnumerable<ProductResponseDto>> GetAllAsync(CancellationToken ct = default)
    {
        var list = await _products.GetAllWithDetailsAsync(ct);
        return list.Select(x => x.ToDto());
    }

    public async Task<ProductResponseDto> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var p = await _products.GetByIdWithDetailsAsync(id, ct);
        if (p is null) throw new NotFoundException("Product not found.");
        return p.ToDto();
    }

    public async Task<PagedProductResponseDto> SearchAsync(ProductQueryParamsDto query, CancellationToken ct = default)
    {
        query.PageNumber = query.PageNumber <= 0 ? 1 : query.PageNumber;
        query.PageSize = query.PageSize <= 0 ? 10 : Math.Min(query.PageSize, 100);

        var (items, total) = await _products.SearchAsync(query, ct);

        return new PagedProductResponseDto
        {
            Items = items.Select(x => x.ToDto()),
            PageNumber = query.PageNumber,
            PageSize = query.PageSize,
            TotalCount = total
        };
    }
    
    public async Task<ProductResponseDto> UpdateAsync(Guid id, UpdateProductRequestDto request, CancellationToken ct = default)
    {
        await _updateValidator.ValidateAndThrowAsync(request, ct);
        
        var product = await _products.GetByIdWithDetailsAsync(id, ct);
        if (product is null) throw new NotFoundException("Product not found.");

        var category = await _categories.GetByIdAsync(request.CategoryId, ct);
        if (category is null) throw new NotFoundException("Category not found.");

        product.Name = request.Name.Trim();
        product.Description = request.Description.Trim();
        product.Price = request.Price;
        product.DiscountPrice = request.DiscountPrice;
        product.QuantityInStock = request.QuantityInStock;
        product.ReorderLevel = request.ReorderLevel;
        product.CategoryId = request.CategoryId;
        product.IsActive = request.IsActive;

        _products.Update(product);
        await _uow.SaveChangesAsync(ct);

        var updated = await _products.GetByIdWithDetailsAsync(id, ct)
                      ?? throw new NotFoundException("Product not found.");
        
        var response = updated.ToDto();
        
        // Trigger Real-time Notification
        await _realtime.ProductUpdatedAsync(response, ct);
       

        _logger.LogInformation("Product updated: {ProductId}", id);
        return response;
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var product = await _products.GetByIdWithDetailsAsync(id, ct);
        if (product is null) throw new NotFoundException("Product not found.");

        // soft delete product
        _products.Remove(product);

        // optional: soft delete related images too (if your repo soft-deletes)
        foreach (var image in product.Images.Where(i => !i.IsDeleted))
        {
            _productImages.Remove(image);
        }

        await _uow.SaveChangesAsync(ct);
        _logger.LogInformation("Product deleted: {ProductId}", id);
    }
}




// public class ProductService : IProductService
// {
//     private readonly IProductRepository _products;
//     private readonly ICategoryRepository _categories;
//     private readonly IUnitOfWork _uow;
//     private readonly ILogger<ProductService> _logger;
//
//     public ProductService(
//         IProductRepository products,
//         ICategoryRepository categories,
//         IUnitOfWork uow,
//         ILogger<ProductService> logger)
//     {
//         _products = products;
//         _categories = categories;
//         _uow = uow;
//         _logger = logger;
//     }
//
//     public async Task<ProductResponseDto> CreateAsync(CreateProductRequestDto request, CancellationToken ct = default)
//     {
//         var category = await _categories.GetByIdAsync(request.CategoryId, ct);
//         if (category is null)
//             throw new NotFoundException("Category not found.");
//
//         if (await _products.ExistsBySkuAsync(request.SKU.Trim(), ct))
//             throw new BadRequestException("SKU already exists.");
//
//         var product = request.ToEntity();
//         await _products.AddAsync(product, ct);
//         await _uow.SaveChangesAsync(ct);
//
//         var created = await _products.GetByIdWithDetailsAsync(product.Id, ct)
//                       ?? throw new NotFoundException("Created product not found.");
//
//         _logger.LogInformation("Product created: {Sku}", created.SKU);
//         return created.ToDto();
//     }
//
//     public async Task<IEnumerable<ProductResponseDto>> GetAllAsync(CancellationToken ct = default)
//     {
//         var list = await _products.GetAllWithDetailsAsync(ct);
//         return list.Select(x => x.ToDto());
//     }
//
//     public async Task<ProductResponseDto> GetByIdAsync(Guid id, CancellationToken ct = default)
//     {
//         var p = await _products.GetByIdWithDetailsAsync(id, ct);
//         if (p is null) throw new NotFoundException("Product not found.");
//         return p.ToDto();
//     }
//     
//     public async Task<PagedProductResponseDto> SearchAsync(ProductQueryParamsDto query, CancellationToken ct = default)
//     {
//         query.PageNumber = query.PageNumber <= 0 ? 1 : query.PageNumber;
//         query.PageSize = query.PageSize <= 0 ? 10 : Math.Min(query.PageSize, 100);
//
//         var (items, total) = await _products.SearchAsync(query, ct);
//
//         return new PagedProductResponseDto
//         {
//             Items = items.Select(x => x.ToDto()),
//             PageNumber = query.PageNumber,
//             PageSize = query.PageSize,
//             TotalCount = total
//         };
//     }
// }