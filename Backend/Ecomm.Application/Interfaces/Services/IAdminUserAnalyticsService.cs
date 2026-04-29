using Ecomm.Application.DTOs.Admin;

namespace Ecomm.Application.Interfaces.Services;

public interface IAdminUserAnalyticsService
{
    Task<UserAnalyticsSummaryDto> GetSummaryAsync(int days, CancellationToken ct = default);
    Task<List<UserProductPurchaseDto>> GetUserPurchasesAsync(Guid userId, int days, CancellationToken ct = default);
}