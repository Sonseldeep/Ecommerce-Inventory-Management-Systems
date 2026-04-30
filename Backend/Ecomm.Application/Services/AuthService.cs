using System.Security.Cryptography;
using System.Text;
using Ecomm.Application.Common;
using Ecomm.Application.DTOs.Auth;
using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Application.Interfaces.Services;
using Ecomm.Domain.Entities;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace Ecomm.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _users;
    private readonly IRefreshTokenRepository _refreshTokens;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;
    private readonly IUnitOfWork _uow;
    private readonly ILogger<AuthService> _logger;
    private readonly IEmailOtpService _emailOtpService;
    private readonly IEmailSender _emailSender;
    
    private readonly IValidator<RegisterRequestDto> _registerValidator;
    private readonly IValidator<LoginRequestDto> _loginValidator;
    private readonly IValidator<ResetPasswordRequestDto> _resetPasswordValidator;
    private readonly IValidator<ForgotPasswordRequestDto> _forgotPasswordValidator;
    private readonly IValidator<ChangePasswordRequestDto> _changePasswordValidator;
    

    private const int RefreshTokenExpiryDays = 7;
    private const int ResetTokenExpiryMinutes = 15;
    private const int ResetCooldownSeconds = 60;
    private const int ResetMaxAttempts = 5;

    public AuthService(
        IUserRepository users,
        IRefreshTokenRepository refreshTokens,
        IPasswordHasher passwordHasher,
        ITokenService tokenService,
        IUnitOfWork uow,
        IEmailOtpService emailOtpService,
        IEmailSender emailSender,
        ILogger<AuthService> logger,
        IValidator<RegisterRequestDto> registerValidator,
        IValidator<LoginRequestDto> loginValidator,
        IValidator<ResetPasswordRequestDto> resetPasswordValidator,
        IValidator<ForgotPasswordRequestDto> forgotPasswordValidator,
        IValidator<ChangePasswordRequestDto> changePasswordValidator)
    {
        _users = users;
        _refreshTokens = refreshTokens;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
        _uow = uow;
        _emailOtpService = emailOtpService;
        _emailSender = emailSender;
        _logger = logger;
        _registerValidator = registerValidator;
        _loginValidator = loginValidator;
        _resetPasswordValidator = resetPasswordValidator;
        _forgotPasswordValidator = forgotPasswordValidator;
        _changePasswordValidator = changePasswordValidator;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request, CancellationToken ct = default)
    {
        await _registerValidator.ValidateAndThrowAsync(request, ct);
        
        var email = request.Email.Trim().ToLower();

        var existing = await _users.GetByEmailAsync(email, ct);
        if (existing is not null)
        {
            _logger.LogWarning("Registration failed: Email {Email} is already registered.", email);
            throw new BadRequestException("Email already registered.");
        }

        var user = new User
        {
            FullName = request.FullName.Trim(),
            Email = email,
            PasswordHash = _passwordHasher.Hash(request.Password),
            IsActive = true,
            IsEmailVerified = false
        };

        await _users.AddAsync(user, ct);
        await _uow.SaveChangesAsync(ct);

        var (accessToken, accessExp) = _tokenService.GenerateAccessToken(user);
        var refreshTokenValue = _tokenService.GenerateRefreshToken();

        var refreshToken = new RefreshToken
        {
            UserId = user.Id,
            Token = refreshTokenValue,
            ExpiresAtUtc = DateTime.UtcNow.AddDays(RefreshTokenExpiryDays),
            IsRevoked = false
        };

        await _refreshTokens.AddAsync(refreshToken, ct);
        await _uow.SaveChangesAsync(ct);

        _logger.LogInformation("User {Email} registered successfully with ID {UserId}.", email, user.Id);

        try
        {
            await _emailOtpService.SendOtpAsync(new SendEmailOtpRequestDto { Email = user.Email }, ct);
            _logger.LogInformation("Verification OTP sent to {Email}.", email);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "User registered but failed to send OTP to {Email}.", email);
        }

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshTokenValue,
            AccessTokenExpiresAtUtc = accessExp
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request, CancellationToken ct = default)
    {
        await _loginValidator.ValidateAndThrowAsync(request, ct);
        
        var email = request.Email.Trim().ToLower();
        var user = await _users.GetByEmailAsync(email, ct);

        if (user is null)
        {
            _logger.LogWarning("Login failed: User with email {Email} not found.", email);
            throw new UnauthorizedException("Invalid credentials.");
        }

        if (!user.IsActive)
        {
            _logger.LogWarning("Login failed: Account {Email} is inactive.", email);
            throw new UnauthorizedException("Invalid credentials.");
        }

        if (!_passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            _logger.LogWarning("Login failed: Incorrect password for {Email}.", email);
            throw new UnauthorizedException("Invalid credentials.");
        }

        if (!user.IsEmailVerified)
        {
            _logger.LogWarning("Login prevented: {Email} has not verified their email.", email);
            throw new BadRequestException("Please verify your email OTP before login.");
        }

        var (accessToken, accessExp) = _tokenService.GenerateAccessToken(user);
        var refreshTokenValue = _tokenService.GenerateRefreshToken();

        var refreshToken = new RefreshToken
        {
            UserId = user.Id,
            Token = refreshTokenValue,
            ExpiresAtUtc = DateTime.UtcNow.AddDays(RefreshTokenExpiryDays),
            IsRevoked = false
        };

        await _refreshTokens.AddAsync(refreshToken, ct);
        await _uow.SaveChangesAsync(ct);

        _logger.LogInformation("User {Email} logged in successfully.", email);

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshTokenValue,
            AccessTokenExpiresAtUtc = accessExp
        };
    }

    public async Task LogoutAsync(string refreshToken, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(refreshToken))
            return;

        var token = await _refreshTokens.GetByTokenAsync(refreshToken, ct);
        if (token is null)
        {
            _logger.LogDebug("Logout skipped: Refresh token not found in database.");
            return;
        }

        token.IsRevoked = true;
        _refreshTokens.Update(token);
        await _uow.SaveChangesAsync(ct);

        _logger.LogInformation("User with ID {UserId} logged out by revoking token.", token.UserId);
    }

    public async Task<AuthResponseDto> RefreshTokenAsync(RefreshTokenRequestDto request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.RefreshToken))
            throw new BadRequestException("Refresh token is required.");

        var existing = await _refreshTokens.GetByTokenAsync(request.RefreshToken, ct);

        if (existing is null)
        {
            _logger.LogWarning("Token refresh failed: Token does not exist.");
            throw new UnauthorizedException("Invalid refresh token.");
        }

        if (existing.IsRevoked || existing.ExpiresAtUtc <= DateTime.UtcNow)
        {
            _logger.LogWarning("Token refresh failed: Token for User {UserId} is revoked or expired.", existing.UserId);
            throw new UnauthorizedException("Invalid refresh token.");
        }

        var user = existing.User;
        if (!user.IsActive)
        {
            _logger.LogWarning("Token refresh failed: User associated with token is null or inactive.");
            throw new UnauthorizedException("Invalid user.");
        }

        existing.IsRevoked = true;
        _refreshTokens.Update(existing);

        var (accessToken, accessExp) = _tokenService.GenerateAccessToken(user);
        var newRefreshValue = _tokenService.GenerateRefreshToken();

        var newRefresh = new RefreshToken
        {
            UserId = user.Id,
            Token = newRefreshValue,
            ExpiresAtUtc = DateTime.UtcNow.AddDays(RefreshTokenExpiryDays),
            IsRevoked = false
        };

        await _refreshTokens.AddAsync(newRefresh, ct);
        await _uow.SaveChangesAsync(ct);

        _logger.LogInformation("Tokens successfully refreshed for User {Email}.", user.Email);

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = newRefreshValue,
            AccessTokenExpiresAtUtc = accessExp
        };
    }

    public async Task SendEmailOtpAsync(SendEmailOtpRequestDto request, CancellationToken ct = default)
    {
        _logger.LogInformation("Requesting manual OTP resend for {Email}.", request.Email);
        await _emailOtpService.SendOtpAsync(request, ct);
    }

    public async Task VerifyEmailOtpAsync(VerifyEmailOtpRequestDto request, CancellationToken ct = default)
    {
        try
        {
            await _emailOtpService.VerifyOtpAsync(request, ct);
            _logger.LogInformation("OTP successfully verified for {Email}.", request.Email);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "OTP verification failed for {Email}.", request.Email);
            throw;
        }
    }

    public async Task ForgotPasswordAsync(ForgotPasswordRequestDto request, CancellationToken ct = default)
    {
        await _forgotPasswordValidator.ValidateAndThrowAsync(request, ct);
        
        var email = request.Email.Trim().ToLower();
        var user = await _users.GetByEmailAsync(email, ct);

        if (user is null || !user.IsActive)
        {
            _logger.LogInformation("Forgot password requested for non-existing/inactive email {Email}.", email);
            return;
        }

        if (user.PasswordResetLastSentAtUtc.HasValue &&
            DateTime.UtcNow < user.PasswordResetLastSentAtUtc.Value.AddSeconds(ResetCooldownSeconds))
        {
            throw new BadRequestException("Please wait before requesting another reset email.");
        }
         

        
        var rawToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(48));
      

        user.PasswordResetTokenHash = Hash(rawToken);
        user.PasswordResetTokenExpiresAtUtc = DateTime.UtcNow.AddMinutes(ResetTokenExpiryMinutes);
        user.PasswordResetAttempts = 0;
        user.PasswordResetLastSentAtUtc = DateTime.UtcNow;

        _users.Update(user);
        await _uow.SaveChangesAsync(ct);

        var html =
            $@" <div style='font-family:Arial,sans-serif'> <h2>Password Reset</h2> <p>Use this reset token:</p> <pre style='padding:10px;background:#f4f4f4;border-radius:8px'>{rawToken}</pre> <p>This token expires in {ResetTokenExpiryMinutes} minutes.</p> </div>";

        await _emailSender.SendAsync(user.Email, "Ecomm Password Reset", html, ct);
        _logger.LogInformation("Password reset token sent to {Email}", user.Email);
    
    }

    public async Task ResetPasswordAsync(ResetPasswordRequestDto request, CancellationToken ct = default)
    {
        await _resetPasswordValidator.ValidateAndThrowAsync(request, ct);
        
        var email = request.Email.Trim().ToLower();
        var user = await _users.GetByEmailAsync(email, ct);

        if (user is null || !user.IsActive)
        {
            throw new BadRequestException("Invalid reset request.");
        }


        if (string.IsNullOrWhiteSpace(user.PasswordResetTokenHash) || !user.PasswordResetTokenExpiresAtUtc.HasValue)
        {
            throw new BadRequestException("Reset token not requested.");
        }


        if (DateTime.UtcNow > user.PasswordResetTokenExpiresAtUtc.Value)
        {
            throw new BadRequestException("Reset token expired.");
        }


        if (user.PasswordResetAttempts >= ResetMaxAttempts)
        {
            throw new BadRequestException("Too many attempts. Please request a new reset token.");
        }
           

        var tokenHash = Hash(request.Token.Trim());
        if (tokenHash != user.PasswordResetTokenHash)
        {
            user.PasswordResetAttempts += 1;
            _users.Update(user);
            await _uow.SaveChangesAsync(ct);
            throw new BadRequestException("Invalid reset token.");
        }

        user.PasswordHash = _passwordHasher.Hash(request.NewPassword);
        user.PasswordResetTokenHash = null;
        user.PasswordResetTokenExpiresAtUtc = null;
        user.PasswordResetAttempts = 0;
        user.PasswordResetLastSentAtUtc = null;

        _users.Update(user);
        await _uow.SaveChangesAsync(ct);

        _logger.LogInformation("Password reset successful for {Email}", email);
    }

    public async Task ChangePasswordAsync(Guid userId, ChangePasswordRequestDto request, CancellationToken ct = default)
    {
        await _changePasswordValidator.ValidateAndThrowAsync(request, ct);
        
        var user = await _users.GetByIdAsync(userId, ct);
        if (user is null || !user.IsActive)
        {
            throw new NotFoundException("User not found.");
        }


        if (!_passwordHasher.Verify(request.CurrentPassword, user.PasswordHash))
        {
            throw new BadRequestException("Current password is incorrect.");

        }
            
        // 1. Update Password
        user.PasswordHash = _passwordHasher.Hash(request.NewPassword);
    
        // 2. Update the timestamp (Crucial for the Program.cs)
        user.PasswordChangedAtUtc = DateTime.UtcNow;
        
        _users.Update(user);
        
        // 3. Revoke all refresh tokens so they must log in again on all devices
        await _refreshTokens.RevokeAllForUserAsync(user.Id, ct);
        await _uow.SaveChangesAsync(ct);

        _logger.LogInformation("Password changed successfully for userId {UserId}", userId);
    }

    private static string Hash(string value)
    {
        using var sha = SHA256.Create();
        var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(value));
        return Convert.ToHexString(bytes);
    }
}