namespace Ecomm.Application.DTOs.Product;

public record ProductImportRowDto(
    string Name,
    string SKU,
    string Description,
    decimal Price,
    decimal? DiscountPrice,
    int QuantityInStock,
    int ReorderLevel,
    string CategoryName
);