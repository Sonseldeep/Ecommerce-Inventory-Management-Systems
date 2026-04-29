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
    [AllowAnonymous]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var data = await _service.GetAllAsync(ct);
        return Ok(ApiResponse<IEnumerable<CategoryResponseDto>>.Ok(data));
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateCategoryRequestDto request, CancellationToken ct)
    {
        var data = await _service.CreateAsync(request, ct);
        return Ok(ApiResponse<CategoryResponseDto>.Ok(data, "Category created"));
    }
    
    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCategoryRequestDto request, CancellationToken ct)
    {
        var data = await _service.UpdateAsync(id, request, ct);
        return Ok(ApiResponse<CategoryResponseDto>.Ok(data, "Category updated"));
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await _service.DeleteAsync(id, ct);
        return Ok(ApiResponse<string>.Ok("Deleted", "Category deleted"));
    }
}