using Ecomm.Application.Common;
using Ecomm.Application.DTOs.Order;
using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Application.Interfaces.Services;
using Ecomm.Application.Mappings;
using Ecomm.Domain.Enums;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace Ecomm.Application.Services;

public class AdminOrderService : IAdminOrderService
{
    private readonly IOrderRepository _orders;
    private readonly IUnitOfWork _uow;
    private readonly ILogger<AdminOrderService> _logger;


    public AdminOrderService(IOrderRepository orders, IUnitOfWork uow, ILogger<AdminOrderService> logger, IValidator<UpdateOrderStatusRequestDto> updateOrderStatusRequestDtoValidator, IValidator<UpdateOrderStatusRequestDto> updateStatusValidator)
    {
        _orders = orders;
        _uow = uow;
        _logger = logger;
    }

    public async Task<IEnumerable<OrderResponseDto>> GetAllOrdersAsync(CancellationToken ct = default)
    {
        var orders = await _orders.GetAllWithItemsAsync(ct);
        return orders.Select(x => x.ToDto());
    }

    public async Task<OrderResponseDto> UpdateStatusAsync(Guid orderId, OrderStatus newStatus, CancellationToken ct = default)
    {

        var order = await _orders.GetByIdWithItemsAsync(orderId, ct)
                    ?? throw new NotFoundException("Order not found.");

        // basic transition guard
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