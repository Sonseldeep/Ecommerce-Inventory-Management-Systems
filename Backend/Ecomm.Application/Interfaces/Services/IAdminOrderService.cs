using Ecomm.Application.Common;
using Ecomm.Application.DTOs.Order;
using Ecomm.Domain.Enums;

namespace Ecomm.Application.Interfaces.Services;


public interface IAdminOrderService
{
    Task<PagedResult<OrderResponseDto>> GetAllOrdersAsync(OrderQueryParamsDto query, CancellationToken ct = default);
    Task<OrderResponseDto> UpdateStatusAsync(Guid orderId, int status, CancellationToken ct = default);
}