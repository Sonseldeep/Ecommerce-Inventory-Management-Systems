using Ecomm.Application.Common;
using Ecomm.Application.DTOs.Address;
using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Application.Interfaces.Services;
using Ecomm.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace Ecomm.Application.Services;

public class AddressService : IAddressService
{
    private readonly IAddressRepository _addresses;
    private readonly ICurrentUserService _currentUser;
    private readonly IUnitOfWork _uow;
    private readonly ILogger<AddressService> _logger;

    public AddressService(
        IAddressRepository addresses,
        ICurrentUserService currentUser,
        IUnitOfWork uow,
        ILogger<AddressService> logger)
    {
        _addresses = addresses;
        _currentUser = currentUser;
        _uow = uow;
        _logger = logger;
    }

    public async Task<AddressResponseDto> CreateAsync(CreateAddressRequestDto request, CancellationToken ct = default)
    {
        var userId = _currentUser.GetUserId();

        if (request.IsDefault)
        {
            var existing = await _addresses.GetByUserIdAsync(userId, ct);
            foreach (var addr in existing.Where(a => a.IsDefault))
            {
                addr.IsDefault = false;
                _addresses.Update(addr);
            }
        }

        var entity = new Address
        {
            UserId = userId,
            FullName = request.FullName.Trim(),
            PhoneNumber = request.PhoneNumber.Trim(),
            Line1 = request.Line1.Trim(),
            Line2 = request.Line2?.Trim(),
            City = request.City.Trim(),
            State = request.State.Trim(),
            PostalCode = request.PostalCode.Trim(),
            Country = request.Country.Trim(),
            IsDefault = request.IsDefault
        };

        await _addresses.AddAsync(entity, ct);
        await _uow.SaveChangesAsync(ct);

        _logger.LogInformation("Address created for user {UserId}", userId);
        return ToDto(entity);
    }

    public async Task<IEnumerable<AddressResponseDto>> GetMyAddressesAsync(CancellationToken ct = default)
    {
        var userId = _currentUser.GetUserId();
        var list = await _addresses.GetByUserIdAsync(userId, ct);
        return list.Select(ToDto);
    }

    public async Task<AddressResponseDto> SetDefaultAsync(Guid addressId, CancellationToken ct = default)
    {
        var userId = _currentUser.GetUserId();
        var target = await _addresses.GetByIdAsync(addressId, ct);

        if (target is null || target.UserId != userId)
            throw new NotFoundException("Address not found.");

        var all = await _addresses.GetByUserIdAsync(userId, ct);
        foreach (var addr in all)
        {
            addr.IsDefault = addr.Id == addressId;
            _addresses.Update(addr);
        }

        await _uow.SaveChangesAsync(ct);
        return ToDto(target);
    }

    public async Task DeleteAsync(Guid addressId, CancellationToken ct = default)
    {
        var userId = _currentUser.GetUserId();
        var address = await _addresses.GetByIdAsync(addressId, ct);

        if (address is null || address.UserId != userId)
            throw new NotFoundException("Address not found.");

        _addresses.Remove(address);
        await _uow.SaveChangesAsync(ct);
    }

    private static AddressResponseDto ToDto(Address a) => new()
    {
        Id = a.Id,
        FullName = a.FullName,
        PhoneNumber = a.PhoneNumber,
        Line1 = a.Line1,
        Line2 = a.Line2,
        City = a.City,
        State = a.State,
        PostalCode = a.PostalCode,
        Country = a.Country,
        IsDefault = a.IsDefault
    };
}