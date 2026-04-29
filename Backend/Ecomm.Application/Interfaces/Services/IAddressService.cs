using Ecomm.Application.DTOs.Address;

namespace Ecomm.Application.Interfaces.Services;

public interface IAddressService
{
    Task<AddressResponseDto> CreateAsync(CreateAddressRequestDto request, CancellationToken ct = default);
    Task<IEnumerable<AddressResponseDto>> GetMyAddressesAsync(CancellationToken ct = default);
    Task<AddressResponseDto> SetDefaultAsync(Guid addressId, CancellationToken ct = default);
    Task DeleteAsync(Guid addressId, CancellationToken ct = default);
}