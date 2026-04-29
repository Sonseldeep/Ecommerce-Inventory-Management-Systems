using Ecomm.Application.Common;
using Ecomm.Application.DTOs.Category;
using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Application.Interfaces.Services;
using Ecomm.Application.Mappings;
using Ecomm.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Ecomm.Application.Services;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categories;
    private readonly IProductRepository _products;
    private readonly IUnitOfWork _uow;
    private readonly ILogger<CategoryService> _logger;

    public CategoryService(
        ICategoryRepository categories,
        IProductRepository products,
        IUnitOfWork uow,
        ILogger<CategoryService> logger)
    {
        _categories = categories;
        _products = products;
        _uow = uow;
        _logger = logger;
    }
    
    public async Task<CategoryResponseDto> CreateAsync(CreateCategoryRequestDto request, CancellationToken ct = default)
    {
        var name = request.Name.Trim();

        var exists = await _categories.ExistsByNameAsync(name, ct);
        if (exists) throw new BadRequestException("Category already exists.");

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

    // public async Task<CategoryResponseDto> CreateAsync(CreateCategoryRequestDto request, CancellationToken ct = default)
    // {
    //     var exists = await _categories.ExistsByNameAsync(request.Name.Trim(), ct);
    //     if (exists) throw new BadRequestException("Category already exists.");
    //
    //     var entity = new Category
    //     {
    //         Name = request.Name.Trim(),
    //         Description = request.Description?.Trim()
    //     };
    //
    //     await _categories.AddAsync(entity, ct);
    //     await _uow.SaveChangesAsync(ct);
    //
    //     return new CategoryResponseDto
    //     {
    //         Id = entity.Id,
    //         Name = entity.Name,
    //         Description = entity.Description
    //     };
    // }
    
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

    // public async Task<IEnumerable<CategoryResponseDto>> GetAllAsync(CancellationToken ct = default)
    // {
    //     var list = await _categories.GetAllAsync(ct);
    //     return list
    //         .Where(x => !x.IsDeleted)
    //         .Select(x => new CategoryResponseDto
    //         {
    //             Id = x.Id,
    //             Name = x.Name,
    //             Description = x.Description
    //         });
    // }

    public async Task<CategoryResponseDto> UpdateAsync(Guid id, UpdateCategoryRequestDto request, CancellationToken ct = default)
    {
        var category = await _categories.GetByIdAsync(id, ct);
        if (category is null) throw new NotFoundException("Category not found.");

        var name = request.Name.Trim();
        if (!string.Equals(category.Name, name, StringComparison.OrdinalIgnoreCase))
        {
            var nameExists = await _categories.ExistsByNameAsync(name, ct);
            if (nameExists) throw new BadRequestException("Category name already exists.");
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
        if (category is null) throw new NotFoundException("Category not found.");

        // prevent deleting category that still has active products
        var products = await _products.GetAllWithDetailsAsync(ct);
        var inUse = products.Any(p => !p.IsDeleted && p.CategoryId == id);
        if (inUse) throw new BadRequestException("Cannot delete category because products are assigned to it.");

        _categories.Remove(category);
        await _uow.SaveChangesAsync(ct);

        _logger.LogInformation("Category deleted: {CategoryId}", id);
    }
}

// public class CategoryService : ICategoryService
// {
//     private readonly ICategoryRepository _categories;
//     private readonly IUnitOfWork _uow;
//     private readonly ILogger<CategoryService> _logger;
//
//     public CategoryService(ICategoryRepository categories, IUnitOfWork uow, ILogger<CategoryService> logger)
//     {
//         _categories = categories;
//         _uow = uow;
//         _logger = logger;
//     }
//
//     public async Task<CategoryResponseDto> CreateAsync(CreateCategoryRequestDto request, CancellationToken ct = default)
//     {
//         if (await _categories.ExistsByNameAsync(request.Name.Trim(), ct))
//             throw new BadRequestException("Category already exists.");
//
//         var entity = request.ToEntity();
//         await _categories.AddAsync(entity, ct);
//         await _uow.SaveChangesAsync(ct);
//
//         _logger.LogInformation("Category created: {Name}", entity.Name);
//         return entity.ToDto();
//     }
//
//     public async Task<IEnumerable<CategoryResponseDto>> GetAllAsync(CancellationToken ct = default)
//     {
//         var list = await _categories.GetAllAsync(ct);
//         return list.Select(x => x.ToDto());
//     }
//     
//     
// }