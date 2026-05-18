using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Application.Reports.DTOs;
using Ecomm.Application.Reports.Interfaces;
using Ecomm.Application.Services;
using Ecomm.Domain.Entities;
using Ecomm.Tests.Helpers;
using FakeItEasy;
using FluentAssertions;

namespace Ecomm.Tests.Services;

public class AdminUserAnalyticsServiceTests
{
    private readonly IUserRepository _users = A.Fake<IUserRepository>();
    private readonly IOrderRepository _orders = A.Fake<IOrderRepository>();
    private readonly IReportQuery _reportQuery = A.Fake<IReportQuery>();

    private AdminUserAnalyticsService CreateSut() => new(_users, _orders, _reportQuery);

    [Fact]
    public async Task GetSummaryAsync_Should_Return_TopBuyers()
    {
        A.CallTo(() => _users.Query()).Returns(AsyncQueryable.Build(new[] { new User(), new User() }));

        var rows = new List<TopBuyerRow>
        {
            new TopBuyerRow(Guid.NewGuid(), "A", "a@a.com", 2, 100)
        };

        A.CallTo(() => _reportQuery.TopBuyersAsync(A<ReportFilterDto>._, A<CancellationToken>._))
            .Returns(rows);

        var result = await CreateSut().GetSummaryAsync(30);

        result.TotalUsers.Should().Be(2);
        result.TopBuyers.Should().HaveCount(1);
        result.TopBuyers[0].FullName.Should().Be("A");
    }
}