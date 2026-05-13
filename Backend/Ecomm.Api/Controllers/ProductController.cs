using Ecomm.Application.Common;
using Ecomm.Application.DTOs.Product;
using Ecomm.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecomm.Api.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _service;
    private readonly IProductImportService _importService;


    public ProductsController(IProductService service, IProductImportService importService)
    {
        _service = service;
        _importService = importService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] ProductQueryParamsDto query, CancellationToken ct)
    {
        var data = await _service.SearchAsync(query, ct);

        return Ok(ApiResponse<PagedProductResponseDto>.Ok(
            data,
            "Products fetched successfully"
        ));
        
    }


    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var data = await _service.GetByIdAsync(id, ct);

        return Ok(ApiResponse<ProductResponseDto>.Ok(
            data,
            "Product fetched successfully"
        ));
    }


    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create(
        [FromBody] CreateProductRequestDto request,
        CancellationToken ct)
    {
        var data = await _service.CreateAsync(request, ct);

        return Ok(ApiResponse<ProductResponseDto>.Ok(
            data,
            "Product created successfully"
        ));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(
        [FromRoute] Guid id,
        [FromBody] UpdateProductRequestDto request,
        CancellationToken ct)
    {
        var data = await _service.UpdateAsync(id, request, ct);

        return Ok(ApiResponse<ProductResponseDto>.Ok(
            data,
            "Product updated successfully"
        ));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await _service.DeleteAsync(id, ct);

        return Ok(ApiResponse<string>.Ok(
            "Deleted",
            "Product deleted successfully"
        ));
    }
    
    [HttpPost("import")]
    [Authorize(Roles = "Admin")]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(10 * 1024 * 1024)]
    public async Task<IActionResult> Import(
        [FromForm] IFormFile? file,
        [FromQuery] bool hasHeader = true,
        CancellationToken ct = default)
    {
        if (file is null || file.Length == 0)
            return BadRequest(ApiResponse<string>.Fail("File is required."));

        await using var stream = file.OpenReadStream();

        var result = await _importService.ImportAsync(
            new ProductImportRequestDto(stream, file.FileName, file.Length, hasHeader),
            ct);

        if (result is { SuccessCount: 0, FailedCount: > 0 })
        {
            // All rows failed - return 400
            return BadRequest(ApiResponse<ProductImportResultDto>.Fail(
                "All rows failed validation. No products were imported."));
        }

        if (result is { FailedCount: > 0, SuccessCount: > 0 })
        {
            // Partial success - return 207 Multi-Status
            return StatusCode(207, ApiResponse<ProductImportResultDto>.Ok(
                result,
                $"Partial success: {result.SuccessCount} imported, {result.FailedCount} failed."));
        }

        // All successful - return 200
        return Ok(ApiResponse<ProductImportResultDto>.Ok(
            result,
            "All products imported successfully"));
    }
    //
    // [HttpPost("import")]
    // [Authorize(Roles = "Admin")]
    // [Consumes("multipart/form-data")]
    // [RequestSizeLimit(10 * 1024 * 1024)]
    // public async Task<IActionResult> Import(
    //     [FromForm] IFormFile? file,
    //     [FromQuery] bool hasHeader = true,
    //     CancellationToken ct = default)
    // {
    //     if (file is null || file.Length == 0)
    //         return BadRequest(ApiResponse<string>.Fail("File is required."));
    //
    //     await using var stream = file.OpenReadStream();
    //
    //     var result = await _importService.ImportAsync(
    //         new ProductImportRequestDto(stream, file.FileName, file.Length, hasHeader),
    //         ct);
    //
    //     return Ok(ApiResponse<ProductImportResultDto>.Ok(
    //         result,
    //         "Products imported successfully"));
    // }
}