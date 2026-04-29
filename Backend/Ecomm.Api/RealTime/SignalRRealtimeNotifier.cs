using Ecomm.Api.Hubs;
using Ecomm.Application.DTOs.Order;
using Ecomm.Application.DTOs.Product;
using Ecomm.Application.Interfaces.Services;
using Microsoft.AspNetCore.SignalR;

namespace Ecomm.Api.RealTime;

public class SignalRRealtimeNotifier : IRealtimeNotifier
{
    private readonly IHubContext<NotificationsHub> _notifications;
    private readonly IHubContext<ProductsHub>  _products;

    public SignalRRealtimeNotifier(IHubContext<NotificationsHub> notifications, IHubContext<ProductsHub> products)
    {
        _notifications = notifications;
        _products = products;
    }

    public async Task OrderPlacedAsync(OrderResponseDto order, CancellationToken ct = default)
    {
        await _notifications.Clients.All.SendAsync("OrderPlaced", new
        {
            orderId = order.Id,
            orderNumber = order.OrderNumber,
            total = order.TotalAmount
        }, ct);
    }

    public async Task ProductUpdatedAsync(ProductResponseDto product, CancellationToken ct = default)
    {
        await _products.Clients.All.SendAsync("ProductUpdated", product, ct);
    }

    public async Task ProductCreatedAsync(ProductResponseDto product, CancellationToken ct = default)
    {
        await  _products.Clients.All.SendAsync("ProductCreated", product, ct);  
    }

    public async Task LowStockAsync(Guid productId, string productName, int remaining, int reorderLevel, CancellationToken ct = default)
    {
        await _notifications.Clients.All.SendAsync("LowStock", new
        {
            productId,
            productName,
            remaining,
            reorderLevel
        }, ct);
    }
}
