using Ecomm.Domain.Entities;

namespace Ecomm.Application.Interfaces.Repositories;

public interface ICartRepository : IRepository<Cart>
{
    Task<Cart?> GetByUserIdWithItemsAsync(Guid userId, CancellationToken ct = default);
}