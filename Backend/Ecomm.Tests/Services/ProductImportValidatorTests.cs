using Ecomm.Application.Common;
using Ecomm.Application.DTOs.Product;
using Ecomm.Application.Services;
using FakeItEasy;
using FluentAssertions;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace Ecomm.Tests.Services;

public class ProductImportValidatorTests
{
    [Fact]
    public void ValidateFile_Should_Throw_When_Not_Xlsx()
    {
        var validator = new ProductImportValidator(
            new InlineValidator<ProductImportRowDto>(),
            A.Fake<ILogger<ProductImportValidator>>());

        var request = new ProductImportRequestDto(
            FileStream: new MemoryStream(),
            FileName: "file.csv",
            Length: 100,
            HasHeader: true
        );

        var act = () => validator.ValidateFile(request);

        act.Should().Throw<BadRequestException>();
    }
}