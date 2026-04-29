using Ecomm.Domain.Enums;

namespace Ecomm.Application.DTOs.Order;

public class UpdateOrderStatusRequestDto
{
    public OrderStatus Status { get; set; }
}