namespace Ecomm.Application.Reports.DTOs;

public record CategoryStockRow(
    string CategoryName,
    int TotalStock,
    int ProductCount
);