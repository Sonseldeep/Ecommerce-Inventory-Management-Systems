using ClosedXML.Excel;
using Ecomm.Application.Reports.DTOs;
using Ecomm.Application.Reports.Interfaces;
using QuestPDF.Fluent;

using System.Reflection;

namespace Ecomm.Application.Reports.Export;

public class ReportExporter : IReportExporter
{
    public ReportFileResultDto Export<T>(string reportName, string format, IEnumerable<T> rows)
    {
        var list = rows.ToList();

        return new ReportFileResultDto(
            $"{reportName}_{DateTime.UtcNow:yyyyMMdd_HHmmss}.xlsx",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ExportExcel(reportName, list)
        );
    }

    private static byte[] ExportExcel<T>(string sheetName, List<T> rows)
    {
        using var wb = new XLWorkbook();
        var ws = wb.AddWorksheet(sheetName);

        ws.Cell(1, 1).InsertTable(rows);
        ws.Columns().AdjustToContents();

        using var ms = new MemoryStream();
        wb.SaveAs(ms);
        return ms.ToArray();
    }
    public ReportFileResultDto ExportInventoryPack(
        IEnumerable<InventorySummaryRow> summary,
        IEnumerable<ProductStockRow> lowStock,
        IEnumerable<ProductStockRow> outOfStock,
        IEnumerable<CategoryStockRow> categoryStock,
        IEnumerable<ProductSalesRow> bestSelling,
        IEnumerable<ProductSalesRow> nonSelling,
        IEnumerable<TopBuyerRow> topBuyers,
        IEnumerable<SalesSummaryRow> salesSummary)
    {
        using var wb = new XLWorkbook();

        wb.AddWorksheet("Summary").Cell(1, 1).InsertTable(summary);
        wb.AddWorksheet("Low Stock").Cell(1, 1).InsertTable(lowStock);
        wb.AddWorksheet("Out Of Stock").Cell(1, 1).InsertTable(outOfStock);
        wb.AddWorksheet("Category Stock").Cell(1, 1).InsertTable(categoryStock);
        wb.AddWorksheet("Best Selling").Cell(1, 1).InsertTable(bestSelling);
        wb.AddWorksheet("Non Selling").Cell(1, 1).InsertTable(nonSelling);
        wb.AddWorksheet("Top Buyers").Cell(1, 1).InsertTable(topBuyers);
        wb.AddWorksheet("Sales Summary").Cell(1, 1).InsertTable(salesSummary);

        foreach (var ws in wb.Worksheets)
            ws.Columns().AdjustToContents();

        using var ms = new MemoryStream();
        wb.SaveAs(ms);

        return new ReportFileResultDto(
            $"InventoryPack_{DateTime.UtcNow:yyyyMMdd_HHmmss}.xlsx",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ms.ToArray()
        );
    }

  
    public ReportFileResultDto ExportCategoryInventorySheets(Dictionary<string, List<CategoryInventoryItemRow>> sheets)
    {
        using var wb = new XLWorkbook();

        foreach (var (category, items) in sheets)
        {
            var safeName = string.IsNullOrWhiteSpace(category) ? "Uncategorized" : category;
            var ws = wb.AddWorksheet(safeName.Length > 30 ? safeName[..30] : safeName);

            ws.Cell(1, 1).Value = "ProductId";
            ws.Cell(1, 2).Value = "ProductName";
            ws.Cell(1, 3).Value = "SKU";
            ws.Cell(1, 4).Value = "QuantityInStock";
            ws.Cell(1, 5).Value = "Status";

            ws.Cell(2, 1).InsertData(items);

            ws.Columns().AdjustToContents();

            // Summary row (only total items)
            var lastRow = items.Count + 2;
            ws.Cell(lastRow, 3).Value = "Total Items:";
            ws.Cell(lastRow, 4).Value = items.Count;
        }

        using var ms = new MemoryStream();
        wb.SaveAs(ms);

        return new ReportFileResultDto(
            $"CategoryInventory_{DateTime.UtcNow:yyyyMMdd_HHmmss}.xlsx",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ms.ToArray()
        );
    }

    private static byte[] ExportPdf<T>(string title, List<T> rows)
    {
        var props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);

        var doc = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Margin(30);
                page.Header().Text(title).FontSize(18).SemiBold();
                page.Content().Table(table =>
                {
                    table.ColumnsDefinition(c =>
                    {
                        foreach (var _ in props)
                            c.RelativeColumn();
                    });

                    table.Header(h =>
                    {
                        foreach (var p in props)
                            h.Cell().Text(p.Name).SemiBold();
                    });

                    foreach (var row in rows)
                    {
                        foreach (var p in props)
                        {
                            var val = p.GetValue(row);
                            table.Cell().Text(val?.ToString() ?? string.Empty);
                        }
                    }
                });
            });
        });

        return doc.GeneratePdf();
    }
}