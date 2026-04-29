using Ecomm.Application.DTOs.Auth;

namespace Ecomm.Application.Interfaces.Services;

public interface IEmailOtpService
{
    Task SendOtpAsync(SendEmailOtpRequestDto request, CancellationToken ct = default);
    Task VerifyOtpAsync(VerifyEmailOtpRequestDto request, CancellationToken ct = default);
}