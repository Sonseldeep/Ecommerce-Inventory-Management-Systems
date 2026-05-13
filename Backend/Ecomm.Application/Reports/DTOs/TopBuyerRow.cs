namespace Ecomm.Application.Reports.DTOs;

public record TopBuyerRow(
    Guid UserId,
    string FullName,
    string Email,
    int OrdersCount,
    decimal TotalSpent
);