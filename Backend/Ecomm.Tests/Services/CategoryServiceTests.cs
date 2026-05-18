using Ecomm.Application.Common;
using Ecomm.Application.DTOs.Category;
using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Application.Services;
using Ecomm.Domain.Entities;
using Ecomm.Tests.Helpers;
using FakeItEasy;
using FluentAssertions;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace Ecomm.Tests.Services;

public class CategoryServiceTests
{
    private readonly ICategoryRepository _categories = A.Fake<ICategoryRepository>();
    private readonly IProductRepository _products = A.Fake<IProductRepository>();
    private readonly IUnitOfWork _uow = A.Fake<IUnitOfWork>();
    private readonly ILogger<CategoryService> _logger =
        A.Fake<ILogger<CategoryService>>();

    private readonly IValidator<CreateCategoryRequestDto> _createValidator =
        new InlineValidator<CreateCategoryRequestDto>();

    private readonly IValidator<UpdateCategoryRequestDto> _updateValidator =
        new InlineValidator<UpdateCategoryRequestDto>();

    private CategoryService CreateSut()
    {
        return new CategoryService(
            _categories,
            _products,
            _uow,
            _logger,
            _createValidator,
            _updateValidator
        );
    }

    [Fact]
    public async Task CreateAsync_Should_Throw_When_Name_Exists()
    {
        // Arrange
        A.CallTo(() =>
                _categories.ExistsByNameAsync("Test", A<CancellationToken>._))
            .Returns(true);

        var request = new CreateCategoryRequestDto
        {
            Name = "Test"
        };

        // Act
        Func<Task> act = async () =>
            await CreateSut().CreateAsync(request);

        // Assert
        await act.Should()
            .ThrowAsync<BadRequestException>();
    }

    [Fact]
    public async Task DeleteAsync_Should_Throw_When_Category_In_Use()
    {
        // Arrange
        var id = Guid.NewGuid();

        A.CallTo(() =>
                _categories.GetByIdAsync(id, A<CancellationToken>._))
            .Returns(new Category { Id = id });

        A.CallTo(() => _products.Query())
            .Returns(AsyncQueryable.Build([
                new Product { CategoryId = id }
            ]));

        // Act
        var act = async () =>
            await CreateSut().DeleteAsync(id);

        // Assert
        await act.Should()
            .ThrowAsync<BadRequestException>();
    }
}