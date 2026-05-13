using Ecomm.Application.Reports.DTOs;
using Ecomm.Application.Reports.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecomm.Api.Controllers;

[ApiController]
[Route("api/admin/reports")]
[Authorize(Roles = "Admin")]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reports;
    public ReportsController(IReportService reports) => _reports = reports;

    [HttpPost("inventory-summary")]
    public Task<IActionResult> InventorySummary([FromBody] ReportExportRequestDto req, CancellationToken ct)
        => Download(_reports.ExportInventorySummaryAsync(req, ct));

    [HttpPost("low-stock")]
    public Task<IActionResult> LowStock([FromBody] ReportExportRequestDto req, CancellationToken ct)
        => Download(_reports.ExportLowStockAsync(req, ct));

    [HttpPost("out-of-stock")]
    public Task<IActionResult> OutOfStock([FromBody] ReportExportRequestDto req, CancellationToken ct)
        => Download(_reports.ExportOutOfStockAsync(req, ct));

    [HttpPost("best-selling")]
    public Task<IActionResult> BestSelling([FromBody] ReportExportRequestDto req, CancellationToken ct)
        => Download(_reports.ExportBestSellingAsync(req, ct));

    [HttpPost("non-selling")]
    public Task<IActionResult> NonSelling([FromBody] ReportExportRequestDto req, CancellationToken ct)
        => Download(_reports.ExportNonSellingAsync(req, ct));

    [HttpPost("category-stock")]
    public Task<IActionResult> CategoryStock([FromBody] ReportExportRequestDto req, CancellationToken ct)
        => Download(_reports.ExportCategoryStockAsync(req, ct));

    [HttpPost("top-buyers")]
    public Task<IActionResult> TopBuyers([FromBody] ReportExportRequestDto req, CancellationToken ct)
        => Download(_reports.ExportTopBuyersAsync(req, ct));

    [HttpPost("sales-summary")]
    public Task<IActionResult> SalesSummary([FromBody] ReportExportRequestDto req, CancellationToken ct)
        => Download(_reports.ExportSalesSummaryAsync(req, ct));
    
    [HttpPost("inventory-pack")]
    public Task<IActionResult> InventoryPack([FromBody] InventoryPackExportRequestDto req, CancellationToken ct)
        => Download(_reports.ExportInventoryPackAsync(req, ct));
    
    [HttpPost("category-inventory")]
    public Task<IActionResult> CategoryInventory([FromBody] ReportExportRequestDto req, CancellationToken ct)
        => Download(_reports.ExportCategoryInventorySheetsAsync(req, ct));

    private async Task<IActionResult> Download(Task<ReportFileResultDto> task)
    {
        var file = await task;
        return File(file.Content, file.ContentType, file.FileName);
    }
 
}