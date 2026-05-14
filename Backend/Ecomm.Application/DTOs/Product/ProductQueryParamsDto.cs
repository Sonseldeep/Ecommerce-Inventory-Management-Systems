namespace Ecomm.Application.DTOs.Product;

public class ProductQueryParamsDto
{
    public string? Search { get; set; }
    public Guid? CategoryId { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public string SortBy { get; set; } = "createdAt"; // createdAt, price, name
    public string SortOrder { get; set; } = "desc";   // asc, desc
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}