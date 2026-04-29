using System.Security.Claims;
using Ecomm.Application.Common;
using Ecomm.Application.Interfaces.Repositories;
using Microsoft.AspNetCore.Http;

namespace Ecomm.Application.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid GetUserId()
    {
        var user = _httpContextAccessor.HttpContext?.User;

        var value = user?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                    ?? user?.FindFirst("sub")?.Value;

        if (!Guid.TryParse(value, out var userId))
            throw new UnauthorizedException("Invalid user token.");

        return userId;
    }

    public string GetEmail()
    {
        var user = _httpContextAccessor.HttpContext?.User;
        return user?.FindFirst(ClaimTypes.Email)?.Value
               ?? user?.FindFirst("email")?.Value
               ?? string.Empty;
    }

    public string GetRole()
    {
        var user = _httpContextAccessor.HttpContext?.User;
        return user?.FindFirst(ClaimTypes.Role)?.Value
               ?? string.Empty;
    }
}