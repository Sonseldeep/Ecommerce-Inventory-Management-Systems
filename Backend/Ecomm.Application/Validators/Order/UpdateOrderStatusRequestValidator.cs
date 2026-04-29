using Ecomm.Application.DTOs.Order;
using FluentValidation;

namespace Ecomm.Application.Validators.Order;


public class UpdateOrderStatusRequestValidator : AbstractValidator<UpdateOrderStatusRequestDto>
{
    public UpdateOrderStatusRequestValidator()
    {
        RuleFor(x => x.Status).IsInEnum();
    }
}