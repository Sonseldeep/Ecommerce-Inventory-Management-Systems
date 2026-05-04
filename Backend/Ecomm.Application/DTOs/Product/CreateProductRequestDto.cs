namespace Ecomm.Application.DTOs.Product;

public class CreateProductRequestDto
{
    public string Name { get; set; } = string.Empty;
    public string SKU { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public int QuantityInStock { get; set; }
    public int ReorderLevel { get; set; } = 5;
    public Guid CategoryId { get; set; }
    public List<string>? ImageUrls { get; set; } = [];
}