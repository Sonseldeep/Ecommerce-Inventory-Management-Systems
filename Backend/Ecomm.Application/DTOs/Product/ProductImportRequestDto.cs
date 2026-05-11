namespace Ecomm.Application.DTOs.Product;

public record ProductImportRequestDto(
    Stream FileStream,
    string FileName,
    long Length,
    bool HasHeader
);