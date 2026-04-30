using Ecomm.Application.Common;
using Ecomm.Application.DTOs.Order;

namespace Ecomm.Application.Interfaces.Services;


public interface IOrderService
{
    Task<OrderResponseDto> CheckoutAsync(CheckoutRequestDto request, CancellationToken ct = default);
    Task<PagedResult<OrderResponseDto>> GetMyOrdersAsync(OrderQueryParamsDto query, CancellationToken ct = default);
}