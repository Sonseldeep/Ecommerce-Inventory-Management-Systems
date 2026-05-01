using Ecomm.Application.DTOs.Notifications;
using Ecomm.Application.DTOs.Order;
using Ecomm.Application.DTOs.Product;

namespace Ecomm.Application.Interfaces.Services;

public interface IRealtimeNotifier
{
    Task OrderPlacedAsync(OrderCreatedNotificationDto order, CancellationToken ct = default);
    

    Task ProductUpdatedAsync(ProductResponseDto product, CancellationToken ct = default);
    Task ProductCreatedAsync(ProductResponseDto product, CancellationToken ct = default); 
    
    Task LowStockAsync(Guid productId, string productName, int remaining, int reorderLevel, CancellationToken ct = default);
}

