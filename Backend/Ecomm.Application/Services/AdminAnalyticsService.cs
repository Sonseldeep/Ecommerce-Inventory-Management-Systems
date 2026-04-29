// using Ecomm.Application.DTOs.Admin;
// using Ecomm.Application.Interfaces.Repositories;
// using Ecomm.Application.Interfaces.Services;
// using Microsoft.EntityFrameworkCore;
//
// namespace Ecomm.Application.Services;
//
// public class AdminAnalyticsService : IAdminAnalyticsService
// {
//     private readonly IProductRepository _products;
//     private readonly IOrderRepository _orders;
//
//     public AdminAnalyticsService(IProductRepository products, IOrderRepository orders)
//     {
//         _products = products;
//         _orders = orders;
//     }
//
//     public async Task<AdminInventoryAnalyticsDto> GetInventoryAnalyticsAsync(CancellationToken ct = default)
//     {
//         var products = await _products.Query()
//             .Include(p => p.Category)
//             .Where(p => !p.IsDeleted)
//             .ToListAsync(ct);
//
//         var ordersLast30 = await _orders.Query()
//             .Include(o => o.Items)
//             .Where(o => !o.IsDeleted && o.CreatedAtUtc >= DateTime.UtcNow.AddDays(-30))
//             .ToListAsync(ct);
//
//         var totalProducts = products.Count;
//         var lowStockCount = products.Count(p => p.QuantityInStock <= p.ReorderLevel && p.QuantityInStock > 0);
//         var outOfStockCount = products.Count(p => p.QuantityInStock == 0);
//
//         var topStock = products
//             .OrderByDescending(p => p.QuantityInStock)
//             .Take(10)
//             .Select(p => new TopProductDto { ProductId = p.Id, ProductName = p.Name, Quantity = p.QuantityInStock })
//             .ToList();
//
//         var soldMap = ordersLast30
//             .SelectMany(o => o.Items)
//             .GroupBy(i => i.ProductId)
//             .Select(g => new { ProductId = g.Key, Qty = g.Sum(x => x.Quantity) })
//             .ToDictionary(x => x.ProductId, x => x.Qty);
//
//         var bestSellers = soldMap
//             .OrderByDescending(x => x.Value)
//             .Take(10)
//             .Select(x => new TopProductDto
//             {
//                 ProductId = x.Key,
//                 ProductName = products.FirstOrDefault(p => p.Id == x.Key)?.Name ?? "Unknown",
//                 Quantity = x.Value
//             }).ToList();
//
//         var notSelling = products
//             .Where(p => !soldMap.ContainsKey(p.Id))
//             .Take(10)
//             .Select(p => new TopProductDto
//             {
//                 ProductId = p.Id,
//                 ProductName = p.Name,
//                 Quantity = 0
//             }).ToList();
//
//         var categoryStock = products
//             .GroupBy(p => p.Category?.Name ?? "Uncategorized")
//             .Select(g => new CategoryStockDto
//             {
//                 CategoryName = g.Key,
//                 TotalStock = g.Sum(x => x.QuantityInStock)
//             }).ToList();
//
//         return new AdminInventoryAnalyticsDto
//         {
//             TotalProducts = totalProducts,
//             LowStockCount = lowStockCount,
//             OutOfStockCount = outOfStockCount,
//             TopStockProducts = topStock,
//             BestSellersLast30Days = bestSellers,
//             NotSellingLast30Days = notSelling,
//             CategoryStock = categoryStock
//         };
//     }
// }



using Ecomm.Application.DTOs.Admin;
using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Application.Interfaces.Services;
using Microsoft.EntityFrameworkCore;

namespace Ecomm.Application.Services;

public class AdminAnalyticsService : IAdminAnalyticsService
{
    private readonly IProductRepository _products;
    private readonly IOrderRepository _orders;

    public AdminAnalyticsService(IProductRepository products, IOrderRepository orders)
    {
        _products = products;
        _orders = orders;
    }

    public async Task<AdminInventoryAnalyticsDto> GetInventoryAnalyticsAsync(CancellationToken ct = default)
    {
        // ✅ Consistent date
        var last30Days = DateTime.UtcNow.AddDays(-30);

        // ✅ Load products
        var products = await _products.Query()
            .Include(p => p.Category)
            .Where(p => !p.IsDeleted)
            .ToListAsync(ct);

        // ✅ Load orders (last 30 days only)
        var ordersLast30 = await _orders.Query()
            .Include(o => o.Items)
            .Where(o => !o.IsDeleted && o.CreatedAtUtc >= last30Days)
            .ToListAsync(ct);

        // ✅ Basic counts
        var totalProducts = products.Count;

        var lowStockCount = products.Count(p =>
            p.QuantityInStock > 0 &&
            p.QuantityInStock <= (p.ReorderLevel > 0 ? p.ReorderLevel : 5));

        var outOfStockCount = products.Count(p => p.QuantityInStock == 0);

        // ✅ Top stock (highest inventory)
        var topStock = products
            .OrderByDescending(p => p.QuantityInStock)
            .Take(10)
            .Select(p => new TopProductDto
            {
                ProductId = p.Id,
                ProductName = p.Name,
                Quantity = p.QuantityInStock
            })
            .ToList();

        //  Create product lookup (fix O(n²) issue)
        var productMap = products.ToDictionary(p => p.Id, p => p.Name);

        //  Sold map (ProductId -> total sold)
        var soldMap = ordersLast30
            .SelectMany(o => o.Items)
            .GroupBy(i => i.ProductId)
            .ToDictionary(g => g.Key, g => g.Sum(x => x.Quantity));

        //  Bestsellers
        var bestSellers = soldMap
            .OrderByDescending(x => x.Value)
            .Take(10)
            .Select(x => new TopProductDto
            {
                ProductId = x.Key,
                ProductName = productMap.GetValueOrDefault(x.Key, "Unknown"),
                Quantity = x.Value
            })
            .ToList();

        //  Not selling (ordered by highest stock → more useful)
        var notSelling = products
            .Where(p => !soldMap.ContainsKey(p.Id))
            .OrderByDescending(p => p.QuantityInStock)
            .Take(10)
            .Select(p => new TopProductDto
            {
                ProductId = p.Id,
                ProductName = p.Name,
                Quantity = 0
            })
            .ToList();

        //  Category stock
        var categoryStock = products
            .GroupBy(p => string.IsNullOrEmpty(p.Category?.Name)
                ? "Uncategorized"
                : p.Category.Name)
            .Select(g => new CategoryStockDto
            {
                CategoryName = g.Key,
                TotalStock = g.Sum(x => x.QuantityInStock)
            })
            .ToList();

        // ✅ Final response
        return new AdminInventoryAnalyticsDto
        {
            TotalProducts = totalProducts,
            LowStockCount = lowStockCount,
            OutOfStockCount = outOfStockCount,
            TopStockProducts = topStock,
            BestSellersLast30Days = bestSellers,
            NotSellingLast30Days = notSelling,
            CategoryStock = categoryStock
        };
    }
}