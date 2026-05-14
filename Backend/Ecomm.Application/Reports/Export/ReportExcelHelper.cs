using System.Text.RegularExpressions;
using ClosedXML.Excel;

namespace Ecomm.Application.Reports.Export;

internal static partial class ReportExcelHelper
{
    private const int HeaderRowIndex = 1;
    private const int DataStartRowIndex = 2;
    private const int DataStartColumnIndex = 1;

    private const string NumberFormat = "#,##0";

    private static readonly XLColor HeaderBg = XLColor.FromHtml("#1F4E79");
    private static readonly XLColor HeaderFg = XLColor.White;
    private static readonly XLColor TotalBorderColor = XLColor.FromHtml("#1F4E79");
    private static readonly XLColor ZebraEvenBg = XLColor.FromHtml("#EBF3FB");

    private static readonly char[] ExcelInvalidSheetChars = ['[', ']', '*', '/', '\\', '?', ':'];

    public static void AddTableSheet<T>(XLWorkbook wb, string sheetName, IEnumerable<T> rows)
    {
        var ws = wb.AddWorksheet(GetSafeSheetName(sheetName));
        var list = rows.ToList();

        var table = ws.Cell(HeaderRowIndex, DataStartColumnIndex).InsertTable(list);

        HumanizeHeaders(table);
        ReplaceGuidColumnsWithSequentialId(table);
        ApplyNumberFormatToTable(table);
        StyleHeader(table.HeadersRow().AsRange());
        ApplyZebraRows(ws, list.Count, table.ColumnCount());
        ws.Columns().AdjustToContents();
    }

    private static void HumanizeHeaders(IXLTable table)
    {
        var headers = table.HeadersRow().Cells().Select(c => c.GetString()).ToList();
        for (var i = 0; i < headers.Count; i++)
            table.HeadersRow().Cell(i + 1).Value = HumanizeHeader(headers[i]);
    }

    private static string HumanizeHeader(string header)
    {
        if (string.IsNullOrWhiteSpace(header)) return header;
        return Regex.Replace(header, "(?<!^)([A-Z])", " $1");
    }

    private static void ReplaceGuidColumnsWithSequentialId(IXLTable table)
    {
        var headerRow = table.HeadersRow();
        var dataRange = table.DataRange;

        for (var col = 1; col <= table.ColumnCount(); col++)
        {
            var header = headerRow.Cell(col).GetString();
            if (!header.Contains("Id", StringComparison.OrdinalIgnoreCase)) continue;

            var hasGuid = dataRange.Column(col).Cells()
                .Any(c => c.Value is Guid || Guid.TryParse(c.GetString(), out _));

            if (!hasGuid) continue;

            var rowIndex = 1;
            foreach (var row in dataRange.Rows())
                row.Cell(col).Value = rowIndex++;

            headerRow.Cell(col).Value = "ID";
        }
    }

    private static void ApplyNumberFormatToTable(IXLTable table)
    {
        for (var col = 1; col <= table.ColumnCount(); col++)
        {
            var columnRange = table.DataRange.Column(col);
            if (IsNumericColumn(columnRange))
                columnRange.Style.NumberFormat.Format = NumberFormat;
        }
    }

    private static bool IsNumericColumn(IXLRangeColumn column)
    {
        var any = false;

        foreach (var cell in column.Cells())
        {
            if (cell.IsEmpty()) continue;
            any = true;

            if (cell.DataType == XLDataType.Number) continue;

            if (!double.TryParse(cell.GetString(), out _))
                return false;
        }

        return any;
    }

    private static void StyleHeader(IXLRange range)
    {
        range.Style.Font.Bold = true;
        range.Style.Fill.BackgroundColor = HeaderBg;
        range.Style.Font.FontColor = HeaderFg;
        range.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        range.Style.Border.BottomBorder = XLBorderStyleValues.Medium;
        range.Style.Border.BottomBorderColor = TotalBorderColor;
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

    private static string GetSafeSheetName(string name)
    {
        if (string.IsNullOrWhiteSpace(name)) return "Sheet1";

        var cleaned = string.Concat(name.Where(c => !ExcelInvalidSheetChars.Contains(c))).Trim();
        cleaned = MyRegex().Replace(cleaned, " ").Trim();

        if (cleaned.Length == 0) return "Sheet1";

        return cleaned.Length > 31 ? cleaned[..31] : cleaned;
    }

    [GeneratedRegex(@"\s+")]
    private static partial Regex MyRegex();
}