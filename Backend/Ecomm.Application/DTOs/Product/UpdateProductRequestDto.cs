namespace Ecomm.Application.DTOs.Product;

public class UpdateProductRequestDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public int QuantityInStock { get; set; }
    public int ReorderLevel { get; set; }
    public bool IsActive { get; set; }
    public Guid CategoryId { get; set; }
}