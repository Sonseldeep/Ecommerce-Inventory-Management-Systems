using System.Text.RegularExpressions;
using ClosedXML.Excel;
using Ecomm.Application.Reports.DTOs;
using Ecomm.Application.Reports.Interfaces;

namespace Ecomm.Application.Reports.Export;

public partial class ReportExporter : IReportExporter
{
    // Excel content/type constants
    private const string ExcelContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    private const string ExcelExtension = "xlsx";

    // Excel sheet constraints
    private const int ExcelSheetNameMaxLength = 31;

    // Default names and labels
    private const string DefaultReportBaseName = "report";
    private const string DefaultSheetName = "Sheet1";
    private const string UncategorizedCategoryName = "Uncategorized";

    // Report file base names
    private const string CategoryInventoryBaseName = "CategoryInventory";
    private const string InventoryPackBaseName = "InventoryPack";

    // Category sheet layout constants
    private const int HeaderRowIndex = 1;
    private const int DataStartRowIndex = 2;
    private const int DataStartColumnIndex = 1;
    private const int TotalLabelColumnIndex = 3;
    private const int TotalValueColumnIndex = 4;
    private const string TotalItemsLabel = "Total Items:";

    //  Styling
    private static readonly XLColor HeaderBg = XLColor.FromHtml("#1F4E79");
    private static readonly XLColor HeaderFg = XLColor.White;
    private static readonly XLColor TotalRowBg = XLColor.FromHtml("#D6E4F0");
    private static readonly XLColor TotalBorderColor = XLColor.FromHtml("#1F4E79");
    private static readonly XLColor ZebraEvenBg = XLColor.FromHtml("#EBF3FB");

    // Number format
    private const string NumberFormat = "#,##0";

    // Reusable header names for category sheets
    private static readonly string[] CategorySheetHeaders =
        ["ID", "Product Name", "SKU", "Stock Quantity", "Status"];

    private const int StockQuantityColumnIndex = 4;

    // Excel sheet invalid characters
    private static readonly char[] ExcelInvalidSheetChars = ['[', ']', '*', '/', '\\', '?', ':'];

    private static class InventorySheets
    {
        public const string Summary = "Summary";
        public const string LowStock = "Low Stock";
        public const string OutOfStock = "Out Of Stock";
        public const string CategoryStock = "Category Stock";
        public const string BestSelling = "Best Selling";
        public const string NonSelling = "Non Selling";
        public const string TopBuyers = "Top Buyers";
        public const string SalesSummary = "Sales Summary";
    }

    public ReportFileResultDto Export<T>(string reportName, string format, IEnumerable<T> rows)
    {
        var list = rows.ToList();
        return BuildExcelResult(reportName, list);
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

        ReportExcelHelper.AddTableSheet(wb, InventorySheets.Summary, summary);
        ReportExcelHelper.AddTableSheet(wb, InventorySheets.LowStock, lowStock);
        ReportExcelHelper.AddTableSheet(wb, InventorySheets.OutOfStock, outOfStock);
        ReportExcelHelper.AddTableSheet(wb, InventorySheets.CategoryStock, categoryStock);
        ReportExcelHelper.AddTableSheet(wb, InventorySheets.BestSelling, bestSelling);
        ReportExcelHelper.AddTableSheet(wb, InventorySheets.NonSelling, nonSelling);
        ReportExcelHelper.AddTableSheet(wb, InventorySheets.TopBuyers, topBuyers);
        ReportExcelHelper.AddTableSheet(wb, InventorySheets.SalesSummary, salesSummary);

        return BuildExcelResult(InventoryPackBaseName, wb);
    }

    public ReportFileResultDto ExportCategoryInventorySheets(
        Dictionary<string, List<CategoryInventoryItemRow>> sheets)
    {
        using var wb = new XLWorkbook();

        foreach (var (category, items) in sheets)
        {
            var safeName = GetSafeSheetName(
                string.IsNullOrWhiteSpace(category) ? UncategorizedCategoryName : category);

            var ws = wb.AddWorksheet(safeName);

            WriteHeaderRow(ws, CategorySheetHeaders);
            WriteCategoryDataRows(ws, items);
            ApplyStockQuantityFormat(ws, items.Count);
            ApplyZebraRows(ws, items.Count, CategorySheetHeaders.Length);
            WriteTotalRow(ws, items.Count);
            AutoSizeColumns(ws);
        }

        return BuildExcelResult(CategoryInventoryBaseName, wb);
    }

    // Helpers

    private static ReportFileResultDto BuildExcelResult<T>(string reportName, List<T> rows)
    {
        using var wb = new XLWorkbook();
        ReportExcelHelper.AddTableSheet(wb, reportName, rows);
        return BuildExcelResult(reportName, wb);
    }

