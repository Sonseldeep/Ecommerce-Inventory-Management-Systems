using Ecomm.Application.Reports.DTOs;

namespace Ecomm.Application.Reports.Interfaces;

public interface IReportExporter
{
    ReportFileResultDto Export<T>(string reportName, string format, IEnumerable<T> rows);

    ReportFileResultDto ExportInventoryPack(
        IEnumerable<InventorySummaryRow> summary,
        IEnumerable<ProductStockRow> lowStock,
        IEnumerable<ProductStockRow> outOfStock,
        IEnumerable<CategoryStockRow> categoryStock,
        IEnumerable<ProductSalesRow> bestSelling,
        IEnumerable<ProductSalesRow> nonSelling,
        IEnumerable<TopBuyerRow> topBuyers,
        IEnumerable<SalesSummaryRow> salesSummary
    );
    ReportFileResultDto ExportCategoryInventorySheets(
        Dictionary<string, List<CategoryInventoryItemRow>> sheets
    );
}