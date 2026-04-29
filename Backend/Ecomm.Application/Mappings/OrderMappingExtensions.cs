using Ecomm.Application.DTOs.Order;
using Ecomm.Domain.Entities;

namespace Ecomm.Application.Mappings;

public static class OrderMappingExtensions
{
    public static OrderResponseDto ToDto(this Order order)
    {
        return new OrderResponseDto
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber,
            UserId = order.UserId,
            Subtotal = order.Subtotal,
            DiscountAmount = order.DiscountAmount,
            ShippingFee = order.ShippingFee,
            TotalAmount = order.TotalAmount,
            PaymentMethod = order.PaymentMethod,
            PaymentStatus = order.PaymentStatus,
            OrderStatus = order.OrderStatus,
            CreatedAtUtc = order.CreatedAtUtc,
            Items = order.Items.Select(i => new OrderItemResponseDto
            {
                ProductId = i.ProductId,
                ProductName = i.ProductNameSnapshot,
                SKU = i.ProductSkuSnapshot,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice,
                LineTotal = i.LineTotal
            }).ToList(),
            // NEW
            CustomerName = order.User?.FullName,
            CustomerEmail = order.User?.Email 
        };
    }
}