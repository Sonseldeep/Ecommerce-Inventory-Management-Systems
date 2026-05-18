using Ecomm.Application.Common;
using Ecomm.Application.DTOs.Order;
using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Application.Services;
using Ecomm.Domain.Entities;
using Ecomm.Domain.Enums;
using FakeItEasy;
using FluentAssertions;
using Microsoft.Extensions.Logging;

namespace Ecomm.Tests.Services;

public class AdminOrderServiceTests
{
    private readonly IOrderRepository _orders = A.Fake<IOrderRepository>();
    private readonly IUnitOfWork _uow = A.Fake<IUnitOfWork>();
    private readonly ILogger<AdminOrderService> _logger = A.Fake<ILogger<AdminOrderService>>();

    private AdminOrderService CreateSut()
        => new(_orders, _uow, _logger);

    [Fact]
    public async Task GetAllOrdersAsync_Should_Return_PagedResult()
    {
        // Arrange
        var query = new OrderQueryParamsDto
        {
            PageNumber = 0,
            PageSize = 500
        };

        var order = new Order
        {
            Id = Guid.NewGuid(),
            OrderStatus = OrderStatus.Pending
        };

        A.CallTo(() => _orders.SearchAsync(
                query,
                null,
                A<CancellationToken>._))
            .Returns((new List<Order> { order }, 1));

        // Act
        var result = await CreateSut().GetAllOrdersAsync(query);

        // Assert
        result.Items.Should().HaveCount(1);
        result.PageNumber.Should().Be(1); 
        result.PageSize.Should().Be(100); 
        result.TotalCount.Should().Be(1);
    }

    [Fact]
    public async Task UpdateStatusAsync_Should_Throw_When_Invalid_Status()
    {
        // Arrange
        var invalidStatus = (OrderStatus)999;

        // Act
        Func<Task> act = async () =>
            await CreateSut().UpdateStatusAsync(Guid.NewGuid(), invalidStatus);

        // Assert
        await act.Should()
            .ThrowAsync<BadRequestException>();
    }

    [Fact]
    public async Task UpdateStatusAsync_Should_Throw_When_Order_Not_Found()
    {
        // Arrange
        A.CallTo(() => _orders.GetByIdWithItemsAsync(
                A<Guid>._,
                A<CancellationToken>._))
            .Returns((Order?)null);

        // Act
        Func<Task> act = async () =>
            await CreateSut().UpdateStatusAsync(Guid.NewGuid(), OrderStatus.Paid);

        // Assert
        await act.Should()
            .ThrowAsync<NotFoundException>();
    }

    [Fact]
    public async Task UpdateStatusAsync_Should_Update_Order_When_Valid()
    {
        // Arrange
        var orderId = Guid.NewGuid();

        var order = new Order
        {
            Id = orderId,
            OrderStatus = OrderStatus.Pending,
            PaymentStatus = PaymentStatus.Pending
        };

        A.CallTo(() => _orders.GetByIdWithItemsAsync(
                orderId,
                A<CancellationToken>._))
            .Returns(order);

        // Act
        var result = await CreateSut()
            .UpdateStatusAsync(orderId, OrderStatus.Paid);

        // Assert
        result.OrderStatus.Should().Be(OrderStatus.Paid);
        order.PaymentStatus.Should().Be(PaymentStatus.Paid);

        A.CallTo(() => _orders.Update(order))
            .MustHaveHappenedOnceExactly();

        A.CallTo(() => _uow.SaveChangesAsync(A<CancellationToken>._))
            .MustHaveHappenedOnceExactly();
    }

    [Fact]
    public async Task UpdateStatusAsync_Should_Throw_When_Finalized()
    {
        // Arrange
        var order = new Order
        {
            Id = Guid.NewGuid(),
            OrderStatus = OrderStatus.Delivered
        };

        A.CallTo(() => _orders.GetByIdWithItemsAsync(
                order.Id,
                A<CancellationToken>._))
            .Returns(order);

        // Act
        Func<Task> act = async () =>
            await CreateSut().UpdateStatusAsync(order.Id, OrderStatus.Paid);

        // Assert
        await act.Should()
            .ThrowAsync<BadRequestException>();
    }
}