namespace Ecomm.Application.DTOs.Admin;

public class UserAnalyticsSummaryDto
{
    public int TotalUsers { get; set; }
    public List<UserSpendDto> TopBuyers { get; set; } = [];
}

public class UserSpendDto
{
    public Guid UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int OrdersCount { get; set; }
    public decimal TotalSpent { get; set; }
}

public class UserProductPurchaseDto
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal TotalSpent { get; set; }
}