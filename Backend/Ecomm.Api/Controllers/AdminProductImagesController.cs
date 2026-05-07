using Ecomm.Application.Common;
using Ecomm.Application.DTOs.Product;
using Ecomm.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecomm.Api.Controllers;

[ApiController]
[Route("api/admin/products/{productId:guid}/images")]
[Authorize(Roles = "Admin")]
public class AdminProductImagesController : ControllerBase
{
    private readonly IProductImageService _service;

    public AdminProductImagesController(IProductImageService service)
    {
        _service = service;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetImages([FromRoute] Guid productId, CancellationToken ct)
    {
        var data = await _service.GetProductImagesAsync(productId, ct);
        return Ok(ApiResponse<IEnumerable<ProductImageDto>>.Ok(data));
    }

    [HttpPost]
    [RequestSizeLimit(5 * 1024 * 1024)]
    public async Task<IActionResult> Upload([FromRoute] Guid productId, [FromForm] IFormFile file, [FromQuery] bool isPrimary = false, CancellationToken ct = default)
    {
        var data = await _service.UploadProductImageAsync(productId, file, isPrimary, ct);
        return Ok(ApiResponse<ProductImageDto>.Ok(data, "Image uploaded successfully"));
    }

    [HttpDelete("{imageId:guid}")]
    public async Task<IActionResult> Delete([FromRoute] Guid productId, [FromRoute] Guid imageId, CancellationToken ct)
    {
        await _service.DeleteProductImageAsync(productId, imageId, ct);
        return Ok(ApiResponse<string>.Ok("Deleted", "Image deleted"));
    }
    
    [HttpPut("{imageId:guid}")]
    [RequestSizeLimit(5 * 1024 * 1024)]
    public async Task<IActionResult> Update(
        [FromRoute] Guid productId, 
        [FromRoute] Guid imageId, 
        [FromForm] IFormFile file,
        [FromQuery] bool isPrimary = false,
        CancellationToken ct = default)
    {
        var data = await _service.ReplaceProductImageAsync(productId, imageId, file, isPrimary, ct);
        return Ok(ApiResponse<ProductImageDto>.Ok(data, "Image replaced successfully"));
    }
}