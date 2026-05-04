using Ecomm.Api.Hubs;
using Ecomm.Application.DTOs.Notifications;
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
    

    public async Task OrderPlacedAsync(OrderCreatedNotificationDto order, CancellationToken ct = default)
    {
        await _notifications.Clients.Group("Admins").SendAsync("OrderPlaced", order, ct);
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

    // public async Task ProductStockUpdatedAsync(Guid productId, string productName, int newStockLevel, CancellationToken ct)
    // {
    //     await _notifications.Clients.All.SendAsync("ProductStockUpdated", new 
    //     {
    //         Id = productId,
    //         Name = productName,
    //         QuantityInStock = newStockLevel
    //     }, ct);
    // }
    public async Task ProductStockUpdatedAsync(Guid productId, string productName, int newStockLevel, CancellationToken ct)
    {
        var payload = new 
        {
            Id = productId,
            Name = productName,
            QuantityInStock = newStockLevel
        };

        // 1. Send to Admins (Your existing, working code)
        await _notifications.Clients.All.SendAsync("ProductStockUpdated", payload, ct);

        // --- FIX: ALSO SEND TO PUBLIC PRODUCTS HUB ---
        // 2. Send the same message to all public users looking at the products page
        await _products.Clients.All.SendAsync("ProductStockUpdated", payload, ct);
    }
}
