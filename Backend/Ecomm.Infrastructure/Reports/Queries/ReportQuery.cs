using Ecomm.Application.DTOs.Admin;
using Ecomm.Application.Reports.DTOs;
using Ecomm.Application.Reports.Interfaces;
using Ecomm.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Ecomm.Infrastructure.Reports.Queries;

public class ReportQuery : IReportQuery
{
    private readonly AppDbContext _db;
    public ReportQuery(AppDbContext db) => _db = db;

    public async Task<List<InventorySummaryRow>> InventorySummaryAsync(ReportFilterDto f, CancellationToken ct)
    {
        var products = _db.Products.AsNoTracking().Where(p => !p.IsDeleted);
        if (f.IsActive.HasValue) products = products.Where(p => p.IsActive == f.IsActive);

        var total = await products.CountAsync(ct);
        var low = await products.CountAsync(p => p.QuantityInStock > 0 && p.QuantityInStock <= (p.ReorderLevel > 0 ? p.ReorderLevel : 5), ct);
        var outOf = await products.CountAsync(p => p.QuantityInStock == 0, ct);

        return
        [
            new InventorySummaryRow("Total Products", total),
            new InventorySummaryRow("Low Stock Products", low),
            new InventorySummaryRow("Out Of Stock Products", outOf)
        ];
    }

    public async Task<List<ProductStockRow>> LowStockAsync(ReportFilterDto f, CancellationToken ct)
    {
        var q = BaseProductQuery(f);
        return await q.Where(p => p.QuantityInStock > 0 && p.QuantityInStock <= (p.ReorderLevel > 0 ? p.ReorderLevel : 5))
            .Select(p => new ProductStockRow(p.Id, p.Name, p.SKU, p.QuantityInStock, p.ReorderLevel, p.Category!.Name, p.IsActive))
            .Take(f.Top ?? 1000)
            .ToListAsync(ct);
    }

    public async Task<List<ProductStockRow>> OutOfStockAsync(ReportFilterDto f, CancellationToken ct)
    {
        var q = BaseProductQuery(f);
        return await q.Where(p => p.QuantityInStock == 0)
            .Select(p => new ProductStockRow(p.Id, p.Name, p.SKU, p.QuantityInStock, p.ReorderLevel, p.Category!.Name, p.IsActive))
            .Take(f.Top ?? 1000)
            .ToListAsync(ct);
    }

    public async Task<List<ProductSalesRow>> BestSellingAsync(ReportFilterDto f, CancellationToken ct)
    {
        var since = f.FromUtc ?? DateTime.UtcNow.AddDays(-30);

        var query = _db.OrderItems.AsNoTracking()
            .Where(i => !i.IsDeleted && i.CreatedAtUtc >= since)
            .GroupBy(i => new { i.ProductId, i.ProductNameSnapshot, i.ProductSkuSnapshot })
            .Select(g => new
            {
                g.Key.ProductId,
                g.Key.ProductNameSnapshot,
                g.Key.ProductSkuSnapshot,
                QuantitySold = g.Sum(x => x.Quantity),
                TotalRevenue = g.Sum(x => x.LineTotal)
            })
            .OrderByDescending(x => x.QuantitySold)
            .Take(f.Top ?? 50);

        var rows = await query.ToListAsync(ct);

        return rows.Select(x => new ProductSalesRow(
            x.ProductId,
            x.ProductNameSnapshot,
            x.ProductSkuSnapshot,
            x.QuantitySold,
            x.TotalRevenue
        )).ToList();
    }

    public async Task<List<ProductSalesRow>> NonSellingAsync(ReportFilterDto f, CancellationToken ct)
    {
        var since = f.FromUtc ?? DateTime.UtcNow.AddDays(-30);

        var soldIds = await _db.OrderItems.AsNoTracking()
            .Where(i => !i.IsDeleted && i.CreatedAtUtc >= since)
            .Select(i => i.ProductId)
            .Distinct()
            .ToListAsync(ct);

        var q = BaseProductQuery(f).Where(p => !soldIds.Contains(p.Id));
        return await q.Select(p => new ProductSalesRow(p.Id, p.Name, p.SKU, 0, 0))
            .Take(f.Top ?? 100)
            .ToListAsync(ct);
    }

    public async Task<List<CategoryStockRow>> CategoryStockAsync(ReportFilterDto f, CancellationToken ct)
    {
        var q = BaseProductQuery(f);
        return await q.GroupBy(p => p.Category!.Name)
            .Select(g => new CategoryStockRow(g.Key, g.Sum(x => x.QuantityInStock), g.Count()))
            .ToListAsync(ct);
    }

