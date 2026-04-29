using Ecomm.Application.DTOs.Cart;
using FluentValidation;

namespace Ecomm.Application.Validators.Cart;

public class AddToCartRequestValidator : AbstractValidator<AddToCartRequestDto>
{
    public AddToCartRequestValidator()
    {
        RuleFor(x => x.ProductId).NotEmpty();
        RuleFor(x => x.Quantity).GreaterThan(0);
    }
}