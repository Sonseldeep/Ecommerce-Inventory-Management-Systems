using Ecomm.Application.DTOs.Product;
using FluentValidation;

namespace Ecomm.Application.Validators.Product;

public class CreateProductRequestValidator : AbstractValidator<CreateProductRequestDto>
{
    public CreateProductRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(150);
        RuleFor(x => x.SKU).NotEmpty().MaximumLength(60);
        RuleFor(x => x.Description).NotEmpty().MaximumLength(2000);

        RuleFor(x => x.Price).GreaterThan(0);

        RuleFor(x => x.DiscountPrice)
            .GreaterThanOrEqualTo(0)
            .When(x => x.DiscountPrice.HasValue);

        RuleFor(x => x)
            .Must(x => !x.DiscountPrice.HasValue || x.DiscountPrice.Value == 0 || x.DiscountPrice.Value < x.Price)
            .WithMessage("DiscountPrice must be 0 or less than Price.");

        RuleFor(x => x.QuantityInStock).GreaterThanOrEqualTo(0);
        RuleFor(x => x.ReorderLevel).GreaterThanOrEqualTo(0);
        RuleFor(x => x.CategoryId).NotEmpty();

        // NO validation requiring imageUrls
    }
}

// public class CreateProductRequestValidator : AbstractValidator<CreateProductRequestDto>
// {
//     public CreateProductRequestValidator()
//     {
//         RuleFor(x => x.Name).NotEmpty().MaximumLength(150);
//         RuleFor(x => x.SKU).NotEmpty().MaximumLength(60);
//         RuleFor(x => x.Description).NotEmpty().MaximumLength(2000);
//
//         RuleFor(x => x.Price).GreaterThan(0);
//
//         RuleFor(x => x.DiscountPrice)
//             .GreaterThanOrEqualTo(0)
//             .When(x => x.DiscountPrice.HasValue);
//
//         RuleFor(x => x)
//             .Must(x => !x.DiscountPrice.HasValue || x.DiscountPrice.Value == 0 || x.DiscountPrice.Value < x.Price)
//             .WithMessage("DiscountPrice must be 0 or less than Price.");
//
//         RuleFor(x => x.QuantityInStock).GreaterThanOrEqualTo(0);
//         RuleFor(x => x.ReorderLevel).GreaterThanOrEqualTo(0);
//         RuleFor(x => x.CategoryId).NotEmpty();
//     }
// }

// public class CreateProductRequestValidator : AbstractValidator<CreateProductRequestDto>
// {
//     public CreateProductRequestValidator()
//     {
//         RuleFor(x => x.Name).NotEmpty().MaximumLength(150);
//         RuleFor(x => x.SKU).NotEmpty().MaximumLength(60);
//         RuleFor(x => x.Description).NotEmpty().MaximumLength(2000);
//         RuleFor(x => x.Price).GreaterThan(0);
//         RuleFor(x => x.DiscountPrice)
//             .GreaterThan(0).When(x => x.DiscountPrice.HasValue);
//         RuleFor(x => x.QuantityInStock).GreaterThanOrEqualTo(0);
//         RuleFor(x => x.ReorderLevel).GreaterThanOrEqualTo(0);
//         RuleFor(x => x.CategoryId).NotEmpty();
//     }
// }