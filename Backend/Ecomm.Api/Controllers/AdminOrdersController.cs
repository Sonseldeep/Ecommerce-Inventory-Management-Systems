using Ecomm.Application.Common;
using Ecomm.Application.DTOs.Order;
using Ecomm.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecomm.Api.Controllers;

[ApiController]
[Route("api/admin/orders")]
[Authorize(Roles = "Admin")]
public class AdminOrdersController : ControllerBase
{
    private readonly IAdminOrderService _service;

    public AdminOrdersController(IAdminOrderService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] OrderQueryParamsDto query, CancellationToken ct)
    {
        var data = await _service.GetAllOrdersAsync(query, ct);
        return Ok(ApiResponse<PagedResult<OrderResponseDto>>.Ok(data));
    }

    [HttpPut("{orderId:guid}/status")]
    public async Task<IActionResult> UpdateStatus([FromRoute] Guid orderId, [FromBody] UpdateOrderStatusRequestDto request, CancellationToken ct)
    {
        var data = await _service.UpdateStatusAsync(orderId, request.Status, ct);
        return Ok(ApiResponse<OrderResponseDto>.Ok(data, "Order status updated"));
    }
}