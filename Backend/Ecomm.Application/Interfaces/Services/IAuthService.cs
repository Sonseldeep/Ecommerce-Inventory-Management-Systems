using Ecomm.Application.DTOs.Auth;

namespace Ecomm.Application.Interfaces.Services;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request, CancellationToken ct = default);
    Task<AuthResponseDto> LoginAsync(LoginRequestDto request, CancellationToken ct = default);
    Task<AuthResponseDto> RefreshTokenAsync(RefreshTokenRequestDto request, CancellationToken ct = default);
    
    Task LogoutAsync(string refreshToken, CancellationToken ct = default);
    
    
    // otp 
    Task SendEmailOtpAsync(SendEmailOtpRequestDto request, CancellationToken ct = default);
    Task VerifyEmailOtpAsync(VerifyEmailOtpRequestDto request, CancellationToken ct = default);
    
    // forget reset change password
    
    Task ForgotPasswordAsync(ForgotPasswordRequestDto request, CancellationToken ct = default);
    Task ResetPasswordAsync(ResetPasswordRequestDto request, CancellationToken ct = default);
    Task ChangePasswordAsync(Guid userId, ChangePasswordRequestDto request, CancellationToken ct = default);

}