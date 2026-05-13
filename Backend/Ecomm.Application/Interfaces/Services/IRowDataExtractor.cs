using ClosedXML.Excel;
using Ecomm.Application.DTOs.Product;

namespace Ecomm.Application.Interfaces.Services;

public interface IRowDataExtractor
{
    /// <summary>Extracts and converts row cells to DTO</summary>
    (ProductImportRowDto dto, List<string> errors) ExtractRowData(IXLRow row, int rowNumber);
}