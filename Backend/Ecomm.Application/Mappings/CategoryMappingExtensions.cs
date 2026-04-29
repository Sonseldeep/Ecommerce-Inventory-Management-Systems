using Ecomm.Application.DTOs.Category;
using Ecomm.Domain.Entities;

namespace Ecomm.Application.Mappings;


public static class CategoryMappingExtensions
{
    public static Category ToEntity(this CreateCategoryRequestDto dto)
    {
        return new Category
        {
            Name = dto.Name.Trim(),
            Description = dto.Description?.Trim()
        };
    }

    public static CategoryResponseDto ToDto(this Category entity)
    {
        return new CategoryResponseDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Description = entity.Description
        };
    }
}