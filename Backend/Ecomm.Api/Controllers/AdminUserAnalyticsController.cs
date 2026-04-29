using Ecomm.Application.Common;
using Ecomm.Application.DTOs.Admin;
using Ecomm.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecomm.Api.Controllers;


[ApiController]
[Route("api/admin/user-analytics")]
[Authorize(Roles = "Admin")]
public class AdminUserAnalyticsController : ControllerBase
{
    private readonly IAdminUserAnalyticsService _service;

    public AdminUserAnalyticsController(IAdminUserAnalyticsService service)
    {
        _service = service;
    }

    [HttpGet("summary")]
    public async Task<IActionResult> Summary([FromQuery] int days = 30, CancellationToken ct = default)
    {
        var data = await _service.GetSummaryAsync(days, ct);
        return Ok(ApiResponse<UserAnalyticsSummaryDto>.Ok(data));
    }

    [HttpGet("{userId:guid}/products")]
    public async Task<IActionResult> Products(Guid userId, [FromQuery] int days = 30, CancellationToken ct = default)
    {
        var data = await _service.GetUserPurchasesAsync(userId, days, ct);
        return Ok(ApiResponse<List<UserProductPurchaseDto>>.Ok(data));
    }
}