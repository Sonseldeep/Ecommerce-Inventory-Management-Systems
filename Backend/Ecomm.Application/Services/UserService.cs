using Ecomm.Application.DTOs.User;
using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Application.Interfaces.Services;

namespace Ecomm.Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _users;

    public UserService(IUserRepository users)
    {
        _users = users;
    }

    public async Task<UserProfileDto> GetMeAsync(Guid userId, CancellationToken ct = default)
    {
        var user = await _users.GetByIdAsync(userId, ct);
        if (user is null)
        {
            throw new Exception("User not found");
        }

        return new UserProfileDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role.ToString(),
            IsEmailVerified = user.IsEmailVerified,
        };
    }
}