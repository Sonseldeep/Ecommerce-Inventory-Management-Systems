using Ecomm.Application.Common;
using Ecomm.Application.DTOs.Order;
using Ecomm.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecomm.Api.Controllers;

[ApiController]
[Route("api/orders")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _service;

    public OrdersController(IOrderService service)
    {
        _service = service;
    }

    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout([FromBody] CheckoutRequestDto request, CancellationToken ct)
    {
        var data = await _service.CheckoutAsync(request, ct);

        return Ok(ApiResponse<OrderResponseDto>.Ok(
            data,
            "Order placed successfully"
        ));
    }

    [HttpGet("my-orders")]
    public async Task<IActionResult> MyOrders([FromQuery] OrderQueryParamsDto query, CancellationToken ct)
    {
        var data = await _service.GetMyOrdersAsync(query, ct);

        return Ok(ApiResponse<PagedResult<OrderResponseDto>>.Ok(
            data,
            "Orders fetched successfully"
        ));
    }
}