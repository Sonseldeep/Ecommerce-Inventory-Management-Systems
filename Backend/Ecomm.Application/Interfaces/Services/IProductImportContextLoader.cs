using Ecomm.Domain.Entities;

namespace Ecomm.Application.Interfaces.Services;

public interface IProductImportContextLoader
{
    /// <summary>Loads all existing SKUs from database</summary>
    Task<HashSet<string>> LoadExistingSKUsAsync(CancellationToken ct);

    /// <summary>Loads all categories mapped by name</summary>
    Task<Dictionary<string, Category>> LoadCategoriesDictAsync(CancellationToken ct);
}