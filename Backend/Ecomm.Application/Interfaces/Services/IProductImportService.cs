using Ecomm.Application.DTOs.Product;

namespace Ecomm.Application.Interfaces.Services;

public interface IProductImportService
{
    Task<ProductImportResultDto> ImportAsync(ProductImportRequestDto request, CancellationToken ct = default);
}