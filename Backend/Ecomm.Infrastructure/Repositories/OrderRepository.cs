using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Domain.Entities;
using Ecomm.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Ecomm.Infrastructure.Repositories;

public class OrderRepository : Repository<Order>, IOrderRepository
{
    public OrderRepository(AppDbContext db) : base(db) { }

    public async Task<IEnumerable<Order>> GetByUserIdWithItemsAsync(Guid userId, CancellationToken ct = default)
        => await _db.Orders
            .Include(x => x.Items.Where(i => !i.IsDeleted))
            .Where(x => x.UserId == userId && !x.IsDeleted)
            .OrderByDescending(x => x.CreatedAtUtc)
            .ToListAsync(ct);

    public async Task<IEnumerable<Order>> GetAllWithItemsAsync(CancellationToken ct = default)
    {
        return await _db.Orders
            .Include(o => o.User)
            .Include(o => o.Items)
            .Where(o => !o.IsDeleted)
            .ToListAsync(ct);
    }

    public async Task<Order?> GetByIdWithItemsAsync(Guid id, CancellationToken ct = default)
    {
        return await _db.Orders
            .Include(o => o.User)
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id && !o.IsDeleted, ct);
    }
}