namespace Ecomm.Application.DTOs.Category;

public class CategoryQueryParamsDto
{
    public string? Search { get; set; }
    public string SortBy { get; set; } = "name"; // name
    public string SortOrder { get; set; } = "asc"; // asc, desc
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}