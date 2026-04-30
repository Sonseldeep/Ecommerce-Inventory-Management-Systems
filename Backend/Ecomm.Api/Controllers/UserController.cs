using Ecomm.Api.Extensions;
using Ecomm.Application.Common;
using Ecomm.Application.DTOs.User;
using Ecomm.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecomm.Api.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly IUserService _users;

    public UserController(IUserService users)
    {
        _users = users;
    }

    [HttpGet("me")]
    public async Task<IActionResult> Me(CancellationToken ct)
    {
        var userId = User.GetUserId();

        var profile = await _users.GetMeAsync(userId, ct);

        return Ok(ApiResponse<UserProfileDto>.Ok(
            profile,
            "User profile fetched successfully"
        ));
    }
}