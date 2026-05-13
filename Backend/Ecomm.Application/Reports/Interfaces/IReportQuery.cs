using Ecomm.Application.DTOs.Admin;
using Ecomm.Application.Reports.DTOs;

namespace Ecomm.Application.Reports.Interfaces;

public interface IReportQuery
{
    Task<List<InventorySummaryRow>> InventorySummaryAsync(ReportFilterDto f, CancellationToken ct);
    Task<List<ProductStockRow>> LowStockAsync(ReportFilterDto f, CancellationToken ct);
    Task<List<ProductStockRow>> OutOfStockAsync(ReportFilterDto f, CancellationToken ct);
    Task<List<ProductSalesRow>> BestSellingAsync(ReportFilterDto f, CancellationToken ct);
    Task<List<ProductSalesRow>> NonSellingAsync(ReportFilterDto f, CancellationToken ct);
    Task<List<CategoryStockRow>> CategoryStockAsync(ReportFilterDto f, CancellationToken ct);
    Task<List<TopBuyerRow>> TopBuyersAsync(ReportFilterDto f, CancellationToken ct);
    Task<List<SalesSummaryRow>> SalesSummaryAsync(ReportFilterDto f, CancellationToken ct);
    
    Task<Dictionary<string, List<CategoryInventoryItemRow>>> CategoryInventorySheetsAsync(ReportFilterDto f, CancellationToken ct);
}