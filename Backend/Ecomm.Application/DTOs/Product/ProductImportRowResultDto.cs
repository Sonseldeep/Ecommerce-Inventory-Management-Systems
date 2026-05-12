namespace Ecomm.Application.DTOs.Product;

public record ProductImportRowResultDto(
    int RowNumber,
    List<string> Errors);