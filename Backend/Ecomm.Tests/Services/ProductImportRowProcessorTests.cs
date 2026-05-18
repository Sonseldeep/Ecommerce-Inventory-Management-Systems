using Ecomm.Application.DTOs.Product;
using Ecomm.Application.Services;
using Ecomm.Domain.Entities;
using FakeItEasy;
using FluentAssertions;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace Ecomm.Tests.Services;

public class ProductImportRowProcessorTests
{
    [Fact]
    public void ProcessRow_Should_Return_Error_When_Category_Missing()
    {
        var validator = new InlineValidator<ProductImportRowDto>();
        var processor = new ProductImportRowProcessor(validator, A.Fake<ILogger<ProductImportRowProcessor>>());

        var dto = new ProductImportRowDto("P1", "SKU1", "D", 10, null, 5, 1, "");

        var (product, errors) = processor.ProcessRow(dto, 1, new HashSet<string>(), new Dictionary<string, Category>(), new HashSet<string>());

        product.Should().BeNull();
        errors.Should().Contain("Category name is required.");
    }
}