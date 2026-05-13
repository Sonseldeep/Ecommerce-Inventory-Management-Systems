namespace Ecomm.Application.Reports.DTOs;


public record CategoryInventoryItemRow(
    Guid ProductId,
    string ProductName,
    string SKU,
    int QuantityInStock,
    string Status
);