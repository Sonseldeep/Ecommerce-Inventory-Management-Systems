using Ecomm.Application.Common;
using Ecomm.Application.DTOs.Address;
using Ecomm.Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecomm.Api.Controllers;

[ApiController]
[Route("api/addresses")]
[Authorize]
public class AddressesController : ControllerBase
{
    private readonly IAddressService _service;

    public AddressesController(IAddressService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetMy(CancellationToken ct)
    {
        var data = await _service.GetMyAddressesAsync(ct);
        return Ok(ApiResponse<IEnumerable<AddressResponseDto>>.Ok(data));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAddressRequestDto request, CancellationToken ct)
    {
        var data = await _service.CreateAsync(request, ct);
        return Ok(ApiResponse<AddressResponseDto>.Ok(data, "Address added"));
    }

    [HttpPut("{id:guid}/set-default")]
    public async Task<IActionResult> SetDefault([FromRoute] Guid id, CancellationToken ct)
    {
        var data = await _service.SetDefaultAsync(id, ct);
        return Ok(ApiResponse<AddressResponseDto>.Ok(data, "Default address updated"));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete([FromRoute] Guid id, CancellationToken ct)
    {
        await _service.DeleteAsync(id, ct);
        return Ok(ApiResponse<string>.Ok("Deleted", "Address deleted"));
    }
}