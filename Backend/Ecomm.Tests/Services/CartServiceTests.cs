using Ecomm.Application.Common;
using Ecomm.Application.DTOs.Cart;
using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Application.Services;
using Ecomm.Domain.Entities;
using FakeItEasy;
using FluentAssertions;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace Ecomm.Tests.Services;

public class CartServiceTests
{
    private readonly ICartRepository _carts = A.Fake<ICartRepository>();
    private readonly IProductRepository _products = A.Fake<IProductRepository>();
    private readonly IUserRepository _users = A.Fake<IUserRepository>();
    private readonly IRepository<CartItem> _cartItems = A.Fake<IRepository<CartItem>>();
    private readonly ICurrentUserService _currentUser = A.Fake<ICurrentUserService>();
    private readonly IUnitOfWork _uow = A.Fake<IUnitOfWork>();
    private readonly ILogger<CartService> _logger = A.Fake<ILogger<CartService>>();

    private readonly IValidator<AddToCartRequestDto> _addValidator =
        new InlineValidator<AddToCartRequestDto>();

    private readonly IValidator<UpdateCartItemRequestDto> _updateValidator =
        new InlineValidator<UpdateCartItemRequestDto>();

    private CartService CreateSut()
    {
        return new CartService(
            _carts,
            _products,
            _users,
            _cartItems,
            _currentUser,
            _uow,
            _logger,
            _addValidator,
            _updateValidator
        );
    }
    [Fact]
    public async Task AddItemAsync_Should_Add_New_Item()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var productId = Guid.NewGuid();

        A.CallTo(() => _currentUser.GetUserId())
            .Returns(userId);

        A.CallTo(() => _users.GetByIdAsync(userId, A<CancellationToken>._))
            .Returns(new User { Id = userId });

        var product = new Product
        {
            Id = productId,
            Name = "P1",
            QuantityInStock = 10,
            Price = 100,
            Category = new Category { IsActive = true, Name = "Cat" },
            Images = new List<ProductImage>()
        };

        A.CallTo(() => _products.GetByIdWithDetailsAsync(productId, A<CancellationToken>._))
            .Returns(product);

        var cart = new Cart
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Items = new List<CartItem>()
        };

        A.CallTo(() => _carts.GetByUserIdWithItemsAsync(userId, A<CancellationToken>._))
            .Returns(cart);

        var request = new AddToCartRequestDto
        {
            ProductId = productId,
            Quantity = 2
        };

        // Act
        var result = await CreateSut().AddItemAsync(request);

        // Assert
        A.CallTo(() => _cartItems.AddAsync(
                A<CartItem>._,
                A<CancellationToken>._))
            .MustHaveHappenedOnceExactly();

        A.CallTo(() => _uow.SaveChangesAsync(
                A<CancellationToken>._))
            .MustHaveHappenedOnceExactly();

        result.Should().NotBeNull();
    }

    [Fact]
    public async Task UpdateItemAsync_Should_Throw_When_Insufficient_Stock()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var cartItemId = Guid.NewGuid();
        var productId = Guid.NewGuid();

        A.CallTo(() => _currentUser.GetUserId())
            .Returns(userId);

        var cartItem = new CartItem
        {
            Id = cartItemId,
            ProductId = productId,
            Quantity = 1
        };

        var cart = new Cart
        {
            UserId = userId,
            Items = new List<CartItem> { cartItem }
        };

        A.CallTo(() => _carts.GetByUserIdWithItemsAsync(
                userId,
                A<CancellationToken>._))
            .Returns(cart);

        A.CallTo(() => _products.GetByIdAsync(
                productId,
                A<CancellationToken>._))
            .Returns(new Product
            {
                Id = productId,
                QuantityInStock = 0
            });

        var request = new UpdateCartItemRequestDto
        {
            Quantity = 5
        };

        // Act
        Func<Task> act = async () =>
            await CreateSut().UpdateItemAsync(cartItemId, request);

        // Assert
        await act.Should()
            .ThrowAsync<BadRequestException>();

        A.CallTo(() => _carts.GetByUserIdWithItemsAsync(
                userId,
                A<CancellationToken>._))
            .MustHaveHappenedOnceExactly();

        A.CallTo(() => _products.GetByIdAsync(
                productId,
                A<CancellationToken>._))
            .MustHaveHappenedOnceExactly();
    }
}