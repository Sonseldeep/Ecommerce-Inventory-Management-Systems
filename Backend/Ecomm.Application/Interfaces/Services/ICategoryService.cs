using Ecomm.Application.DTOs.Category;

namespace Ecomm.Application.Interfaces.Services;

public interface ICategoryService
{
    Task<CategoryResponseDto> CreateAsync(CreateCategoryRequestDto request, CancellationToken ct = default);
    Task<IEnumerable<CategoryResponseDto>> GetAllAsync(CancellationToken ct = default);
    
    Task<CategoryResponseDto> UpdateAsync(Guid id, UpdateCategoryRequestDto request, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}