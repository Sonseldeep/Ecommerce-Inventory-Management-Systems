using Ecomm.Application.Common;
using Ecomm.Application.DTOs.Product;
using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Application.Interfaces.Services;
using Ecomm.Application.Services;
using Ecomm.Domain.Entities;
using FakeItEasy;
using FluentAssertions;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace Ecomm.Tests.Services;

public class ProductServiceTests
{
    private readonly IProductRepository _products = A.Fake<IProductRepository>();
    private readonly ICategoryRepository _categories = A.Fake<ICategoryRepository>();
    private readonly IRepository<ProductImage> _images = A.Fake<IRepository<ProductImage>>();
    private readonly IUnitOfWork _uow = A.Fake<IUnitOfWork>();
    private readonly ILogger<ProductService> _logger = A.Fake<ILogger<ProductService>>();
    private readonly IRealtimeNotifier _realtime = A.Fake<IRealtimeNotifier>();
    private readonly IValidator<CreateProductRequestDto> _createValidator = new InlineValidator<CreateProductRequestDto>();
    private readonly IValidator<UpdateProductRequestDto> _updateValidator = new InlineValidator<UpdateProductRequestDto>();

    private ProductService CreateSut()
        => new(_products, _categories, _images, _uow, _logger, _realtime, _createValidator, _updateValidator);

    [Fact]
    public async Task CreateAsync_Should_Throw_When_Category_Inactive()
    {
        var category = new Category { Id = Guid.NewGuid(), IsActive = false, Name = "Cat" };
        A.CallTo(() => _categories.GetByIdAsync(category.Id, A<CancellationToken>._)).Returns(category);

        var act = () => CreateSut().CreateAsync(new CreateProductRequestDto
        {
            Name = "P1",
            SKU = "SKU1",
            Price = 10,
            CategoryId = category.Id
        });

        await act.Should().ThrowAsync<BadRequestException>();
    }
}