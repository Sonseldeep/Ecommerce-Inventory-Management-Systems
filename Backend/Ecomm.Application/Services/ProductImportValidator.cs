using Ecomm.Application.Common;
using Ecomm.Application.DTOs.Product;
using Ecomm.Application.Interfaces.Services;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace Ecomm.Application.Services;

public class ProductImportValidator : IImportValidator
{
    private const long MaxFileSizeBytes = 10 * 1024 * 1024;
    private const int MaxRows = 5000;

    private readonly IValidator<ProductImportRowDto> _rowValidator;
    private readonly ILogger<ProductImportValidator> _logger;

    public ProductImportValidator(
        IValidator<ProductImportRowDto> rowValidator,
        ILogger<ProductImportValidator> logger)
    {
        _rowValidator = rowValidator;
        _logger = logger;
    }

    public void ValidateFile(ProductImportRequestDto request)
    {
        _logger.LogInformation("[VALIDATE] Validating file: {FileName}", request.FileName);

        if (request.Length <= 0)
            throw new BadRequestException("File is required.");

        if (!Path.GetExtension(request.FileName).Equals(".xlsx", StringComparison.OrdinalIgnoreCase))
            throw new BadRequestException("Only .xlsx files are allowed.");

        if (request.Length > MaxFileSizeBytes)
            throw new BadRequestException("Max file size is 10MB.");

        _logger.LogInformation("[VALIDATE] File validation passed");
    }

    public void ValidateRowData(ProductImportRowDto dto, int rowNumber)
    {
        var validation = _rowValidator.Validate(dto);

        if (!validation.IsValid)
        {
            var errors = validation.Errors.Select(e => e.ErrorMessage).ToList();
            _logger.LogWarning("[VALIDATE] Row {Row}: {ErrorCount} validation errors", 
                rowNumber, errors.Count);
            throw new BadRequestException(
                $"Row {rowNumber} validation failed: {string.Join("; ", errors)}"
            );
        }
    }
}