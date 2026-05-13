using Ecomm.Application.Reports.DTOs;

namespace Ecomm.Application.Reports.Interfaces;


public interface IReportService
{
    Task<ReportFileResultDto> ExportInventorySummaryAsync(ReportExportRequestDto req, CancellationToken ct);
    Task<ReportFileResultDto> ExportLowStockAsync(ReportExportRequestDto req, CancellationToken ct);
    Task<ReportFileResultDto> ExportOutOfStockAsync(ReportExportRequestDto req, CancellationToken ct);
    Task<ReportFileResultDto> ExportBestSellingAsync(ReportExportRequestDto req, CancellationToken ct);
    Task<ReportFileResultDto> ExportNonSellingAsync(ReportExportRequestDto req, CancellationToken ct);
    Task<ReportFileResultDto> ExportCategoryStockAsync(ReportExportRequestDto req, CancellationToken ct);
    Task<ReportFileResultDto> ExportTopBuyersAsync(ReportExportRequestDto req, CancellationToken ct);
    Task<ReportFileResultDto> ExportSalesSummaryAsync(ReportExportRequestDto req, CancellationToken ct);
    Task<ReportFileResultDto> ExportInventoryPackAsync(InventoryPackExportRequestDto req, CancellationToken ct);
    Task<ReportFileResultDto> ExportCategoryInventorySheetsAsync(ReportExportRequestDto req, CancellationToken ct);
    

}