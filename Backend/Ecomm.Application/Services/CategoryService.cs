using Ecomm.Application.Common;
using Ecomm.Application.DTOs.Category;
using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Application.Interfaces.Services;
using Ecomm.Domain.Entities;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Ecomm.Application.Services;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categories;
    private readonly IProductRepository _products;
    private readonly IUnitOfWork _uow;
    private readonly ILogger<CategoryService> _logger;
    private readonly IValidator<CreateCategoryRequestDto> _createValidator;
    private readonly IValidator<UpdateCategoryRequestDto> _updateValidator;

    public CategoryService(
        ICategoryRepository categories,
        IProductRepository products,
        IUnitOfWork uow,
        ILogger<CategoryService> logger, IValidator<CreateCategoryRequestDto> createValidator, IValidator<UpdateCategoryRequestDto> updateValidator)
    {
        _categories = categories;
        _products = products;
        _uow = uow;
        _logger = logger;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
    }

    public async Task<PagedResult<CategoryResponseDto>> SearchAsync(CategoryQueryParamsDto query, CancellationToken ct = default)
    {
        query.PageNumber = query.PageNumber <= 0 ? 1 : query.PageNumber;
        query.PageSize = query.PageSize <= 0 ? 10 : Math.Min(query.PageSize, 100);

        var (items, total) = await _categories.SearchAsync(query, ct);

        return new PagedResult<CategoryResponseDto>
        {
            Items = items.Select(x => new CategoryResponseDto
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description
            }),
            PageNumber = query.PageNumber,
            PageSize = query.PageSize,
            TotalCount = total
        };
    }

    public async Task<CategoryResponseDto> CreateAsync(CreateCategoryRequestDto request, CancellationToken ct = default)
    {
        await _createValidator.ValidateAndThrowAsync(request, ct);
        var name = request.Name.Trim();

        var exists = await _categories.ExistsByNameAsync(name, ct);
        
        if (exists)
        {
            throw new BadRequestException("Category already exists.");
        };

        var entity = new Category
        {
            Name = name,
            Description = request.Description?.Trim()
        };

        await _categories.AddAsync(entity, ct);

        try
        {
            await _uow.SaveChangesAsync(ct);
        }
        catch (DbUpdateException)
        {
            // race-condition safety for unique index
            throw new BadRequestException("Category already exists.");
        }

        return new CategoryResponseDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Description = entity.Description
        };
    }


    
    public async Task<IEnumerable<CategoryResponseDto>> GetAllAsync(CancellationToken ct = default)
    {
        var list = await _categories.GetActiveAsync(ct);
        return list.Select(x => new CategoryResponseDto
        {
            Id = x.Id,
            Name = x.Name,
            Description = x.Description
        });
    }

    
    public async Task<CategoryResponseDto> UpdateAsync(Guid id, UpdateCategoryRequestDto request, CancellationToken ct = default)
    {
        await _updateValidator.ValidateAndThrowAsync(request, ct);
        
        var category = await _categories.GetByIdAsync(id, ct);
        if (category is null)
        {
            throw new NotFoundException("Category not found.");
        }

        var name = request.Name.Trim();
        if (!string.Equals(category.Name, name, StringComparison.OrdinalIgnoreCase))
        {
            var nameExists = await _categories.ExistsByNameAsync(name, ct);
            if (nameExists)
            {
                throw new BadRequestException("Category name already exists.");
            }
        }

        category.Name = name;
        category.Description = request.Description?.Trim();

        _categories.Update(category);
        await _uow.SaveChangesAsync(ct);

        _logger.LogInformation("Category updated: {CategoryId}", id);

        return new CategoryResponseDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description
        };
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var category = await _categories.GetByIdAsync(id, ct);
        if (category is null)
        {
            throw new NotFoundException("Category not found.");
        }

        // prevent deleting category that still has active products
     
        var inUse = await _products.Query()
            .AnyAsync(p => !p.IsDeleted && p.CategoryId == id, ct);
        if (inUse)
        {
            throw new BadRequestException("Cannot delete category because products are assigned to it.");
        }

        _categories.Remove(category);
        await _uow.SaveChangesAsync(ct);

        _logger.LogInformation("Category deleted: {CategoryId}", id);
    }
}


