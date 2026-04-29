using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Domain.Entities;
using Ecomm.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Ecomm.Infrastructure.Repositories;

public class CategoryRepository : Repository<Category>, ICategoryRepository
{
    public CategoryRepository(AppDbContext db) : base(db) { }

    public async Task<bool> ExistsByNameAsync(string name, CancellationToken ct = default)
    {
        var normalized = name.Trim().ToLower();
        return await _db.Categories
            .AnyAsync(x => !x.IsDeleted && x.Name.Trim().ToLower() == normalized, ct);
    }

    public async Task<IEnumerable<Category>> GetActiveAsync(CancellationToken ct = default)
        => await _db.Categories
            .Where(x => !x.IsDeleted)
            .OrderBy(x => x.Name)
            .ToListAsync(ct);
}