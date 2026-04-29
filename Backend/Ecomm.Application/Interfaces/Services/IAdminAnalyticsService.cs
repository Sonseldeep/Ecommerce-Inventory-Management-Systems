using Ecomm.Application.DTOs.Admin;

namespace Ecomm.Application.Interfaces.Services;

public interface IAdminAnalyticsService
{
    Task<AdminInventoryAnalyticsDto> GetInventoryAnalyticsAsync(CancellationToken ct = default);
}