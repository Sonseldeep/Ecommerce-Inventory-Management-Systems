using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Domain.Entities;
using Ecomm.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Ecomm.Infrastructure.Repositories;

public class CartRepository : Repository<Cart>, ICartRepository
{
    public CartRepository(AppDbContext db) : base(db) { }

    public Task<Cart?> GetByUserIdWithItemsAsync(Guid userId, CancellationToken ct = default)
    {
        return _db.Carts
            .Include(x => x.Items.Where(i => !i.IsDeleted))
            .ThenInclude(i => i.Product)
            .ThenInclude(p => p.Images)
            .FirstOrDefaultAsync(x => x.UserId == userId && !x.IsDeleted, ct);
    }
    public Task<Category?> GetByNameAsync(string name, CancellationToken ct = default)
        => _db.Categories
            .FirstOrDefaultAsync(x => x.Name.ToLower() == name.ToLower() && !x.IsDeleted, ct);

}