namespace Ecomm.Application.DTOs.Category;

public class UpdateCategoryRequestDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}