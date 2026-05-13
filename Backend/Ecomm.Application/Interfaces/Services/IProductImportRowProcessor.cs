using Ecomm.Application.DTOs.Product;
using Ecomm.Domain.Entities;

namespace Ecomm.Application.Interfaces.Services;

public interface IProductImportRowProcessor
{
    /// <summary>Processes single row and returns product or error</summary>
    (Product? product, List<string> errors) ProcessRow(
        ProductImportRowDto dto,
        int rowNumber,
        HashSet<string> existingSKUs,
        Dictionary<string, Category> categoriesDict,
        HashSet<string> fileSkus
    );
}