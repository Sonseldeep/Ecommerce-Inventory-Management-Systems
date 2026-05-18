using System.Security.Claims;
using Ecomm.Application.Common;
using Ecomm.Application.Services;
using FakeItEasy;
using FluentAssertions;
using Microsoft.AspNetCore.Http;

namespace Ecomm.Tests.Services;

public class CurrentUserServiceTests
{
    [Fact]
    public void GetUserId_Should_Return_UserId_From_Claims()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Email, "user@test.com"),
            new Claim(ClaimTypes.Role, "Admin")
        };
        var identity = new ClaimsIdentity(claims, "Test");
        var principal = new ClaimsPrincipal(identity);

        var httpContext = new DefaultHttpContext { User = principal };
        var accessor = A.Fake<IHttpContextAccessor>();
        accessor.HttpContext = httpContext;

        var sut = new CurrentUserService(accessor);

        // Act
        var result = sut.GetUserId();

        // Assert
        result.Should().Be(userId);
    }

    [Fact]
    public void GetUserId_Should_Throw_When_Invalid_Guid()
    {
        // Arrange
        var claims = new[] { new Claim(ClaimTypes.NameIdentifier, "not-a-guid") };
        var identity = new ClaimsIdentity(claims, "Test");
        var principal = new ClaimsPrincipal(identity);

        var httpContext = new DefaultHttpContext { User = principal };
        var accessor = A.Fake<IHttpContextAccessor>();
        accessor.HttpContext = httpContext;

        var sut = new CurrentUserService(accessor);

        // Act
        var act = () => sut.GetUserId();

        // Assert
        act.Should().Throw<UnauthorizedException>();
    }

    [Fact]
    public void GetEmail_Should_Return_Email_Claim()
    {
        // Arrange
        var claims = new[] { new Claim(ClaimTypes.Email, "user@test.com") };
        var identity = new ClaimsIdentity(claims, "Test");
        var principal = new ClaimsPrincipal(identity);

        var httpContext = new DefaultHttpContext { User = principal };
        var accessor = A.Fake<IHttpContextAccessor>();
        accessor.HttpContext = httpContext;

        var sut = new CurrentUserService(accessor);

        // Act
        var email = sut.GetEmail();

        // Assert
        email.Should().Be("user@test.com");
    }

    [Fact]
    public void GetRole_Should_Return_Role_Claim()
    {
        // Arrange
        var claims = new[] { new Claim(ClaimTypes.Role, "Admin") };
        var identity = new ClaimsIdentity(claims, "Test");
        var principal = new ClaimsPrincipal(identity);

        var httpContext = new DefaultHttpContext { User = principal };
        var accessor = A.Fake<IHttpContextAccessor>();
        accessor.HttpContext = httpContext;

        var sut = new CurrentUserService(accessor);

        // Act
        var role = sut.GetRole();

        // Assert
        role.Should().Be("Admin");
    }
}