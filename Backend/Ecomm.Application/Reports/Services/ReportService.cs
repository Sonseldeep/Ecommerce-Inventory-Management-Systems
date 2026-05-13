using Ecomm.Application.Reports.DTOs;
using Ecomm.Application.Reports.Interfaces;
using Microsoft.Extensions.Logging;

namespace Ecomm.Application.Reports.Services;

public class ReportService : IReportService
{
    private readonly IReportQuery _query;
    private readonly IReportExporter _exporter;
    private readonly ILogger<ReportService> _logger;

    public ReportService(IReportQuery query, IReportExporter exporter, ILogger<ReportService> logger)
    {
        _query = query;
        _exporter = exporter;
        _logger = logger;
    }

    public async Task<ReportFileResultDto> ExportInventorySummaryAsync(ReportExportRequestDto req, CancellationToken ct)
    {
        var rows = await _query.InventorySummaryAsync(req.Filters, ct);
        return _exporter.Export("InventorySummary", req.Format, rows);
    }

    public async Task<ReportFileResultDto> ExportLowStockAsync(ReportExportRequestDto req, CancellationToken ct)
        => _exporter.Export("LowStock", req.Format, await _query.LowStockAsync(req.Filters, ct));

    public async Task<ReportFileResultDto> ExportOutOfStockAsync(ReportExportRequestDto req, CancellationToken ct)
        => _exporter.Export("OutOfStock", req.Format, await _query.OutOfStockAsync(req.Filters, ct));

    public async Task<ReportFileResultDto> ExportBestSellingAsync(ReportExportRequestDto req, CancellationToken ct)
        => _exporter.Export("BestSelling", req.Format, await _query.BestSellingAsync(req.Filters, ct));

    public async Task<ReportFileResultDto> ExportNonSellingAsync(ReportExportRequestDto req, CancellationToken ct)
        => _exporter.Export("NonSelling", req.Format, await _query.NonSellingAsync(req.Filters, ct));

    public async Task<ReportFileResultDto> ExportCategoryStockAsync(ReportExportRequestDto req, CancellationToken ct)
        => _exporter.Export("CategoryStock", req.Format, await _query.CategoryStockAsync(req.Filters, ct));

    public async Task<ReportFileResultDto> ExportTopBuyersAsync(ReportExportRequestDto req, CancellationToken ct)
        => _exporter.Export("TopBuyers", req.Format, await _query.TopBuyersAsync(req.Filters, ct));

    public async Task<ReportFileResultDto> ExportSalesSummaryAsync(ReportExportRequestDto req, CancellationToken ct)
        => _exporter.Export("SalesSummary", req.Format, await _query.SalesSummaryAsync(req.Filters, ct));
    
    public async Task<ReportFileResultDto> ExportInventoryPackAsync(InventoryPackExportRequestDto req, CancellationToken ct)
    {
        var f = req.Filters;

        var summary = await _query.InventorySummaryAsync(f, ct);
        var low = await _query.LowStockAsync(f, ct);
        var outOf = await _query.OutOfStockAsync(f, ct);
        var cat = await _query.CategoryStockAsync(f, ct);
        var best = await _query.BestSellingAsync(f, ct);
        var non = await _query.NonSellingAsync(f, ct);
        var buyers = await _query.TopBuyersAsync(f, ct);
        var sales = await _query.SalesSummaryAsync(f, ct);

        return _exporter.ExportInventoryPack(summary, low, outOf, cat, best, non, buyers, sales);
    }
    
    public async Task<ReportFileResultDto> ExportCategoryInventorySheetsAsync(ReportExportRequestDto req, CancellationToken ct)
    {
        var sheets = await _query.CategoryInventorySheetsAsync(req.Filters, ct);
        return _exporter.ExportCategoryInventorySheets(sheets);
    }
    
}