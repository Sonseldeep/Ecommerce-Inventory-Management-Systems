using Ecomm.Application.Common;
using Ecomm.Application.DTOs.Category;
using Ecomm.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecomm.Api.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _service;

    public CategoriesController(ICategoryService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] CategoryQueryParamsDto query, CancellationToken ct)
    {
        var data = await _service.SearchAsync(query, ct);

        return Ok(ApiResponse<PagedResult<CategoryResponseDto>>.Ok(
            data,
            "Categories fetched successfully"
        ));
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateCategoryRequestDto request, CancellationToken ct)
    {
        var data = await _service.CreateAsync(request, ct);

        return Ok(ApiResponse<CategoryResponseDto>.Ok(
            data,
            "Category created successfully"
        ));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateCategoryRequestDto request, CancellationToken ct)
    {
        var data = await _service.UpdateAsync(id, request, ct);

        return Ok(ApiResponse<CategoryResponseDto>.Ok(
            data,
            "Category updated successfully"
        ));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete([FromRoute] Guid id, CancellationToken ct)
    {
        await _service.DeleteAsync(id, ct);

        return Ok(ApiResponse<string>.Ok(
            "Deleted",
            "Category deleted successfully"
        ));
    }
}