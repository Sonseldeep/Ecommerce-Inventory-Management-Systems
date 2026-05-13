using Ecomm.Application.DTOs.Admin;
using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Application.Interfaces.Services;
using Ecomm.Application.Reports.DTOs;
using Ecomm.Application.Reports.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Ecomm.Application.Services;

public class AdminUserAnalyticsService : IAdminUserAnalyticsService
{
    private readonly IUserRepository _users;
    private readonly IOrderRepository _orders;
    private readonly IReportQuery _reportQuery;

    public AdminUserAnalyticsService(
        IUserRepository users,
        IOrderRepository orders,
        IReportQuery reportQuery)
    {
        _users = users;
        _orders = orders;
        _reportQuery = reportQuery;
    }

    public async Task<UserAnalyticsSummaryDto> GetSummaryAsync(int days, CancellationToken ct = default)
    {
        var from = DateTime.UtcNow.AddDays(-days);
        var to = DateTime.UtcNow;

        var totalUsers = await _users.Query().CountAsync(ct);

        var topBuyers = await _reportQuery.TopBuyersAsync(new ReportFilterDto
        {
            FromUtc = from,
            ToUtc = to,
            Top = 10
        }, ct);

        return new UserAnalyticsSummaryDto
        {
            TotalUsers = totalUsers,
            TopBuyers = topBuyers.Select(x => new UserSpendDto
            {
                UserId = x.UserId,
                FullName = x.FullName,
                Email = x.Email,
                OrdersCount = x.OrdersCount,
                TotalSpent = x.TotalSpent
            }).ToList()
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