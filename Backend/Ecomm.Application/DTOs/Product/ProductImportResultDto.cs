namespace Ecomm.Application.DTOs.Product;

public record ProductImportResultDto(
    int TotalRows,
    int SuccessCount,
    int FailedCount,
    List<ProductImportRowResultDto> RowErrors
);