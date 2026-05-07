using Ecomm.Application.Common;
using Ecomm.Application.DTOs.Product;
using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Application.Interfaces.Services;
using Ecomm.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Ecomm.Application.Services;

public class ProductImageService : IProductImageService
{
    private readonly IProductRepository _products;
    private readonly IRepository<ProductImage> _images;
    private readonly IFileStorageService _fileStorage;
    private readonly IUnitOfWork _uow;
    private readonly ILogger<ProductImageService> _logger;

    private static readonly string[] AllowedTypes = ["image/jpeg", "image/png", "image/webp"];
    private const long MaxFileSize = 5 * 1024 * 1024; // 5MB

    public ProductImageService(
        IProductRepository products,
        IRepository<ProductImage> images,
        IFileStorageService fileStorage,
        IUnitOfWork uow,
        ILogger<ProductImageService> logger)
    {
        _products = products;
        _images = images;
        _fileStorage = fileStorage;
        _uow = uow;
        _logger = logger;
    }

    public async Task<ProductImageDto> UploadProductImageAsync(Guid productId, IFormFile file, bool isPrimary, CancellationToken ct = default)
    {
        if (file is null || file.Length == 0)
        {
            throw new BadRequestException("Image file is required.");
        }

        if (file.Length > MaxFileSize)
        {
            throw new BadRequestException("Image size cannot exceed 5MB.");
        }

        if (!AllowedTypes.Contains(file.ContentType.ToLower()))
        {
            throw new BadRequestException("Only jpg, png, webp are allowed.");
        }

        var product = await _products.GetByIdWithDetailsAsync(productId, ct);
        if (product is null)
        {
            throw new NotFoundException("Product not found.");
        }

        await using var stream = file.OpenReadStream();
        var imageUrl = await _fileStorage.UploadImageAsync(stream, file.FileName, file.ContentType, ct);

        if (isPrimary)
        {
            foreach (var img in product.Images.Where(x => !x.IsDeleted && x.IsPrimary))
            {
                img.IsPrimary = false;
                _images.Update(img);
            }
        }

        var image = new ProductImage
        {
            ProductId = productId,
            ImageUrl = imageUrl,
            IsPrimary = isPrimary || product.Images.All(x => x.IsDeleted),
            SortOrder = product.Images.Count(x => !x.IsDeleted)
        };

        await _images.AddAsync(image, ct);
        await _uow.SaveChangesAsync(ct);

        _logger.LogInformation("Product image uploaded. ProductId: {ProductId}, ImageId: {ImageId}", productId, image.Id);

        return new ProductImageDto
        {
            Id = image.Id,
            ImageUrl = image.ImageUrl,
            IsPrimary = image.IsPrimary,
            SortOrder = image.SortOrder
        };
    }

    public async Task<IEnumerable<ProductImageDto>> GetProductImagesAsync(Guid productId, CancellationToken ct = default)
    {
        var product = await _products.GetByIdWithDetailsAsync(productId, ct);
        if (product is null)
        {
            throw new NotFoundException("Product not found.");
        }

        return product.Images
            .Where(x => !x.IsDeleted)
            .OrderBy(x => x.SortOrder)
            .Select(x => new ProductImageDto
            {
                Id = x.Id,
                ImageUrl = x.ImageUrl,
                IsPrimary = x.IsPrimary,
                SortOrder = x.SortOrder
            });
    }

    public async Task DeleteProductImageAsync(Guid productId, Guid imageId, CancellationToken ct = default)
    {
        var product = await _products.GetByIdWithDetailsAsync(productId, ct);
        if (product is null)
        {
            throw new NotFoundException("Product not found.");
        }

        var image = product.Images.FirstOrDefault(x => x.Id == imageId && !x.IsDeleted);
        if (image is null)
        {
            throw new NotFoundException("Image not found.");
        }

        _images.Remove(image);

        // if primary deleted, make another as primary
        if (image.IsPrimary)
        {
            var next = product.Images.FirstOrDefault(x => x.Id != imageId && !x.IsDeleted);
            if (next is not null)
            {
                next.IsPrimary = true;
                _images.Update(next);
            }
        }

        await _uow.SaveChangesAsync(ct);

        _logger.LogInformation("Product image deleted. ProductId: {ProductId}, ImageId: {ImageId}", productId, imageId);
    }

    public async Task<ProductImageDto> ReplaceProductImageAsync(
    Guid productId, 
    Guid imageId, 
    IFormFile file, 
    bool isPrimary = false,
    CancellationToken ct = default)
{
    // Validate file
    if (file is null || file.Length == 0)
    {
        throw new BadRequestException("Image file is required.");
    }

    if (file.Length > MaxFileSize)
    {
        throw new BadRequestException("Image size cannot exceed 5MB.");
    }

    if (!AllowedTypes.Contains(file.ContentType.ToLower()))
    {
        throw new BadRequestException("Only jpg, png, webp are allowed.");
    }

    // Find product and image
    var product = await _products.GetByIdWithDetailsAsync(productId, ct);
    if (product is null)
    {
        throw new NotFoundException("Product not found.");
    }

    var image = product.Images.FirstOrDefault(x => x.Id == imageId && !x.IsDeleted);
    if (image is null)
    {
        throw new NotFoundException("Image not found.");
    }

    // Upload new image
    await using var stream = file.OpenReadStream();
    var newImageUrl = await _fileStorage.UploadImageAsync(stream, file.FileName, file.ContentType, ct);

    // Delete old image from storage (if you want to)
    // await _fileStorage.DeleteImageAsync(image.ImageUrl, ct);

    // Update the image with new URL
    image.ImageUrl = newImageUrl;

    // If making it primary, remove primary from others
    if (isPrimary)
    {
        foreach (var img in product.Images.Where(x => !x.IsDeleted && x.IsPrimary && x.Id != imageId))
        {
            img.IsPrimary = false;
            _images.Update(img);
        }
        image.IsPrimary = true;
    }

    _images.Update(image);
    await _uow.SaveChangesAsync(ct);

    _logger.LogInformation(
        "Product image replaced. ProductId: {ProductId}, ImageId: {ImageId}", 
        productId, imageId);

    return new ProductImageDto
    {
        Id = image.Id,
        ImageUrl = image.ImageUrl,
        IsPrimary = image.IsPrimary,
        SortOrder = image.SortOrder
    };
}
   
}