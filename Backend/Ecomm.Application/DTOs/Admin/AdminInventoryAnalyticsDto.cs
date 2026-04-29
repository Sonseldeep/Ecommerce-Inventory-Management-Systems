namespace Ecomm.Application.DTOs.Admin;

public class AdminInventoryAnalyticsDto
{
    public int TotalProducts { get; set; }
    public int LowStockCount { get; set; }
    public int OutOfStockCount { get; set; }

    public List<TopProductDto> TopStockProducts { get; set; } = [];
    public List<TopProductDto> BestSellersLast30Days { get; set; } = [];
    public List<TopProductDto> NotSellingLast30Days { get; set; } = [];

    public List<CategoryStockDto> CategoryStock { get; set; } = [];
}
public class TopProductDto
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; } // stock or sold qty
}
public class CategoryStockDto
{
    public string CategoryName { get; set; } = String.Empty;
    public int TotalStock { get; set; }
}