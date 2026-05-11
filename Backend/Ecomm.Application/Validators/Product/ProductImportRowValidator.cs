using Ecomm.Application.DTOs.Product;
using FluentValidation;

namespace Ecomm.Application.Validators.Product;

public class ProductImportRowValidator : AbstractValidator<ProductImportRowDto>
{
    public ProductImportRowValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.SKU).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Price).GreaterThanOrEqualTo(0);
        RuleFor(x => x.QuantityInStock).GreaterThanOrEqualTo(0);
        RuleFor(x => x.ReorderLevel).GreaterThanOrEqualTo(0);
        RuleFor(x => x.CategoryName).NotEmpty().MaximumLength(100);
    }
}