using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Application.Services;
using Ecomm.Domain.Entities;
using Ecomm.Tests.Helpers;
using FakeItEasy;
using FluentAssertions;

namespace Ecomm.Tests.Services;

public class ProductImportContextLoaderTests
{
    [Fact]
    public async Task LoadExistingSKUsAsync_Should_Return_Skus()
    {
        var products = A.Fake<IProductRepository>();
        var categories = A.Fake<ICategoryRepository>();

        A.CallTo(() => products.Query()).Returns(AsyncQueryable.Build(new[]
        {
            new Product { SKU = "SKU1", IsDeleted = false }
        }));

        var loader = new ProductImportContextLoader(products, categories, A.Fake<Microsoft.Extensions.Logging.ILogger<ProductImportContextLoader>>());

        var result = await loader.LoadExistingSKUsAsync(CancellationToken.None);

        result.Should().Contain("sku1");
    }
}