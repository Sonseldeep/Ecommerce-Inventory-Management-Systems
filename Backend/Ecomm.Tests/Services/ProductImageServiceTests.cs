using System.Text;
using Ecomm.Application.Common;
using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Application.Interfaces.Services;
using Ecomm.Application.Services;
using Ecomm.Domain.Entities;
using FakeItEasy;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Internal;

namespace Ecomm.Tests.Services;

public class ProductImageServiceTests
{
    private readonly IProductRepository _products = A.Fake<IProductRepository>();
    private readonly IRepository<ProductImage> _images = A.Fake<IRepository<ProductImage>>();
    private readonly IFileStorageService _fileStorage = A.Fake<IFileStorageService>();
    private readonly IUnitOfWork _uow = A.Fake<IUnitOfWork>();
    private readonly Microsoft.Extensions.Logging.ILogger<ProductImageService> _logger = A.Fake<Microsoft.Extensions.Logging.ILogger<ProductImageService>>();

    private ProductImageService CreateSut()
    {
        return new ProductImageService(
            _products,
            _images,
            _fileStorage,
            _uow,
            _logger
        );
    }
    
    [Fact]
    public async Task UploadProductImageAsync_Should_Add_Image()
    {
        var productId = Guid.NewGuid();
        var product = new Product { Id = productId, Images = new List<ProductImage>(), Category = new Category() };

        A.CallTo(() => _products.GetByIdWithDetailsAsync(productId, A<CancellationToken>._)).Returns(product);
        A.CallTo(() => _fileStorage.UploadImageAsync(A<Stream>._, A<string>._, A<string>._, A<CancellationToken>._))
            .Returns("http://image");

        var bytes = Encoding.UTF8.GetBytes("img");
        var file = new FormFile(new MemoryStream(bytes), 0, bytes.Length, "file", "test.png")
        {
            Headers = new HeaderDictionary(),
            ContentType = "image/png"
        };

        var result = await CreateSut().UploadProductImageAsync(productId, file, true);

        result.ImageUrl.Should().Be("http://image");
        A.CallTo(() => _images.AddAsync(A<ProductImage>._, A<CancellationToken>._)).MustHaveHappenedOnceExactly();
        A.CallTo(() => _uow.SaveChangesAsync(A<CancellationToken>._)).MustHaveHappenedOnceExactly();
    }

    [Fact]
    public async Task DeleteProductImageAsync_Should_Throw_When_Image_Not_Found()
    {
        var productId = Guid.NewGuid();
        var product = new Product { Id = productId, Images = new List<ProductImage>(), Category = new Category() };

        A.CallTo(() => _products.GetByIdWithDetailsAsync(productId, A<CancellationToken>._)).Returns(product);

        var act = () => CreateSut().DeleteProductImageAsync(productId, Guid.NewGuid());

        await act.Should().ThrowAsync<NotFoundException>();
    }
}