using ClosedXML.Excel;
using Ecomm.Application.DTOs.Product;
using Ecomm.Application.Interfaces.Services;
using Microsoft.Extensions.Logging;

namespace Ecomm.Application.Services;

public class RowDataExtractor : IRowDataExtractor
{
    private readonly ILogger<RowDataExtractor> _logger;

    public RowDataExtractor(ILogger<RowDataExtractor> logger) => _logger = logger;

    public (ProductImportRowDto dto, List<string> errors) ExtractRowData(IXLRow row, int rowNumber)
    {
        var errors = new List<string>();

        var name = GetStringValue(row, 1, out var nameErrors);
        errors.AddRange(nameErrors);

        var sku = GetStringValue(row, 2, out var skuErrors);
        errors.AddRange(skuErrors);

        var description = GetStringValue(row, 3, out var descErrors);
        errors.AddRange(descErrors);

        var price = GetDecimalValue(row, 4, true, out var priceErrors);
        errors.AddRange(priceErrors);

        var discountPrice = GetDecimalValue(row, 5, false, out var discountErrors);
        errors.AddRange(discountErrors);

        var quantity = GetIntValue(row, 6, true, out var qtyErrors);
        errors.AddRange(qtyErrors);

        var reorderLevel = GetIntValue(row, 7, true, out var reorderErrors);
        errors.AddRange(reorderErrors);

        var categoryName = GetStringValue(row, 8, out var catErrors);
        errors.AddRange(catErrors);

        var isActive = GetBoolValue(row, 9, true, out var boolErrors);
        errors.AddRange(boolErrors);

        var dto = new ProductImportRowDto(
            Name: name ?? string.Empty,
            SKU: sku ?? string.Empty,
            Description: description ?? string.Empty,
            Price: price ?? 0,
            DiscountPrice: discountPrice,
            QuantityInStock: quantity ?? 0,
            ReorderLevel: reorderLevel ?? 0,
            CategoryName: categoryName ?? string.Empty,
            IsActive: isActive ?? false
        );

        return (dto, errors);
    }

    private string? GetStringValue(IXLRow row, int column, out List<string> errors)
    {
        errors = new List<string>();
        try
        {
            var cell = row.Cell(column);
            if (cell.IsEmpty())
                return null;

            var value = cell.GetString()?.Trim();
            return string.IsNullOrWhiteSpace(value) ? null : value;
        }
        catch (Exception ex)
        {
            errors.Add($"Column {column}: Failed to extract string - {ex.Message}");
            _logger.LogWarning("[EXTRACT] Column {Col}: {Error}", column, ex.Message);
            return null;
        }
    }

    private decimal? GetDecimalValue(IXLRow row, int column, bool required, out List<string> errors)
    {
        errors = new List<string>();
        try
        {
            var cell = row.Cell(column);
            if (cell.IsEmpty())
                return null;

            if (decimal.TryParse(cell.GetString() ?? cell.Value.ToString(), out var result))
                return result;

            try
            {
                return cell.GetValue<decimal>();
            }
            catch
            {
                if (required)
                    errors.Add($"Column {column}: Invalid decimal format '{cell.Value}'");
                return null;
            }
        }
        catch (Exception ex)
        {
            if (required)
                errors.Add($"Column {column}: Invalid decimal - {ex.Message}");
            _logger.LogWarning("[EXTRACT] Column {Col}: {Error}", column, ex.Message);
            return null;
        }
    }

    private int? GetIntValue(IXLRow row, int column, bool required, out List<string> errors)
    {
        errors = new List<string>();
        try
        {
            var cell = row.Cell(column);
            if (cell.IsEmpty())
                return null;

            if (int.TryParse(cell.GetString() ?? cell.Value.ToString(), out var result))
                return result;

            try
            {
                return cell.GetValue<int>();
            }
            catch
            {
                if (required)
                    errors.Add($"Column {column}: Invalid integer format '{cell.Value}'");
                return null;
            }
        }
        catch (Exception ex)
        {
            if (required)
                errors.Add($"Column {column}: Invalid integer - {ex.Message}");
            _logger.LogWarning("[EXTRACT] Column {Col}: {Error}", column, ex.Message);
            return null;
        }
    }

    private bool? GetBoolValue(IXLRow row, int column, bool required, out List<string> errors)
    {
        errors = new List<string>();
        try
        {
            var cell = row.Cell(column);
            if (cell.IsEmpty())
                return null;

            var strValue = cell.GetString()?.ToLower().Trim();
            if (strValue is "true" or "yes" or "1")
                return true;
            if (strValue is "false" or "no" or "0")
                return false;

            try
            {
                return cell.GetValue<bool>();
            }
            catch
            {
                if (required)
                    errors.Add($"Column {column}: Invalid boolean format '{cell.Value}' (expected: true/false, yes/no, 0/1)");
                return null;
            }
        }
        catch (Exception ex)
        {
            if (required)
                errors.Add($"Column {column}: Invalid boolean - {ex.Message}");
            _logger.LogWarning("[EXTRACT] Column {Col}: {Error}", column, ex.Message);
            return null;
        }
    }
}