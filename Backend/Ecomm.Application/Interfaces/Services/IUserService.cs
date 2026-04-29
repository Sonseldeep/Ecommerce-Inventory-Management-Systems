using Ecomm.Application.DTOs.User;

namespace Ecomm.Application.Interfaces.Services;

public interface IUserService
{
    Task<UserProfileDto> GetMeAsync(Guid userId, CancellationToken ct = default);
}