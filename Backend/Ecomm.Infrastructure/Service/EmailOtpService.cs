using System.Security.Cryptography;
using System.Text;
using Ecomm.Application.DTOs.Auth;
using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Application.Interfaces.Services;

namespace Ecomm.Infrastructure.Service;

public class EmailOtpService : IEmailOtpService
{
    private readonly IUserRepository _users;
    private readonly IUnitOfWork _uow;
    private readonly IEmailSender _emailSender;

    private const int OtpExpiryMinutes = 10;
    private const int MaxAttempts = 5;
    private const int CooldownSeconds = 60;
    
    private static string GenerateOtp()
        => RandomNumberGenerator.GetInt32(100000, 999999).ToString();

    private static string HashOtp(string otp)
    {
        using var sha = SHA256.Create();
        return Convert.ToHexString(sha.ComputeHash(Encoding.UTF8.GetBytes(otp)));
    }

    public EmailOtpService(IUserRepository users, IUnitOfWork uow, IEmailSender emailSender)
    {
        _users = users;
        _uow = uow;
        _emailSender = emailSender;
    }

    public async Task SendOtpAsync(SendEmailOtpRequestDto request, CancellationToken ct = default)
{
    // 1. Normalize input
    var email = request.Email.Trim().ToLower();
    
    // 2. Fetch user from repository
    var user = await _users.GetByEmailAsync(email, ct);

    // 3. Security: Silent return if user doesn't exist or is already verified
    // This prevents "Account Enumeration" attacks where hackers check which emails exist.
    if (user == null || user.IsEmailVerified) return;

    // 4. Rate Limiting / Cooldown Check
    if (user.EmailOtpLastSentAtUtc.HasValue &&
        DateTime.UtcNow < user.EmailOtpLastSentAtUtc.Value.AddSeconds(CooldownSeconds))
    {
        throw new Exception($"Please wait before requesting another OTP.");
    }

    // 5. REVOKE OLD TOKEN (Senior's Suggestion)
    // Explicitly nullify to ensure old OTPs are dead before the new one is even hashed.
    user.EmailOtpHash = null;
    user.EmailOtpExpiresAtUtc = null;
    user.EmailOtpAttempts = 0;

    // 6. GENERATE NEW TOKEN
    var otp = GenerateOtp(); // Generates a 6-digit string
    
    user.EmailOtpHash = HashOtp(otp); // Store only the SHA256 hash, never the plain OTP
    user.EmailOtpExpiresAtUtc = DateTime.UtcNow.AddMinutes(OtpExpiryMinutes);
    user.EmailOtpLastSentAtUtc = DateTime.UtcNow;

    // 7. PERSIST TO DATABASE
    _users.Update(user);
    await _uow.SaveChangesAsync(ct);

    // 8. DISPATCH EMAIL
    var body = $@"
    <div style='font-family: sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;'>
        <h2 style='color: #333; text-align: center;'>Verification Code</h2>
        <p style='color: #666;'>Hello,</p>
        <p style='color: #666;'>Your one-time password (OTP) for account verification is:</p>
        <div style='background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #007bff; margin: 20px 0;'>
            {otp}
        </div>
        <p style='color: #999; font-size: 12px; text-align: center;'>
            This code will expire in {OtpExpiryMinutes} minutes. If you did not request this code, please ignore this email.
        </p>
    </div>";

    await _emailSender.SendAsync(user.Email, "Your Verification Code", body, ct);
}
  
    // public async Task SendOtpAsync(SendEmailOtpRequestDto request, CancellationToken ct = default)
    // {
    //     var user = await _users.GetByEmailAsync(request.Email.Trim().ToLower(), ct);
    //     if (user == null) return; // avoid enumeration
    //     if (user.IsEmailVerified) return;
    //
    //     if (user.EmailOtpLastSentAtUtc.HasValue &&
    //         DateTime.UtcNow < user.EmailOtpLastSentAtUtc.Value.AddSeconds(CooldownSeconds))
    //         throw new Exception("Please wait before requesting another OTP.");
    //
    //     var otp = GenerateOtp();
    //     user.EmailOtpHash = HashOtp(otp);
    //     user.EmailOtpExpiresAtUtc = DateTime.UtcNow.AddMinutes(OtpExpiryMinutes);
    //     user.EmailOtpAttempts = 0;
    //     user.EmailOtpLastSentAtUtc = DateTime.UtcNow;
    //
    //     _users.Update(user);
    //     await _uow.SaveChangesAsync(ct);
    //
    //     var body = $@"
    //     <div style='font-family:Arial'>
    //         <h2>Email Verification</h2>
    //         <p>Your OTP is:</p>
    //         <h1 style='letter-spacing:4px'>{otp}</h1>
    //         <p>Expires in {OtpExpiryMinutes} minutes.</p>
    //     </div>";
    //
    //     await _emailSender.SendAsync(user.Email, "Your Ecomm OTP", body, ct);
    // }


    public async Task VerifyOtpAsync(VerifyEmailOtpRequestDto request, CancellationToken ct = default)
    {
        var user = await _users.GetByEmailAsync(request.Email.Trim().ToLower(), ct);
        if (user == null) throw new Exception("Invalid OTP.");
        if (user.IsEmailVerified) return;

        if (string.IsNullOrWhiteSpace(user.EmailOtpHash) || !user.EmailOtpExpiresAtUtc.HasValue)
            throw new Exception("OTP not requested.");

        if (DateTime.UtcNow > user.EmailOtpExpiresAtUtc.Value)
            throw new Exception("OTP expired.");

        if (user.EmailOtpAttempts >= MaxAttempts)
            throw new Exception("Too many attempts. Please resend OTP.");

        var hash = HashOtp(request.Otp.Trim());
        if (hash != user.EmailOtpHash)
        {
            user.EmailOtpAttempts += 1;
            _users.Update(user);
            await _uow.SaveChangesAsync(ct);
            throw new Exception("Invalid OTP.");
        }

        user.IsEmailVerified = true;
        user.EmailOtpHash = null;
        user.EmailOtpExpiresAtUtc = null;
        user.EmailOtpAttempts = 0;
        user.EmailOtpLastSentAtUtc = null;

        _users.Update(user);
        await _uow.SaveChangesAsync(ct);
    }

}