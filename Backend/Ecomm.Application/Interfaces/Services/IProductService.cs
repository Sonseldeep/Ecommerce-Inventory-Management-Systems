using Ecomm.Application.DTOs.Product;

namespace Ecomm.Application.Interfaces.Services;

public interface IProductService
{
    Task<ProductResponseDto> CreateAsync(CreateProductRequestDto request, CancellationToken ct = default);
    Task<ProductResponseDto> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<PagedProductResponseDto> SearchAsync(ProductQueryParamsDto query, CancellationToken ct = default);
    Task<ProductResponseDto> UpdateAsync(Guid id, UpdateProductRequestDto request, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}