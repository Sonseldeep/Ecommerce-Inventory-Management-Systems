using ClosedXML.Excel;
using Ecomm.Application.Services;
using FakeItEasy;
using FluentAssertions;
using Microsoft.Extensions.Logging;

namespace Ecomm.Tests.Services;

public class RowDataExtractorTests
{
    [Fact]
    public void ExtractRowData_Should_Return_Dto_And_No_Errors()
    {
        using var wb = new XLWorkbook();
        var ws = wb.AddWorksheet("Sheet1");
        ws.Cell(1, 1).Value = "Name";
        ws.Cell(1, 2).Value = "SKU";
        ws.Cell(1, 3).Value = "Desc";
        ws.Cell(1, 4).Value = 10;
        ws.Cell(1, 5).Value = 5;
        ws.Cell(1, 6).Value = 20;
        ws.Cell(1, 7).Value = 2;
        ws.Cell(1, 8).Value = "Cat";

        var extractor = new RowDataExtractor(A.Fake<ILogger<RowDataExtractor>>());

        var (dto, errors) = extractor.ExtractRowData(ws.Row(1), 1);

        errors.Should().BeEmpty();
        dto.SKU.Should().Be("SKU");
    }
}