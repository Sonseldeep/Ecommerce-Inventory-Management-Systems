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

    // [HttpGet("search")]
    // public async Task<IActionResult> Search(
    //     [FromQuery] ProductQueryParamsDto query,
    //     CancellationToken ct)
    // {
    //     var data = await _service.SearchAsync(query, ct);
    //
    //     return Ok(ApiResponse<PagedProductResponseDto>.Ok(
    //         data,
    //         "Products search completed successfully"
    //     ));
    // }

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
}