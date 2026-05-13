namespace Ecomm.Application.Reports.DTOs;

public record ProductStockRow(
    Guid ProductId,
    string ProductName,
    string SKU,
    int QuantityInStock,
    int ReorderLevel,
    string CategoryName,
    bool IsActive
);