using Ecomm.Application.DTOs.Address;
using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Application.Services;
using FakeItEasy;
using FluentAssertions;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace Ecomm.Tests.Services;

public class AddressServiceTests
{
    private readonly IAddressRepository _addresses = A.Fake<IAddressRepository>();
    private readonly ICurrentUserService _currentUser = A.Fake<ICurrentUserService>();
    private readonly IUnitOfWork _uow = A.Fake<IUnitOfWork>();
    private readonly ILogger<AddressService> _logger = A.Fake<ILogger<AddressService>>();
    private readonly IValidator<CreateAddressRequestDto> _validator = A.Fake<IValidator<CreateAddressRequestDto>>();

    private AddressService CreateSut()
        => new(_addresses, _currentUser, _uow, _logger, _validator);

    [Fact]
    public async Task CreateAsync_Should_Create_Address_And_Save()
    {
        // Arrange
        var userId = Guid.NewGuid();

        A.CallTo(() => _currentUser.GetUserId())
            .Returns(userId);

        A.CallTo(() => _validator.Validate(A<CreateAddressRequestDto>._))
            .Returns(new FluentValidation.Results.ValidationResult());

        var dto = new CreateAddressRequestDto
        {
            FullName = "Pratik",
            PhoneNumber = "123",
            Line1 = "Line1",
            City = "City",
            State = "State",
            PostalCode = "1000",
            Country = "Country",
            IsDefault = false
        };

        // Act
        var result = await CreateSut().CreateAsync(dto);

        // Assert
        result.FullName.Should().Be("John");

        A.CallTo(() => _addresses.AddAsync(
                A<Domain.Entities.Address>._,
                A<CancellationToken>._))
            .MustHaveHappenedOnceExactly();

        A.CallTo(() => _uow.SaveChangesAsync(
                A<CancellationToken>._))
            .MustHaveHappenedOnceExactly();
    }
}