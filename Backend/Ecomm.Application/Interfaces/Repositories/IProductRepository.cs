using Ecomm.Application.DTOs.Product;
using Ecomm.Domain.Entities;

namespace Ecomm.Application.Interfaces.Repositories;

public interface IProductRepository : IRepository<Product>
{
    Task<bool> ExistsBySkuAsync(string sku, CancellationToken ct = default);
    Task<Product?> GetByIdWithDetailsAsync(Guid id, CancellationToken ct = default);
    Task<(IEnumerable<Product> Items, int TotalCount)> SearchAsync(ProductQueryParamsDto query, CancellationToken ct = default);
    
    Task AddRangeAsync(IEnumerable<Product> products, CancellationToken ct = default);
}