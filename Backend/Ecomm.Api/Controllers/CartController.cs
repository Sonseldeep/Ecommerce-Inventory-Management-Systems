using Ecomm.Application.Common;
using Ecomm.Application.DTOs.Cart;
using Ecomm.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecomm.Api.Controllers;

[ApiController]
[Route("api/cart")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly ICartService _service;

    public CartController(ICartService service)
    {
        _service = service;
    }

    
    [HttpGet]
    public async Task<IActionResult> GetMyCart(CancellationToken ct)
    {
        var data = await _service.GetMyCartAsync(ct);

        return Ok(ApiResponse<CartResponseDto>.Ok(
            data,
            "Cart fetched successfully"
        ));
    }

    
    [HttpPost("items")]
    public async Task<IActionResult> AddItem(
        [FromBody] AddToCartRequestDto request,
        CancellationToken ct)
    {
        var data = await _service.AddItemAsync(request, ct);

        return Ok(ApiResponse<CartResponseDto>.Ok(
            data,
            "Item added to cart"
        ));
    }

    [HttpPut("items/{cartItemId:guid}")]
    public async Task<IActionResult> UpdateItem(
        [FromRoute] Guid cartItemId,
        [FromBody] UpdateCartItemRequestDto request,
        CancellationToken ct)
    {
        var data = await _service.UpdateItemAsync(cartItemId, request, ct);

        return Ok(ApiResponse<CartResponseDto>.Ok(
            data,
            "Cart item updated successfully"
        ));
    }

    [HttpDelete("items/{cartItemId:guid}")]
    public async Task<IActionResult> RemoveItem(
        [FromRoute] Guid cartItemId,
        CancellationToken ct)
    {
        var data = await _service.RemoveItemAsync(cartItemId, ct);

        return Ok(ApiResponse<CartResponseDto>.Ok(
            data,
            "Cart item removed successfully"
        ));
    }
}