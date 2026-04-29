using Ecomm.Application.DTOs.Order;
using FluentValidation;

namespace Ecomm.Application.Validators.Order;

public class CheckoutRequestValidator : AbstractValidator<CheckoutRequestDto>
{
    public CheckoutRequestValidator()
    {
        RuleFor(x => x.AddressId).NotEmpty();
    }
}