using Ecomm.Domain.Enums;

namespace Ecomm.Application.DTOs.Order;


public class OrderResponseDto
{
    public Guid Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public Guid UserId { get; set; }

  
    public decimal Subtotal { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal ShippingFee { get; set; }
    public decimal TotalAmount { get; set; }

    public PaymentMethod PaymentMethod { get; set; }
    public PaymentStatus PaymentStatus { get; set; }
    public OrderStatus OrderStatus { get; set; }

    public DateTime CreatedAtUtc { get; set; }
    public List<OrderItemResponseDto> Items { get; set; } = new();
    
    // NEW
    public string? CustomerName { get; set; } = string.Empty;
    public string? CustomerEmail { get; set; } = string.Empty;
}