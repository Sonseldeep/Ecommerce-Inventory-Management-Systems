using Ecomm.Application.DTOs.Product;
using Microsoft.AspNetCore.Http;

namespace Ecomm.Application.Interfaces.Services;

public interface IProductImageService
{
    Task<ProductImageDto> UploadProductImageAsync(Guid productId, IFormFile file, bool isPrimary, CancellationToken ct = default);
    Task<IEnumerable<ProductImageDto>> GetProductImagesAsync(Guid productId, CancellationToken ct = default);
    Task DeleteProductImageAsync(Guid productId, Guid imageId, CancellationToken ct = default);
    
    Task<ProductImageDto> ReplaceProductImageAsync(
        Guid productId, 
        Guid imageId, 
        IFormFile file, 
        bool isPrimary = false,
        CancellationToken ct = default);
}