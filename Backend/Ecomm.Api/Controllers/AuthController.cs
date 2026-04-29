// using Ecomm.Application.Common;
// using Ecomm.Application.DTOs.Auth;
// using Ecomm.Application.Interfaces.Services;
// using Microsoft.AspNetCore.Authorization;
// using Microsoft.AspNetCore.Mvc;
//
// namespace Ecomm.Api.Controllers;
//
// [ApiController]
// [Route("api/auth")]
// public class AuthController : ControllerBase
// {
//     private readonly IAuthService _authService;
//     private readonly ILogger<AuthController> _logger;
//
//     public AuthController(IAuthService authService, ILogger<AuthController> logger)
//     {
//         _authService = authService;
//         _logger = logger;
//     }
//
//     [HttpPost("register")]
//     public async Task<IActionResult> Register([FromBody] RegisterRequestDto request, CancellationToken ct)
//     {
//         _logger.LogInformation("Register requested for {Email}", request.Email);
//         var result = await _authService.RegisterAsync(request, ct);
//         return Ok(ApiResponse<AuthResponseDto>.Ok(result, "Registered successfully"));
//     }
//
//     [HttpPost("login")]
//     public async Task<IActionResult> Login([FromBody] LoginRequestDto request, CancellationToken ct)
//     {
//         var result = await _authService.LoginAsync(request, ct);
//         return Ok(ApiResponse<AuthResponseDto>.Ok(result, "Login successful"));
//     }
//     
//     
//     
//     [HttpPost("send-verification-otp")]
//     public async Task<IActionResult> SendVerificationOtp([FromBody] SendEmailOtpRequestDto request, CancellationToken ct)
//     {
//         await _authService.SendEmailOtpAsync(request, ct);
//         return Ok(ApiResponse<string>.Ok("Sent", "If account exists, OTP sent."));
//     }
//
//     [HttpPost("verify-email-otp")]
//     public async Task<IActionResult> VerifyEmailOtp([FromBody] VerifyEmailOtpRequestDto request, CancellationToken ct)
//     {
//         await _authService.VerifyEmailOtpAsync(request, ct);
//         return Ok(ApiResponse<string>.Ok("Verified", "Email verified successfully."));
//     }
//     
//     
//     [HttpPost("logout")]
//     [Authorize]
//     public async Task<IActionResult> Logout([FromBody] LogoutRequestDto request, CancellationToken ct)
//     {
//         await _authService.LogoutAsync(request.RefreshToken, ct);
//         return Ok(ApiResponse<string>.Ok("Logged out", "Logout successful"));
//     }
//
//     [HttpPost("refresh")]
//     public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequestDto request, CancellationToken ct)
//     {
//         var result = await _authService.RefreshTokenAsync(request, ct);
//         return Ok(ApiResponse<AuthResponseDto>.Ok(result, "Token refreshed"));
//     }
// }


using Ecomm.Api.Extensions;
using Ecomm.Application.Common;
using Ecomm.Application.DTOs.Auth;
using Ecomm.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecomm.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto request, CancellationToken ct)
    {
        _logger.LogInformation("Register requested for {Email}", request.Email);
        var result = await _authService.RegisterAsync(request, ct);
        return Ok(ApiResponse<AuthResponseDto>.Ok(result, "Registered successfully"));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request, CancellationToken ct)
    {
        var result = await _authService.LoginAsync(request, ct);
        return Ok(ApiResponse<AuthResponseDto>.Ok(result, "Login successful"));
    }

    [HttpPost("send-verification-otp")]
    public async Task<IActionResult> SendVerificationOtp([FromBody] SendEmailOtpRequestDto request, CancellationToken ct)
    {
        await _authService.SendEmailOtpAsync(request, ct);
        return Ok(ApiResponse<string>.Ok("Sent", "If account exists, OTP sent."));
    }

    [HttpPost("verify-email-otp")]
    public async Task<IActionResult> VerifyEmailOtp([FromBody] VerifyEmailOtpRequestDto request, CancellationToken ct)
    {
        await _authService.VerifyEmailOtpAsync(request, ct);
        return Ok(ApiResponse<string>.Ok("Verified", "Email verified successfully."));
    }

    [HttpPost("forgot-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDto request, CancellationToken ct)
    {
        await _authService.ForgotPasswordAsync(request, ct);
        return Ok(ApiResponse<string>.Ok("If account exists, reset instructions sent.", "Success"));
    }

    [HttpPost("reset-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequestDto request, CancellationToken ct)
    {
        await _authService.ResetPasswordAsync(request, ct);
        return Ok(ApiResponse<string>.Ok("Password reset successful.", "Success"));
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequestDto request, CancellationToken ct)
    {
        var userId = User.GetUserId();
        await _authService.ChangePasswordAsync(userId, request, ct);
        return Ok(ApiResponse<string>.Ok("Password changed successfully.", "Success"));
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout([FromBody] LogoutRequestDto request, CancellationToken ct)
    {
        await _authService.LogoutAsync(request.RefreshToken, ct);
        return Ok(ApiResponse<string>.Ok("Logged out", "Logout successful"));
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequestDto request, CancellationToken ct)
    {
        var result = await _authService.RefreshTokenAsync(request, ct);
        return Ok(ApiResponse<AuthResponseDto>.Ok(result, "Token refreshed"));
    }
}