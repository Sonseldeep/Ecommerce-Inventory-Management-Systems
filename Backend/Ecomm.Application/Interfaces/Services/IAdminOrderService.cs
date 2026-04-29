using Ecomm.Application.DTOs.Order;
using Ecomm.Domain.Enums;

namespace Ecomm.Application.Interfaces.Services;


public interface IAdminOrderService
{
    Task<IEnumerable<OrderResponseDto>> GetAllOrdersAsync(CancellationToken ct = default);
    Task<OrderResponseDto> UpdateStatusAsync(Guid orderId, OrderStatus newStatus, CancellationToken ct = default);
}