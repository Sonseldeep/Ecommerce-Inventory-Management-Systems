using Ecomm.Application.Common;
using Ecomm.Application.DTOs.Order;
using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Application.Interfaces.Services;
using Ecomm.Application.Services;
using Ecomm.Domain.Entities;
using Ecomm.Domain.Enums;
using FakeItEasy;
using FluentAssertions;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace Ecomm.Tests.Services;

public class OrderServiceTests
{
    private readonly ICartRepository _carts = A.Fake<ICartRepository>();
    private readonly IAddressRepository _addresses = A.Fake<IAddressRepository>();
    private readonly IOrderRepository _orders = A.Fake<IOrderRepository>();
    private readonly IProductRepository _products = A.Fake<IProductRepository>();
    private readonly IRepository<OrderItem> _orderItems = A.Fake<IRepository<OrderItem>>();
    private readonly IRepository<CartItem> _cartItems = A.Fake<IRepository<CartItem>>();
    private readonly ICurrentUserService _currentUser = A.Fake<ICurrentUserService>();
    private readonly IUnitOfWork _uow = A.Fake<IUnitOfWork>();
    private readonly ILogger<OrderService> _logger = A.Fake<ILogger<OrderService>>();
    private readonly IRealtimeNotifier _realtime = A.Fake<IRealtimeNotifier>();
    private readonly IValidator<CheckoutRequestDto> _checkoutValidator = new InlineValidator<CheckoutRequestDto>();

    private OrderService CreateSut()
        => new(_carts, _addresses, _orders, _products, _orderItems, _cartItems, _currentUser,
            _uow, _logger, _realtime, _checkoutValidator, A.Fake<IValidator<UpdateOrderStatusRequestDto>>());

    [Fact]
    public async Task CheckoutAsync_Should_Throw_When_Cart_Empty()
    {
        var userId = Guid.NewGuid();
        A.CallTo(() => _currentUser.GetUserId()).Returns(userId);
        A.CallTo(() => _carts.GetByUserIdWithItemsAsync(userId, A<CancellationToken>._))
            .Returns(new Cart { Items = new List<CartItem>() });

        var act = () => CreateSut().CheckoutAsync(new CheckoutRequestDto { AddressId = Guid.NewGuid(), PaymentMethod = PaymentMethod.COD });

        await act.Should().ThrowAsync<BadRequestException>();
    }
}