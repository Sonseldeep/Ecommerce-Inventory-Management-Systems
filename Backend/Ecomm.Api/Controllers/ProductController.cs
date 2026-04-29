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

    public ProductsController(IProductService service)
    {
        _service = service;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var data = await _service.GetAllAsync(ct);
        return Ok(ApiResponse<IEnumerable<ProductResponseDto>>.Ok(data));
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var data = await _service.GetByIdAsync(id, ct);
        return Ok(ApiResponse<ProductResponseDto>.Ok(data));
    }
    
    [HttpGet("search")]
    [AllowAnonymous]
    public async Task<IActionResult> Search([FromQuery] ProductQueryParamsDto query, CancellationToken ct)
    {
        var data = await _service.SearchAsync(query, ct);
        return Ok(ApiResponse<PagedProductResponseDto>.Ok(data));
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateProductRequestDto request, CancellationToken ct)
    {
        var data = await _service.CreateAsync(request, ct);
        return Ok(ApiResponse<ProductResponseDto>.Ok(data, "Product created"));
    }
    
    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProductRequestDto request, CancellationToken ct)
    {
        var data = await _service.UpdateAsync(id, request, ct);
        return Ok(ApiResponse<ProductResponseDto>.Ok(data, "Product updated"));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await _service.DeleteAsync(id, ct);
        return Ok(ApiResponse<string>.Ok("Deleted", "Product deleted"));
    }
}