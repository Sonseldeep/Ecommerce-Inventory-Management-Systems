using Ecomm.Application.DTOs.Category;
using Ecomm.Domain.Entities;

namespace Ecomm.Application.Interfaces.Repositories;

public interface ICategoryRepository : IRepository<Category>
{
    Task<bool> ExistsByNameAsync(string name, CancellationToken ct = default);
    Task<IEnumerable<Category>> GetActiveAsync(CancellationToken ct = default);

    Task<(IEnumerable<Category> Items, int TotalCount)> SearchAsync(
        CategoryQueryParamsDto query,
        CancellationToken ct = default);
}