using Ecomm.Application.DTOs.Admin;
using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Application.Interfaces.Services;
using Microsoft.EntityFrameworkCore;

namespace Ecomm.Application.Services;

public class AdminUserAnalyticsService : IAdminUserAnalyticsService
{
    private readonly IUserRepository _users;
    private readonly IOrderRepository _orders;

    public AdminUserAnalyticsService(IUserRepository users, IOrderRepository orders)
    {
        _users = users;
        _orders = orders;
    }

    public async Task<UserAnalyticsSummaryDto> GetSummaryAsync(int days, CancellationToken ct = default)
    {
        var since = DateTime.UtcNow.AddDays(-days);

        var totalUsers = await _users.Query().CountAsync(ct);

        var orders = await _orders.Query()
            .Include(o => o.User)
            .Where(o => !o.IsDeleted && o.CreatedAtUtc >= since)
            .ToListAsync(ct);

        var topBuyers = orders
            .GroupBy(o => o.UserId)
            .Select(g => new UserSpendDto
            {
                UserId = g.Key,
                FullName = g.First().User.FullName,
                Email = g.First().User.Email,
                OrdersCount = g.Count(),
                TotalSpent = g.Sum(x => x.TotalAmount)
            })
            .OrderByDescending(x => x.TotalSpent)
            .Take(10)
            .ToList();

        return new UserAnalyticsSummaryDto
        {
            TotalUsers = totalUsers,
            TopBuyers = topBuyers
        };
    }

    public async Task<List<UserProductPurchaseDto>> GetUserPurchasesAsync(Guid userId, int days, CancellationToken ct = default)
    {
        var since = DateTime.UtcNow.AddDays(-days);

        var orders = await _orders.Query()
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
}