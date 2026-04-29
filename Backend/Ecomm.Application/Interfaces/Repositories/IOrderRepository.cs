using Ecomm.Domain.Entities;

namespace Ecomm.Application.Interfaces.Repositories;
public interface IOrderRepository : IRepository<Order>
{
    Task<IEnumerable<Order>> GetByUserIdWithItemsAsync(Guid userId, CancellationToken ct = default);
    Task<Order?> GetByIdWithItemsAsync(Guid orderId, CancellationToken ct = default);
    Task<IEnumerable<Order>> GetAllWithItemsAsync(CancellationToken ct = default);
}