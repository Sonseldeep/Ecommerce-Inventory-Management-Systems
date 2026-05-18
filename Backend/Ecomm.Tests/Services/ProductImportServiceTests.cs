using ClosedXML.Excel;
using Ecomm.Application.Common;
using Ecomm.Application.DTOs.Product;
using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Application.Interfaces.Services;
using Ecomm.Application.Services;
using Ecomm.Domain.Entities;
using FakeItEasy;
using FluentAssertions;
using Microsoft.Extensions.Logging;

namespace Ecomm.Tests.Services;

public class ProductImportServiceTests
{
    private readonly IExcelParser _parser = A.Fake<IExcelParser>();
    private readonly IImportValidator _validator = A.Fake<IImportValidator>();
    private readonly IRowDataExtractor _extractor = A.Fake<IRowDataExtractor>();
    private readonly IProductImportContextLoader _contextLoader = A.Fake<IProductImportContextLoader>();
    private readonly IProductImportRowProcessor _rowProcessor = A.Fake<IProductImportRowProcessor>();
    private readonly IProductRepository _products = A.Fake<IProductRepository>();
    private readonly IUnitOfWork _uow = A.Fake<IUnitOfWork>();
    private readonly ILogger<ProductImportService> _logger = A.Fake<ILogger<ProductImportService>>();

    private ProductImportService CreateSut()
        => new(_parser, _validator, _extractor, _contextLoader, _rowProcessor, _products, _uow, _logger);

    [Fact]
    public async Task ImportAsync_Should_Insert_Products_When_Valid()
    {
        // Arrange
        var request = new ProductImportRequestDto(
            new MemoryStream(),
            "file.xlsx",
            100,
            true
        );

        using var wb = new XLWorkbook();
        var ws = wb.AddWorksheet("Sheet1");

        ws.Cell(1, 1).Value = "Name";
        ws.Cell(2, 1).Value = "Product1";

        var row = ws.Row(2);

        A.CallTo(() => _parser.ParseFile(A<Stream>._, "file.xlsx"))
            .Returns(ws);

        A.CallTo(() => _contextLoader.LoadExistingSKUsAsync(A<CancellationToken>._))
            .Returns(new HashSet<string>());

        A.CallTo(() => _contextLoader.LoadCategoriesDictAsync(A<CancellationToken>._))
            .Returns(new Dictionary<string, Category>());

        A.CallTo(() => _extractor.ExtractRowData(A<IXLRow>._, A<int>._))
            .Returns((
                new ProductImportRowDto(
                    "P1", "SKU1", "Desc", 10, null, 2, 1, "Cat"
                ),
                new List<string>()
            ));

        A.CallTo(() => _rowProcessor.ProcessRow(
                A<ProductImportRowDto>._,
                A<int>._,
                A<HashSet<string>>._,
                A<Dictionary<string, Category>>._,
                A<HashSet<string>>._))
            .Returns((
                new Product
                {
                    Id = Guid.NewGuid(),
                    Name = "P1",
                    SKU = "SKU1"
                },
                new List<string>()
            ));

        // Act
        var result = await CreateSut().ImportAsync(request);

        // Assert
        result.SuccessCount.Should().Be(1);
        result.FailedCount.Should().Be(0);
        result.TotalRows.Should().Be(1);

        A.CallTo(() => _products.AddRangeAsync(
                A<List<Product>>._,
                A<CancellationToken>._))
            .MustHaveHappenedOnceExactly();

        A.CallTo(() => _uow.SaveChangesAsync(A<CancellationToken>._))
            .MustHaveHappenedOnceExactly();
    }

    [Fact]
    public async Task ImportAsync_Should_Throw_When_No_Rows()
    {
        // Arrange
        var request = new ProductImportRequestDto(
            new MemoryStream(),
            "file.xlsx",
            100,
            false
        );

        using var wb = new XLWorkbook();
        var ws = wb.AddWorksheet("Sheet1"); // no data rows

        A.CallTo(() => _parser.ParseFile(A<Stream>._, "file.xlsx"))
            .Returns(ws);

        // Act
        var act = async () => await CreateSut().ImportAsync(request);

        // Assert
        await act.Should()
            .ThrowAsync<BadRequestException>()
            .WithMessage("No data rows found in the Excel file.");
    }
}