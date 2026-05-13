using Ecomm.Application.DTOs.Product;

namespace Ecomm.Application.Interfaces.Services;

public interface IImportValidator
{
    /// <summary>Validates file before import</summary>
    void ValidateFile(ProductImportRequestDto request);

    /// <summary>Validates individual row data</summary>
    void ValidateRowData(ProductImportRowDto dto, int rowNumber);
}