using Ecomm.Domain.Enums;

namespace Ecomm.Application.DTOs.Order;

public class UpdateOrderStatusRequestDto
{
    public int Status { get; set; }
}