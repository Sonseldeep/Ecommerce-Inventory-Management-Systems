using Ecomm.Application.DTOs.Cart;

namespace Ecomm.Application.Interfaces.Services;


public interface ICartService
{
    Task<CartResponseDto> GetMyCartAsync(CancellationToken ct = default);
    Task<CartResponseDto> AddItemAsync(AddToCartRequestDto request, CancellationToken ct = default);
    Task<CartResponseDto> UpdateItemAsync(Guid cartItemId, UpdateCartItemRequestDto request, CancellationToken ct = default);
    Task<CartResponseDto> RemoveItemAsync(Guid cartItemId, CancellationToken ct = default);
}