    public async Task<List<TopBuyerRow>> TopBuyersAsync(ReportFilterDto f, CancellationToken ct)
    {
        var since = f.FromUtc ?? DateTime.UtcNow.AddDays(-30);

        var query = _db.Orders.AsNoTracking()
            .Where(o => !o.IsDeleted && o.CreatedAtUtc >= since)
            .GroupBy(o => new { o.UserId, o.User.FullName, o.User.Email })
            .Select(g => new
            {
                g.Key.UserId,
                g.Key.FullName,
                g.Key.Email,
                OrdersCount = g.Count(),
                TotalSpent = g.Sum(x => x.TotalAmount)
            })
            .OrderByDescending(x => x.TotalSpent)
            .Take(f.Top ?? 20);

        var rows = await query.ToListAsync(ct);

        return rows.Select(x => new TopBuyerRow(
            x.UserId,
            x.FullName,
            x.Email,
            x.OrdersCount,
            x.TotalSpent
        )).ToList();
    }

    public async Task<List<SalesSummaryRow>> SalesSummaryAsync(ReportFilterDto f, CancellationToken ct)
    {
        var from = f.FromUtc ?? DateTime.UtcNow.AddDays(-30);
        var to = f.ToUtc ?? DateTime.UtcNow;

        var query = _db.Orders.AsNoTracking()
            .Where(o => !o.IsDeleted && o.CreatedAtUtc >= from && o.CreatedAtUtc <= to)
            .GroupBy(o => o.CreatedAtUtc.Date)
            .Select(g => new
            {
                Date = g.Key,
                OrdersCount = g.Count(),
                Total = g.Sum(x => x.TotalAmount),
                Average = g.Average(x => x.TotalAmount)
            })
            .OrderBy(x => x.Date);

        var rows = await query.ToListAsync(ct);

        return rows.Select(x => new SalesSummaryRow(
            DateOnly.FromDateTime(x.Date),
            x.OrdersCount,
            x.Total,
            x.Average
        )).ToList();
    }
    private IQueryable<Domain.Entities.Product> BaseProductQuery(ReportFilterDto f)
    {
        var q = _db.Products.AsNoTracking()
            .Include(p => p.Category)
            .Where(p => !p.IsDeleted);

        if (!string.IsNullOrWhiteSpace(f.CategoryName))
            q = q.Where(p => p.Category != null && p.Category.Name == f.CategoryName);

        if (f.IsActive.HasValue)
            q = q.Where(p => p.IsActive == f.IsActive);

        return q;
    }
    public async Task<List<UserProductPurchaseDto>> UserPurchasesAsync(Guid userId, ReportFilterDto f, CancellationToken ct)
    {
        var since = f.FromUtc ?? DateTime.UtcNow.AddDays(-30);

        var orders = await _db.Orders.AsNoTracking()
            .Include(o => o.Items)
            .Where(o => !o.IsDeleted && o.UserId == userId && o.CreatedAtUtc >= since)
            .ToListAsync(ct);

        return orders
            .SelectMany(o => o.Items)
            .GroupBy(i => i.ProductId)
            .Select(g => new UserProductPurchaseDto
            {
                ProductId = g.Key,
                ProductName = g.First().ProductNameSnapshot,
                Quantity = g.Sum(x => x.Quantity),
                TotalSpent = g.Sum(x => x.LineTotal)
            })
            .OrderByDescending(x => x.TotalSpent)
            .ToList();
    }
    
    public async Task<Dictionary<string, List<CategoryInventoryItemRow>>> CategoryInventorySheetsAsync(ReportFilterDto f, CancellationToken ct)
    {
        var products = _db.Products.AsNoTracking()
            .Include(p => p.Category)
            .Where(p => !p.IsDeleted);

        if (!string.IsNullOrWhiteSpace(f.CategoryName))
            products = products.Where(p => p.Category != null && p.Category.Name == f.CategoryName);

        if (f.IsActive.HasValue)
            products = products.Where(p => p.IsActive == f.IsActive);

        var rows = await products
            .Select(p => new
            {
                Category = p.Category != null ? p.Category.Name : "Uncategorized",
                p.Id,
                p.Name,
                p.SKU,
                p.QuantityInStock
            })
            .ToListAsync(ct);

        return rows
            .GroupBy(x => x.Category)
            .ToDictionary(
                g => g.Key,
                g => g.Select(x => new CategoryInventoryItemRow(
                    x.Id,
                    x.Name,
                    x.SKU,
                    x.QuantityInStock,
                    x.QuantityInStock > 0 ? "In Stock" : "Out Of Stock"
                  
                )).ToList()
            );
    }
}