using Ecomm.Application.Common;
using Ecomm.Application.DTOs.Admin;
using Ecomm.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecomm.Api.Controllers;

[ApiController]
[Route("api/admin/analytics")]
[Authorize(Roles = "Admin")]
    
public class AdminAnalyticsController : ControllerBase
{
    private readonly IAdminAnalyticsService _service;

    public AdminAnalyticsController(IAdminAnalyticsService service)
    {
        _service = service;
    }

    [HttpGet("inventory")]
    public async Task<IActionResult> Invetory(CancellationToken ct)
    {
        var data = await _service.GetInventoryAnalyticsAsync(ct);
        return Ok(ApiResponse<AdminInventoryAnalyticsDto>.Ok(data));
    }
}