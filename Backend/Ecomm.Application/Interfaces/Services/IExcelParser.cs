using ClosedXML.Excel;

namespace Ecomm.Application.Interfaces.Services;

public interface IExcelParser
{
    /// <summary>Parses Excel file and returns worksheet</summary>
    IXLWorksheet ParseFile(Stream fileStream, string fileName);
}