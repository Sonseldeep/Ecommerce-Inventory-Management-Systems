using Ecomm.Domain.Common;
using Ecomm.Domain.Enums;

namespace Ecomm.Domain.Entities;

public class User : BaseEntity
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.Customer;
    public bool IsActive { get; set; } = true;
    
    // OTP Email Verification
    public bool IsEmailVerified { get; set; } = false;
    public string? EmailOtpHash { get; set; }
    public DateTime? EmailOtpExpiresAtUtc { get; set; }
    public int EmailOtpAttempts { get; set; } = 0;
    public DateTime? EmailOtpLastSentAtUtc { get; set; }

    // Password reset
    public string? PasswordResetTokenHash { get; set; }
    public DateTime? PasswordResetTokenExpiresAtUtc { get; set; }
    public int PasswordResetAttempts { get; set; } = 0;
    public DateTime? PasswordResetLastSentAtUtc { get; set; }
    
    
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    public ICollection<Address> Addresses { get; set; } = new List<Address>();
    public Cart? Cart { get; set; }
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    
    // Revoke Refresh token
    public DateTime PasswordChangedAtUtc { get; set; } = DateTime.UtcNow;
    
}