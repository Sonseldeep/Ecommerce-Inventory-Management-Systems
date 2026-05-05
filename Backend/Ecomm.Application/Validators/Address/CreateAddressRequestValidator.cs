using Ecomm.Application.DTOs.Address;
using FluentValidation;

namespace Ecomm.Application.Validators.Address;

public class CreateAddressRequestValidator : AbstractValidator<CreateAddressRequestDto>
{
    public CreateAddressRequestValidator()
    {
        
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Full name is required")
            .MaximumLength(100);


        RuleFor(x => x.PhoneNumber)
            .NotEmpty().WithMessage("Phone number is required")
            .Matches(@"^\+?[0-9]{7,15}$")
            .WithMessage("Invalid phone number format");

        
        RuleFor(x => x.Line1)
            .NotEmpty().WithMessage("Address Line 1 is required")
            .MaximumLength(200);

        
        RuleFor(x => x.Line2)
            .MaximumLength(200);

      
        RuleFor(x => x.City)
            .NotEmpty().WithMessage("City is required")
            .MaximumLength(100);

       
        RuleFor(x => x.State)
            .NotEmpty().WithMessage("State is required")
            .MaximumLength(100);

       
        RuleFor(x => x.PostalCode)
            .NotEmpty().WithMessage("Postal code is required")
            .MaximumLength(20);

       
        RuleFor(x => x.Country)
            .NotEmpty().WithMessage("Country is required")
            .MaximumLength(100);

        
        RuleFor(x => x)
            .Must(x => !(string.IsNullOrWhiteSpace(x.Line1) && string.IsNullOrWhiteSpace(x.City)))
            .WithMessage("Address must contain at least Line1 and City");
    }
}