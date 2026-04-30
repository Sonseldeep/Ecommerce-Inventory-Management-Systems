using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Domain.Entities;
using Ecomm.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Ecomm.Infrastructure.Repositories;

public class AddressRepository : Repository<Address>, IAddressRepository
{
    public AddressRepository(AppDbContext db) : base(db) { }

    public async Task<IEnumerable<Address>> GetByUserIdAsync(Guid userId, CancellationToken ct = default)
    {
        return  await _db.Addresses
            .Where(x => x.UserId == userId && !x.IsDeleted)
            .ToListAsync(ct);
    }
}