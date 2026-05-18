using Ecomm.Application.Common;
using Ecomm.Application.DTOs.Auth;
using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Application.Interfaces.Services;
using Ecomm.Application.Services;
using Ecomm.Domain.Entities;
using FakeItEasy;
using FluentAssertions;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.Extensions.Logging;

namespace Ecomm.Tests.Services;

public class AuthServiceTests
{
    private readonly IUserRepository _users = A.Fake<IUserRepository>();
    private readonly IRefreshTokenRepository _refreshTokens = A.Fake<IRefreshTokenRepository>();
    private readonly IPasswordHasher _passwordHasher = A.Fake<IPasswordHasher>();
    private readonly ITokenService _tokenService = A.Fake<ITokenService>();
    private readonly IUnitOfWork _uow = A.Fake<IUnitOfWork>();
    private readonly IEmailOtpService _emailOtpService = A.Fake<IEmailOtpService>();
    private readonly IEmailSender _emailSender = A.Fake<IEmailSender>();
    private readonly ILogger<AuthService> _logger = A.Fake<ILogger<AuthService>>();

    private readonly IValidator<RegisterRequestDto> _registerValidator = A.Fake<IValidator<RegisterRequestDto>>();
    private readonly IValidator<LoginRequestDto> _loginValidator = A.Fake<IValidator<LoginRequestDto>>();
    private readonly IValidator<ResetPasswordRequestDto> _resetValidator = A.Fake<IValidator<ResetPasswordRequestDto>>();
    private readonly IValidator<ForgotPasswordRequestDto> _forgotValidator = A.Fake<IValidator<ForgotPasswordRequestDto>>();
    private readonly IValidator<ChangePasswordRequestDto> _changeValidator = A.Fake<IValidator<ChangePasswordRequestDto>>();

    private AuthService CreateSut()
    {
        return new AuthService(
            _users,
            _refreshTokens,
            _passwordHasher,
            _tokenService,
            _uow,
            _emailOtpService,
            _emailSender,
            _logger,
            _registerValidator,
            _loginValidator,
            _resetValidator,
            _forgotValidator,
            _changeValidator
        );
    }

    [Fact]
    public async Task RegisterAsync_Should_Create_User_And_Tokens()
    {
        // Arrange
        A.CallTo(() => _registerValidator.ValidateAsync(A<RegisterRequestDto>._, A<CancellationToken>._))
            .Returns(new ValidationResult());


        A.CallTo(() => _users.GetByEmailAsync("a@a.com", A<CancellationToken>._))
            .Returns((User?)null);

        A.CallTo(() => _passwordHasher.Hash("pass")).Returns("HASH");
        A.CallTo(() => _tokenService.GenerateAccessToken(A<User>._))
            .Returns(("ACCESS", DateTime.UtcNow.AddHours(1)));
        A.CallTo(() => _tokenService.GenerateRefreshToken()).Returns("REFRESH");

        var dto = new RegisterRequestDto { FullName = "A", Email = "a@a.com", Password = "pass" };

        // Act
        var result = await CreateSut().RegisterAsync(dto);

        // Assert
        result.AccessToken.Should().Be("ACCESS");
        result.RefreshToken.Should().Be("REFRESH");
        A.CallTo(() => _users.AddAsync(A<User>._, A<CancellationToken>._)).MustHaveHappened();
        A.CallTo(() => _refreshTokens.AddAsync(A<RefreshToken>._, A<CancellationToken>._)).MustHaveHappened();
        A.CallTo(() => _uow.SaveChangesAsync(A<CancellationToken>._)).MustHaveHappened(2, Times.Exactly);
    }

    [Fact]
    public async Task LoginAsync_Should_Throw_When_Password_Invalid()
    {
        // Arrange
        A.CallTo(() => _loginValidator.ValidateAsync(A<LoginRequestDto>._, A<CancellationToken>._))
            .Returns(new ValidationResult());

        var user = new User { Email = "a@a.com", IsActive = true, IsEmailVerified = true, PasswordHash = "HASH" };
        A.CallTo(() => _users.GetByEmailAsync("a@a.com", A<CancellationToken>._)).Returns(user);
        A.CallTo(() => _passwordHasher.Verify("wrong", "HASH")).Returns(false);

        // Act
        var act = () => CreateSut().LoginAsync(new LoginRequestDto { Email = "a@a.com", Password = "wrong" });

        // Assert
        await act.Should().ThrowAsync<UnauthorizedException>();
    }

    [Fact]
    public async Task RefreshTokenAsync_Should_Throw_When_Token_Revoked()
    {
        // Arrange
        var refresh = new RefreshToken { IsRevoked = true, ExpiresAtUtc = DateTime.UtcNow.AddHours(1), User = new User { IsActive = true } };
        A.CallTo(() => _refreshTokens.GetByTokenAsync("bad", A<CancellationToken>._)).Returns(refresh);

        // Act
        var act = () => CreateSut().RefreshTokenAsync(new RefreshTokenRequestDto { RefreshToken = "bad" });

        // Assert
        await act.Should().ThrowAsync<UnauthorizedException>();
    }
}