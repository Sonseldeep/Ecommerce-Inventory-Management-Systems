using Ecomm.Application.DTOs.Order;
using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Domain.Entities;
using Ecomm.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Ecomm.Infrastructure.Repositories;

public class OrderRepository : Repository<Order>, IOrderRepository
{
    public OrderRepository(AppDbContext db) : base(db) { }

    public async Task<IEnumerable<Order>> GetByUserIdWithItemsAsync(Guid userId, CancellationToken ct = default)
    {
        return await _db.Orders
            .Include(x => x.Items.Where(i => !i.IsDeleted))
            .Where(x => x.UserId == userId && !x.IsDeleted)
            .OrderByDescending(x => x.CreatedAtUtc)
            .ToListAsync(ct);
    }

    public async Task<IEnumerable<Order>> GetAllWithItemsAsync(CancellationToken ct = default)
    {
        return await _db.Orders
            .Include(o => o.User)
            .Include(o => o.Items)
            .Where(o => !o.IsDeleted)
            .ToListAsync(ct);
    }
 

    public async Task<(IEnumerable<Order> Items, int TotalCount)> SearchAsync(
        OrderQueryParamsDto query,
        Guid? userId = null,
        CancellationToken ct = default)
    {
        var q = _db.Orders
            .Include(o => o.User)
            .Include(o => o.Items.Where(i => !i.IsDeleted))
            .Where(o => !o.IsDeleted)
            .AsQueryable();

        if (userId.HasValue)
            q = q.Where(x => x.UserId == userId.Value);

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var s = query.Search.Trim();
            q = q.Where(x =>
                x.OrderNumber.Contains(s) ||
                (x.User != null && x.User.FullName.Contains(s)) ||
                (x.User != null && x.User.Email.Contains(s)));
        }

        if (!string.IsNullOrWhiteSpace(query.CustomerName))
            q = q.Where(x => x.User != null && x.User.FullName.Contains(query.CustomerName));

        if (!string.IsNullOrWhiteSpace(query.CustomerEmail))
            q = q.Where(x => x.User != null && x.User.Email.Contains(query.CustomerEmail));

        if (query.Status.HasValue)
            q = q.Where(x => x.OrderStatus == query.Status.Value);

        if (query.PaymentStatus.HasValue)
            q = q.Where(x => x.PaymentStatus == query.PaymentStatus.Value);

        if (query.DateFrom.HasValue)
            q = q.Where(x => x.CreatedAtUtc >= query.DateFrom.Value);

        if (query.DateTo.HasValue)
            q = q.Where(x => x.CreatedAtUtc <= query.DateTo.Value);

        q = (query.SortBy?.ToLower(), query.SortOrder?.ToLower()) switch
        {
            ("total", "asc") => q.OrderBy(x => x.TotalAmount),
            ("total", "desc") => q.OrderByDescending(x => x.TotalAmount),
            ("createdat", "asc") => q.OrderBy(x => x.CreatedAtUtc),
            _ => q.OrderByDescending(x => x.CreatedAtUtc)
        };

        var total = await q.CountAsync(ct);

        var items = await q
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(ct);

        return (items, total);
    }
    
    // public async Task<(IEnumerable<Order> Items, int TotalCount)> SearchAsync(
    //     OrderQueryParamsDto query,
    //     Guid? userId = null,
    //     CancellationToken ct = default)
    // {
    //     var q = _db.Orders
    //         .Include(o => o.User)
    //         .Include(o => o.Items.Where(i => !i.IsDeleted))
    //         .Where(o => !o.IsDeleted && !o.User.IsDeleted) 
    //         .AsQueryable();
    //
    //     if (userId.HasValue)
    //         q = q.Where(x => x.UserId == userId.Value);
    //
    //     if (!string.IsNullOrWhiteSpace(query.Search))
    //     {
    //         var s = query.Search.Trim();
    //         q = q.Where(x => x.OrderNumber.Contains(s));
    //     }
    //
    //     if (query.Status.HasValue)
    //         q = q.Where(x => x.OrderStatus == query.Status.Value);
    //
    //     if (query.PaymentStatus.HasValue)
    //         q = q.Where(x => x.PaymentStatus == query.PaymentStatus.Value);
    //
    //     if (query.DateFrom.HasValue)
    //         q = q.Where(x => x.CreatedAtUtc >= query.DateFrom.Value);
    //
    //     if (query.DateTo.HasValue)
    //         q = q.Where(x => x.CreatedAtUtc <= query.DateTo.Value);
    //
    //     // FIXED: Added null check for User navigation property
    //     if (!string.IsNullOrWhiteSpace(query.CustomerName))
    //         q = q.Where(x => x.User.FullName.Contains(query.CustomerName));
    //
    //     // FIXED: Added null check for User navigation property
    //     if (!string.IsNullOrWhiteSpace(query.CustomerEmail))
    //         q = q.Where(x => x.User.Email.Contains(query.CustomerEmail));
    //
    //     q = (query.SortBy?.ToLower(), query.SortOrder?.ToLower()) switch
    //     {
    //         ("total", "asc") => q.OrderBy(x => x.TotalAmount),
    //         ("total", "desc") => q.OrderByDescending(x => x.TotalAmount),
    //         ("createdat", "asc") => q.OrderBy(x => x.CreatedAtUtc),
    //         _ => q.OrderByDescending(x => x.CreatedAtUtc)
    //     };
    //
    //     var total = await q.CountAsync(ct);
    //
    //     var items = await q
    //         .Skip((query.PageNumber - 1) * query.PageSize)
    //         .Take(query.PageSize)
    //         .ToListAsync(ct);
    //
    //     return (items, total);
    // }
    public async Task<Order?> GetByIdWithItemsAsync(Guid id, CancellationToken ct = default)
    {
        return await _db.Orders
            .Include(o => o.User)
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id && !o.IsDeleted, ct);
    }
}