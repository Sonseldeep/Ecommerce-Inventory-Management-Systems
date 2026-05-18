using Ecomm.Application.Common;
using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Application.Services;
using Ecomm.Domain.Entities;
using FakeItEasy;
using FluentAssertions;

namespace Ecomm.Tests.Services;

public class UserServiceTests
{
    private readonly IUserRepository _users = A.Fake<IUserRepository>();

    private UserService CreateSut() => new(_users);

    [Fact]
    public async Task GetMeAsync_Should_Return_User_Profile()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var user = new User
        {
            Id = userId,
            FullName = "John Doe",
            Email = "john@doe.com",
            IsEmailVerified = true,
            Role = Domain.Enums.UserRole.Customer
        };

        A.CallTo(() => _users.GetByIdAsync(userId, A<CancellationToken>._)).Returns(user);

        // Act
        var result = await CreateSut().GetMeAsync(userId);

        // Assert
        result.Id.Should().Be(userId);
        result.FullName.Should().Be("John Doe");
        result.Email.Should().Be("john@doe.com");
        result.IsEmailVerified.Should().BeTrue();
        result.Role.Should().Be("Customer");
    }

    [Fact]
    public async Task GetMeAsync_Should_Throw_When_User_Not_Found()
    {
        // Arrange
        var userId = Guid.NewGuid();
        A.CallTo(() => _users.GetByIdAsync(userId, A<CancellationToken>._)).Returns((User?)null);

        // Act
        var act = () => CreateSut().GetMeAsync(userId);

        // Assert
        await act.Should().ThrowAsync<NotFoundException>();
    }
}