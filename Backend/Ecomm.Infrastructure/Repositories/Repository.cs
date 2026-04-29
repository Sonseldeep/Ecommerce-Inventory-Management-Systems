using System.Linq.Expressions;
using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Domain.Common;
using Ecomm.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Ecomm.Infrastructure.Repositories;

public class Repository<T> : IRepository<T> where T : BaseEntity
{
    protected readonly AppDbContext _db;
    protected readonly DbSet<T> _set;

    public Repository(AppDbContext db)
    {
        _db = db;
        _set = db.Set<T>();
    }

    public async Task AddAsync(T entity, CancellationToken ct = default)
        => await _set.AddAsync(entity, ct);

    public async Task<IEnumerable<T>> GetAllAsync(CancellationToken ct = default)
        => await _set.Where(x => !x.IsDeleted).ToListAsync(ct);

    public async Task<T?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => await _set.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted, ct);

    public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default)
        => await _set.Where(x => !x.IsDeleted).Where(predicate).ToListAsync(ct);

    public void Update(T entity)
    {
        entity.UpdatedAtUtc = DateTime.UtcNow;
        _set.Update(entity);
    }

    public void Remove(T entity)
    {
        entity.IsDeleted = true;
        entity.UpdatedAtUtc = DateTime.UtcNow;
        _set.Update(entity);
    }

    public IQueryable<T> Query()
        => _set.Where(x => !x.IsDeleted).AsQueryable();
}