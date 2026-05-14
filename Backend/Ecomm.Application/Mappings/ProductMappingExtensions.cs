using Ecomm.Application.DTOs.Product;
using Ecomm.Domain.Entities;

namespace Ecomm.Application.Mappings;


public static class ProductMapping
{
    public static Product ToEntity(this CreateProductRequestDto dto)
    {
        return new Product
        {
            Name = dto.Name.Trim(),
            SKU = dto.SKU.Trim(),
            Description = dto.Description.Trim(),
            Price = dto.Price,
            DiscountPrice = dto.DiscountPrice,
            QuantityInStock = dto.QuantityInStock,
            ReorderLevel = dto.ReorderLevel,
            CategoryId = dto.CategoryId
        };
    }

    public static ProductResponseDto ToDto(this Product product)
    {
        var isCategoryActive = product.Category?.IsActive == true;
        var categoryStatus = isCategoryActive ? "Active" : "Limited Availability";
        return new ProductResponseDto
        {
            Id = product.Id,
            Name = product.Name,
            SKU = product.SKU,
            Description = product.Description,
            Price = product.Price,
            DiscountPrice = product.DiscountPrice,
            QuantityInStock = product.QuantityInStock,
            ReorderLevel = product.ReorderLevel,
            CategoryId = product.CategoryId,
            CategoryName = product.Category?.Name ?? string.Empty,
            IsCategoryActive = isCategoryActive,
            CategoryStatus = categoryStatus,
            Images = product.Images
                .Where(i => !i.IsDeleted)
                .OrderBy(i => i.SortOrder)
                .Select(i => new ProductImageDto
                {
                    Id = i.Id,
                    ImageUrl = i.ImageUrl,
                    IsPrimary = i.IsPrimary,
                    SortOrder = i.SortOrder
                })
                .ToList()
        };
    }
}
