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
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var data = await _service.GetAllOrdersAsync(ct);
        return Ok(ApiResponse<IEnumerable<OrderResponseDto>>.Ok(data));
    }

    [HttpPut("{orderId:guid}/status")]
    public async Task<IActionResult> UpdateStatus(Guid orderId, [FromBody] UpdateOrderStatusRequestDto request, CancellationToken ct)
    {
        var data = await _service.UpdateStatusAsync(orderId, request.Status, ct);
        return Ok(ApiResponse<OrderResponseDto>.Ok(data, "Order status updated"));
    }
}