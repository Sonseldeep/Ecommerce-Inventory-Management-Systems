using Ecomm.Domain.Entities;

namespace Ecomm.Application.Interfaces.Services;

public interface ITokenService
{
    (string accessToken, DateTime expiresAtUtc) GenerateAccessToken(User user);
    string GenerateRefreshToken();
}