using ClosedXML.Excel;
using Ecomm.Application.Common;
using Ecomm.Application.Services;
using FakeItEasy;
using FluentAssertions;
using Microsoft.Extensions.Logging;

namespace Ecomm.Tests.Services;

public class ExcelParserTests
{
    [Fact]
    public void ParseFile_Should_Return_Sheet()
    {
        using var wb = new XLWorkbook();
        wb.AddWorksheet("Sheet1");

        using var ms = new MemoryStream();
        wb.SaveAs(ms);
        ms.Position = 0;

        var parser = new ExcelParser(A.Fake<ILogger<ExcelParser>>());

        var sheet = parser.ParseFile(ms, "file.xlsx");

        sheet.Should().NotBeNull();
        sheet.Name.Should().Be("Sheet1");
    }

    [Fact]
    public void ParseFile_Should_Throw_When_Invalid()
    {
        var parser = new ExcelParser(A.Fake<ILogger<ExcelParser>>());

        var act = () => parser.ParseFile(new MemoryStream([1, 2, 3]), "bad.xlsx");

        act.Should().Throw<BadRequestException>();
    }
}