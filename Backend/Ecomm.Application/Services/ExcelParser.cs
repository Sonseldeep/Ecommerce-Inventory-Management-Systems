using ClosedXML.Excel;
using Ecomm.Application.Common;
using Ecomm.Application.Interfaces.Services;
using Microsoft.Extensions.Logging;

namespace Ecomm.Application.Services;

public class ExcelParser : IExcelParser
{
    private readonly ILogger<ExcelParser> _logger;

    public ExcelParser(ILogger<ExcelParser> logger) => _logger = logger;

    public IXLWorksheet ParseFile(Stream fileStream, string fileName)
    {
        try
        {
            _logger.LogInformation("[PARSE] Opening Excel file: {FileName}", fileName);

            var workbook = new XLWorkbook(fileStream);
            var sheet = workbook.Worksheets.FirstOrDefault();

            if (sheet == null)
                throw new BadRequestException("Excel file has no worksheets.");

            _logger.LogInformation("[PARSE] Successfully parsed Excel file");
            return sheet;
        }
        catch (Exception ex) when (ex is not BadRequestException)
        {
            _logger.LogError(ex, "[PARSE] Failed to parse Excel file: {FileName}", fileName);
            throw new BadRequestException($"Invalid Excel file format: {ex.Message}");
        }
    }
}