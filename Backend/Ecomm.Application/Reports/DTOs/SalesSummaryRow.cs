namespace Ecomm.Application.Reports.DTOs;

public record SalesSummaryRow(
    DateOnly Date,
    int OrdersCount,
    decimal TotalRevenue,
    decimal AvgOrderValue
);