    private static ReportFileResultDto BuildExcelResult(string reportName, XLWorkbook wb)
    {
        using var ms = new MemoryStream();
        wb.SaveAs(ms);
        return new ReportFileResultDto(
            GenerateFileName(reportName, ExcelExtension),
            ExcelContentType,
            ms.ToArray());
    }

    private static void WriteHeaderRow(IXLWorksheet ws, IReadOnlyList<string> headers)
    {
        for (var i = 0; i < headers.Count; i++)
            ws.Cell(HeaderRowIndex, i + 1).Value = headers[i];

        var range = ws.Range(HeaderRowIndex, 1, HeaderRowIndex, headers.Count);
        range.Style.Font.Bold = true;
        range.Style.Fill.BackgroundColor = HeaderBg;
        range.Style.Font.FontColor = HeaderFg;
        range.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        range.Style.Border.BottomBorder = XLBorderStyleValues.Medium;
        range.Style.Border.BottomBorderColor = TotalBorderColor;
    }

    private static void WriteCategoryDataRows(
        IXLWorksheet ws, IList<CategoryInventoryItemRow> items)
    {
        for (var i = 0; i < items.Count; i++)
        {
            var item = items[i];
            var row = DataStartRowIndex + i;

            ws.Cell(row, 1).Value = i + 1;
            ws.Cell(row, 2).Value = item.ProductName;
            ws.Cell(row, 3).Value = item.SKU;
            ws.Cell(row, 4).Value = item.QuantityInStock;
            ws.Cell(row, 5).Value = item.Status;
        }
    }

    private static void ApplyStockQuantityFormat(IXLWorksheet ws, int dataRowCount)
    {
        if (dataRowCount <= 0) return;

        ws.Range(DataStartRowIndex, StockQuantityColumnIndex,
                 DataStartRowIndex + dataRowCount - 1, StockQuantityColumnIndex)
          .Style.NumberFormat.Format = NumberFormat;
    }

    private static void ApplyZebraRows(IXLWorksheet ws, int dataRowCount, int colCount)
    {
        for (var i = 0; i < dataRowCount; i++)
        {
            if (i % 2 == 1)
            {
                ws.Range(DataStartRowIndex + i, 1, DataStartRowIndex + i, colCount)
                  .Style.Fill.BackgroundColor = ZebraEvenBg;
            }
        }
    }

    private static void WriteTotalRow(IXLWorksheet ws, int itemCount)
    {
        var totalRow = itemCount + DataStartRowIndex;

        var labelCell = ws.Cell(totalRow, TotalLabelColumnIndex);
        var valueCell = ws.Cell(totalRow, TotalValueColumnIndex);

        labelCell.Value = TotalItemsLabel;
        labelCell.Style.Font.Bold = true;
        labelCell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;

        valueCell.Value = itemCount;
        valueCell.Style.Font.Bold = true;
        valueCell.Style.NumberFormat.Format = NumberFormat;
        valueCell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

        var totalRange = ws.Range(totalRow, 1, totalRow, CategorySheetHeaders.Length);
        totalRange.Style.Fill.BackgroundColor = TotalRowBg;
        totalRange.Style.Border.TopBorder = XLBorderStyleValues.Medium;
        totalRange.Style.Border.TopBorderColor = TotalBorderColor;
    }

    private static void AutoSizeColumns(IXLWorksheet ws) => ws.Columns().AdjustToContents();

    private static string GenerateFileName(string baseName, string ext)
        => $"{SanitizeFileName(baseName)}_{DateTime.UtcNow:yyyyMMdd_HHmmss}.{ext}";

    private static string SanitizeFileName(string name)
    {
        if (string.IsNullOrWhiteSpace(name)) return DefaultReportBaseName;

        var invalid = Path.GetInvalidFileNameChars();
        var s = new string(name.Where(c => !invalid.Contains(c)).ToArray()).Trim();
        return string.IsNullOrWhiteSpace(s) ? DefaultReportBaseName : s.Replace(' ', '_');
    }

    private static string GetSafeSheetName(string name)
    {
        if (string.IsNullOrWhiteSpace(name)) return DefaultSheetName;

        var cleaned = string.Concat(name.Where(c => !ExcelInvalidSheetChars.Contains(c))).Trim();
        cleaned = MyRegex().Replace(cleaned, " ").Trim();

        if (cleaned.Length == 0) return DefaultSheetName;

        return cleaned.Length > ExcelSheetNameMaxLength
            ? cleaned[..ExcelSheetNameMaxLength]
            : cleaned;
    }

    [GeneratedRegex(@"\s+")]
    private static partial Regex MyRegex();
}










