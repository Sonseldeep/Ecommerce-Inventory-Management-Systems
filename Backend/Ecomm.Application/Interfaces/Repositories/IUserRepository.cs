using Ecomm.Domain.Entities;

namespace Ecomm.Application.Interfaces.Repositories;


public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(string email, CancellationToken ct = default);
}