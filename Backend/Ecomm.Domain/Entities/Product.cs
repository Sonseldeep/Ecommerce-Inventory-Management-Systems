using Ecomm.Domain.Common;

namespace Ecomm.Domain.Entities;

public class Product : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string SKU { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }

    public int QuantityInStock { get; set; }
    
    // threshold for low stock alerts
    // If stock ≤ 5 → trigger low stock notification
    public int ReorderLevel { get; set; } = 5;
    
    // Each product belongs to one category
    public Guid CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}