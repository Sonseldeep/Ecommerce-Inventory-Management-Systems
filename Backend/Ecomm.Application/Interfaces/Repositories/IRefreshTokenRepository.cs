using Ecomm.Domain.Entities;

namespace Ecomm.Application.Interfaces.Repositories;

public interface IRefreshTokenRepository : IRepository<RefreshToken>
{
    Task<RefreshToken?> GetByTokenAsync(string token, CancellationToken ct = default);
    
    Task RevokeAllForUserAsync(Guid userId, CancellationToken ct = default);
}