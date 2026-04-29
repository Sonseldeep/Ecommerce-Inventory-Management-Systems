using Ecomm.Domain.Entities;

namespace Ecomm.Application.Interfaces.Repositories;

public interface IAddressRepository : IRepository<Address>
{
    Task<IEnumerable<Address>> GetByUserIdAsync(Guid userId, CancellationToken ct = default);
}