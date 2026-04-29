namespace Ecomm.Application.DTOs.Product;

public class PagedProductResponseDto
{
    public IEnumerable<ProductResponseDto> Items { get; set; } = Enumerable.Empty<ProductResponseDto>();
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
}