using Ecomm.Domain.Enums;

namespace Ecomm.Application.DTOs.Order;

public class CheckoutRequestDto
{
    public Guid AddressId { get; set; }
    public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.COD;
}