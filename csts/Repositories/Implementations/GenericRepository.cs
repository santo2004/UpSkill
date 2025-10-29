using csts.Data;
using csts.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace csts.Repositories.Implementations
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        protected readonly AppDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public GenericRepository(AppDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        public async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                var prop = typeof(T).GetProperty("IsDeleted");
                if (prop != null)
                {
                    prop.SetValue(entity, true); //soft delete //IsDelete=true
                    _dbSet.Update(entity);
                }
            }
        }

        public async Task<IEnumerable<T>> GetAllAsync() => await _dbSet.AsNoTracking().ToListAsync();
        public virtual async Task<T?> GetByIdAsync(int id) => await _dbSet.FindAsync(id);
        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(T entity)
        {
            _dbSet.Update(entity);
            await Task.CompletedTask;
        }
    }
}
