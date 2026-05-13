using Ecomm.Application.Common;
using Ecomm.Application.DTOs.Product;
using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Application.Interfaces.Services;
using Microsoft.Extensions.Logging;

namespace Ecomm.Application.Services;

public class ProductImportService : IProductImportService
{
    private const int MaxRows = 5000;

    private readonly IExcelParser _parser;
    private readonly IImportValidator _validator;
    private readonly IRowDataExtractor _extractor;
    private readonly IProductImportContextLoader _contextLoader;
    private readonly IProductImportRowProcessor _rowProcessor;
    private readonly IProductRepository _products;
    private readonly IUnitOfWork _uow;
    private readonly ILogger<ProductImportService> _logger;

    public ProductImportService(
        IExcelParser parser,
        IImportValidator validator,
        IRowDataExtractor extractor,
        IProductImportContextLoader contextLoader,
        IProductImportRowProcessor rowProcessor,
        IProductRepository products,
        IUnitOfWork uow,
        ILogger<ProductImportService> logger)
    {
        _parser = parser;
        _validator = validator;
        _extractor = extractor;
        _contextLoader = contextLoader;
        _rowProcessor = rowProcessor;
        _products = products;
        _uow = uow;
        _logger = logger;
    }

    public async Task<ProductImportResultDto> ImportAsync(
        ProductImportRequestDto request,
        CancellationToken ct = default)
    {
        _logger.LogInformation("[IMPORT] Starting import: {FileName}", request.FileName);

        try
        {
            // Step 1: Validate file
            _validator.ValidateFile(request);

            // Step 2: Parse Excel
            var sheet = _parser.ParseFile(request.FileStream, request.FileName);
            var (dataRows, totalRows) = GetDataRows(sheet, request.HasHeader);

            if (totalRows == 0)
                throw new BadRequestException("No data rows found in the Excel file.");

            if (totalRows > MaxRows)
                throw new BadRequestException($"Excel file exceeds {MaxRows} rows.");

            _logger.LogInformation("[IMPORT] Found {RowCount} rows to process", totalRows);

            // Step 3: Load context (SKUs, categories)
            var existingSKUs = await _contextLoader.LoadExistingSKUsAsync(ct);
            var categoriesDict = await _contextLoader.LoadCategoriesDictAsync(ct);

            // Step 4: Process rows
            var (productsToInsert, rowErrors) = ProcessAllRows(
                dataRows, 
                existingSKUs, 
                categoriesDict
            );

            _logger.LogInformation("[IMPORT] Processed: Valid={Valid}, Failed={Failed}",
                productsToInsert.Count, rowErrors.Count);

            // Step 5: Batch insert
            if (productsToInsert.Count > 0)
            {
                await InsertProductsAsync(productsToInsert, ct);
            }

            return new ProductImportResultDto(
                TotalRows: totalRows,
                SuccessCount: productsToInsert.Count,
                FailedCount: rowErrors.Count,
                RowErrors: rowErrors
            );
        }
        catch (BadRequestException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[IMPORT] Unexpected error");
            throw new BadRequestException($"Import failed: {ex.Message}");
        }
    }

    private (List<ClosedXML.Excel.IXLRow> rows, int count) GetDataRows(
        ClosedXML.Excel.IXLWorksheet sheet, 
        bool hasHeader)
    {
        var allRows = sheet.RowsUsed();
        var startRow = hasHeader ? 2 : 1;
        var dataRows = allRows.Where(r => r.RowNumber() >= startRow).ToList();
        
        return (dataRows, dataRows.Count);
    }

    private (List<Ecomm.Domain.Entities.Product> products, List<ProductImportRowResultDto> errors) ProcessAllRows(
        List<ClosedXML.Excel.IXLRow> dataRows,
        HashSet<string> existingSKUs,
        Dictionary<string, Ecomm.Domain.Entities.Category> categoriesDict)
    {
        var productsToInsert = new List<Ecomm.Domain.Entities.Product>();
        var rowErrors = new List<ProductImportRowResultDto>();
        var fileSkus = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        foreach (var row in dataRows)
        {
            var rowNumber = row.RowNumber();
            var allErrors = new List<string>();

            try
            {
                // Extract row data
                var (dto, extractionErrors) = _extractor.ExtractRowData(row, rowNumber);
                allErrors.AddRange(extractionErrors);

                if (allErrors.Count > 0)
                {
                    rowErrors.Add(new ProductImportRowResultDto(rowNumber, allErrors));
                    _logger.LogWarning("[IMPORT] Row {Row}: Extraction errors", rowNumber);
                    continue;
                }

                // Process and validate row
                var (product, validationErrors) = _rowProcessor.ProcessRow(
                    dto, 
                    rowNumber, 
                    existingSKUs, 
                    categoriesDict, 
                    fileSkus
                );

                if (validationErrors.Count > 0)
                {
                    rowErrors.Add(new ProductImportRowResultDto(rowNumber, validationErrors));
                    continue;
                }

                // Valid row - add to insert list
                productsToInsert.Add(product!);
            }
            catch (Exception ex)
            {
                allErrors.Add($"Unexpected error: {ex.Message}");
                rowErrors.Add(new ProductImportRowResultDto(rowNumber, allErrors));
                _logger.LogError(ex, "[IMPORT] Row {Row}: Unexpected error", rowNumber);
            }
        }

        return (productsToInsert, rowErrors);
    }

    private async Task InsertProductsAsync(
        List<Ecomm.Domain.Entities.Product> products,
        CancellationToken ct)
    {
        try
        {
            _logger.LogInformation("[IMPORT] Inserting {Count} products", products.Count);

            await _products.AddRangeAsync(products, ct);
            await _uow.SaveChangesAsync(ct);

            _logger.LogInformation("[IMPORT] Successfully inserted {Count} products", products.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[IMPORT] Database insertion failed");
            throw new BadRequestException($"Failed to insert products: {ex.Message}");
        }
    }
}