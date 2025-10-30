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
            var createdProp = typeof(T).GetProperty("CreatedDate");
            if (createdProp != null)
                createdProp.SetValue(entity, DateTime.UtcNow);

            await _dbSet.AddAsync(entity);
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                var isDeletedProp = typeof(T).GetProperty("IsDeleted");
                if (isDeletedProp != null)
                {
                    isDeletedProp.SetValue(entity, true);
                    _dbSet.Update(entity);
                }
                else
                {
                    _dbSet.Remove(entity);
                }

                var updatedProp = typeof(T).GetProperty("UpdatedDate");
                if (updatedProp != null)
                    updatedProp.SetValue(entity, DateTime.UtcNow);
            }
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbSet.AsNoTracking().ToListAsync();
        }

        public virtual async Task<T?> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(T entity)
        {
            var updatedProp = typeof(T).GetProperty("UpdatedDate");
            if (updatedProp != null)
                updatedProp.SetValue(entity, DateTime.UtcNow);

            _dbSet.Update(entity);
            await Task.CompletedTask;
        }
    }
}
