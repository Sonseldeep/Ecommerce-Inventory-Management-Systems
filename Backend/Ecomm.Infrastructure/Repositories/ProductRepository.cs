
using Ecomm.Application.DTOs.Product;
using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Domain.Entities;
using Ecomm.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Ecomm.Infrastructure.Repositories;

public class ProductRepository : Repository<Product>, IProductRepository
{
    public ProductRepository(AppDbContext db) : base(db) { }

    public Task<bool> ExistsBySkuAsync(string sku, CancellationToken ct = default)
        => _db.Products.AnyAsync(x => x.SKU == sku && !x.IsDeleted, ct);

    public Task<Product?> GetByIdWithDetailsAsync(Guid id, CancellationToken ct = default)
        => _db.Products
            .Include(x => x.Category)
            .Include(x => x.Images.Where(i => !i.IsDeleted))
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, ct);

    public async Task<IEnumerable<Product>> GetAllWithDetailsAsync(CancellationToken ct = default)
        => await _db.Products
            .Include(x => x.Category)
            .Include(x => x.Images.Where(i => !i.IsDeleted))
            .Where(x => !x.IsDeleted)
            .ToListAsync(ct);

    public async Task<(IEnumerable<Product> Items, int TotalCount)> SearchAsync(
        ProductQueryParamsDto query,
        CancellationToken ct = default)
    {
        var q = _db.Products
            .Include(x => x.Category)
            .Include(x => x.Images.Where(i => !i.IsDeleted))
            .Where(x => !x.IsDeleted)
            .AsQueryable();

        // -------------------------
        // SEARCH
        // -------------------------
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim();

            q = q.Where(x =>
                x.Name.Contains(search) ||
                x.SKU.Contains(search));
        }

        // -------------------------
        // CATEGORY
        // -------------------------
        if (query.CategoryId.HasValue)
            q = q.Where(x => x.CategoryId == query.CategoryId.Value);

        // -------------------------
        // PRICE FILTER (FINAL PRICE LOGIC)
        // FinalPrice = DiscountPrice ?? Price
        // -------------------------
        if (query.MinPrice.HasValue)
        {
            q = q.Where(x =>
                (x.DiscountPrice ?? x.Price) >= query.MinPrice.Value);
        }

        if (query.MaxPrice.HasValue)
        {
            q = q.Where(x =>
                (x.DiscountPrice ?? x.Price) <= query.MaxPrice.Value);
        }

        // -------------------------
        // ACTIVE FILTER
        // -------------------------
        if (query.IsActive.HasValue)
            q = q.Where(x => x.IsActive == query.IsActive.Value);

        // -------------------------
        // SORTING
        // -------------------------
        q = (query.SortBy?.ToLower(), query.SortOrder?.ToLower()) switch
        {
            ("price", "asc") => q.OrderBy(x => (x.DiscountPrice ?? x.Price)),
            ("price", "desc") => q.OrderByDescending(x => (x.DiscountPrice ?? x.Price)),
            ("name", "asc") => q.OrderBy(x => x.Name),
            ("name", "desc") => q.OrderByDescending(x => x.Name),
            ("createdat", "asc") => q.OrderBy(x => x.CreatedAtUtc),
            _ => q.OrderByDescending(x => x.CreatedAtUtc)
        };

        // -------------------------
        // COUNT BEFORE PAGINATION
        // -------------------------
        var totalCount = await q.CountAsync(ct);

        // -------------------------
        // PAGINATION
        // -------------------------
        var items = await q
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(ct);

        return (items, totalCount);
    }
}
 