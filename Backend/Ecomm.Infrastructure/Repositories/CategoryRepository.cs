using Ecomm.Application.DTOs.Category;
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
    {
        return await _db.Categories
            .Where(x => !x.IsDeleted)
            .OrderBy(x => x.Name)
            .ToListAsync(ct);
    }

    public async Task<(IEnumerable<Category> Items, int TotalCount)> SearchAsync(CategoryQueryParamsDto query, CancellationToken ct = default)
    {
        var q = _db.Categories
            .Where(x => !x.IsDeleted)
            .AsQueryable();
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var s = query.Search.Trim();
            q = q.Where(x => x.Name.Contains(s));
        }
        q = (query.SortBy?.ToLower(), query.SortOrder?.ToLower()) switch
        {
            ("name", "desc") => q.OrderByDescending(x => x.Name),
            _ => q.OrderBy(x => x.Name)
        };
        var total = await q.CountAsync(ct);
        var items = await q
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(ct);

        return (items, total);

    }
    public Task<Category?> GetByNameAsync(string name, CancellationToken ct = default)
        => _db.Categories
            .FirstOrDefaultAsync(x => x.Name.ToLower() == name.ToLower() && !x.IsDeleted, ct);
}