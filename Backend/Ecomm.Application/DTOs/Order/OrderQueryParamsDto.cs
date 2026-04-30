using Ecomm.Domain.Enums;

namespace Ecomm.Application.DTOs.Order;


public class OrderQueryParamsDto
{
    public string? Search { get; set; } // order number
    public OrderStatus? Status { get; set; }
    public PaymentStatus? PaymentStatus { get; set; }
    public DateTime? DateFrom { get; set; }
    public DateTime? DateTo { get; set; }

    // admin filters
    public string? CustomerName { get; set; }
    public string? CustomerEmail { get; set; }

    public string SortBy { get; set; } = "createdAt"; // createdAt, total
    public string SortOrder { get; set; } = "desc";   // asc, desc
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}