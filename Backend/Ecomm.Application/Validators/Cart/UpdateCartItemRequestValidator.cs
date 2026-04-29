using Ecomm.Application.DTOs.Cart;
using FluentValidation;

namespace Ecomm.Application.Validators.Cart;


public class UpdateCartItemRequestValidator : AbstractValidator<UpdateCartItemRequestDto>
{
    public UpdateCartItemRequestValidator()
    {
        RuleFor(x => x.Quantity).GreaterThan(0);
    }
}