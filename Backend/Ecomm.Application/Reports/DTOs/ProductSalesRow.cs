namespace Ecomm.Application.Reports.DTOs;

public record ProductSalesRow(
    Guid ProductId,
    string ProductName,
    string SKU,
    int QuantitySold,
    decimal TotalRevenue
);