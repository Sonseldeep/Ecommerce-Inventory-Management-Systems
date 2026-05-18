using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Application.Services;
using Ecomm.Domain.Entities;
using Ecomm.Tests.Helpers;
using FakeItEasy;
using FluentAssertions;

namespace Ecomm.Tests.Services;

public class AdminAnalyticsServiceTests
{
    private readonly IProductRepository _products = A.Fake<IProductRepository>();
    private readonly IOrderRepository _orders = A.Fake<IOrderRepository>();

    private AdminAnalyticsService CreateSut()
        => new(_products, _orders);

    [Fact]
    public async Task GetInventoryAnalyticsAsync_Should_Return_Correct_Stats()
    {
        // Arrange
        var cat = new Category { Name = "Electronics" };

        var p1 = new Product
        {
            Id = Guid.NewGuid(),
            Name = "A",
            QuantityInStock = 10,
            ReorderLevel = 5,
            Category = cat
        };

        var p2 = new Product
        {
            Id = Guid.NewGuid(),
            Name = "B",
            QuantityInStock = 0,
            ReorderLevel = 5,
            Category = cat
        };

        var p3 = new Product
        {
            Id = Guid.NewGuid(),
            Name = "C",
            QuantityInStock = 2,
            ReorderLevel = 5,
            Category = cat
        };

        var products = new[] { p1, p2, p3 };

        A.CallTo(() => _products.Query())
            .Returns(AsyncQueryable.Build(products));

        var order = new Order
        {
            CreatedAtUtc = DateTime.UtcNow.AddDays(-5),
            Items = new List<OrderItem>
            {
                new OrderItem
                {
                    ProductId = p1.Id,
                    Quantity = 3
                },
                new OrderItem
                {
                    ProductId = p3.Id,
                    Quantity = 1
                }
            }
        };

        A.CallTo(() => _orders.Query())
            .Returns(AsyncQueryable.Build(new[] { order }));

        // Act
        var result = await CreateSut().GetInventoryAnalyticsAsync();

        // Assert
        result.TotalProducts.Should().Be(3);
        result.LowStockCount.Should().Be(1);      
        result.OutOfStockCount.Should().Be(1);    

        result.BestSellersLast30Days
            .Should().ContainSingle(x =>
                x.ProductId == p1.Id && x.Quantity == 3);

        result.NotSellingLast30Days
            .Should().ContainSingle(x =>
                x.ProductId == p2.Id);

        result.CategoryStock
            .Should().ContainSingle(x =>
                x.CategoryName == "Electronics" &&
                x.TotalStock == 12); 
    }
}