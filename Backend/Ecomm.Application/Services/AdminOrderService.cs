using Ecomm.Application.Common;
using Ecomm.Application.DTOs.Order;
using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Application.Interfaces.Services;
using Ecomm.Application.Mappings;
using Ecomm.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace Ecomm.Application.Services;

public class AdminOrderService : IAdminOrderService
{
    private readonly IOrderRepository _orders;
    private readonly IUnitOfWork _uow;
    private readonly ILogger<AdminOrderService> _logger;

    public AdminOrderService(IOrderRepository orders, IUnitOfWork uow, ILogger<AdminOrderService> logger)
    {
        _orders = orders;
        _uow = uow;
        _logger = logger;
    }

    public async Task<PagedResult<OrderResponseDto>> GetAllOrdersAsync(OrderQueryParamsDto query, CancellationToken ct = default)
    {
        query.PageNumber = query.PageNumber <= 0 ? 1 : query.PageNumber;
        query.PageSize = query.PageSize <= 0 ? 10 : Math.Min(query.PageSize, 100);

        var (items, total) = await _orders.SearchAsync(query, null, ct);

        return new PagedResult<OrderResponseDto>
        {
            Items = items.Select(x => x.ToDto()),
            PageNumber = query.PageNumber,
            PageSize = query.PageSize,
            TotalCount = total
        };
    }

    public async Task<OrderResponseDto> UpdateStatusAsync(Guid orderId, OrderStatus status,
        CancellationToken ct = default)
    {
        if (!Enum.IsDefined(typeof(OrderStatus), status))
            throw new BadRequestException("Invalid order status.");

        var newStatus = (OrderStatus)status;

        var order = await _orders.GetByIdWithItemsAsync(orderId, ct)
                    ?? throw new NotFoundException("Order not found.");

        if (order.OrderStatus == OrderStatus.Cancelled || order.OrderStatus == OrderStatus.Delivered)
            throw new BadRequestException("Finalized orders cannot be changed.");

        order.OrderStatus = newStatus;

        if (newStatus == OrderStatus.Paid)
            order.PaymentStatus = PaymentStatus.Paid;

        _orders.Update(order);
        await _uow.SaveChangesAsync(ct);

        _logger.LogInformation("Order status updated. OrderId: {OrderId}, NewStatus: {Status}", orderId, newStatus);

        return order.ToDto();
    }
}