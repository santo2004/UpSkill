using csts.Models;
using csts.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using csts.Data;

namespace csts.Repositories.Implementations
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<User>> GetActiveUserAsync()
        {
            return await _dbSet
                .Where(u => u.IsActive && !u.IsDeleted)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _dbSet
                .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower() && !u.IsDeleted);
        }

        public async Task<bool> EmailExistsAsync(string email, int? excludeUserId = null)
        {
            var normalizedEmail = email.ToLower();
            var query = _dbSet
                .Where(u => u.Email.ToLower() == normalizedEmail && !u.IsDeleted);

            if (excludeUserId.HasValue)
                query = query.Where(u => u.UserId != excludeUserId.Value);

            return await query.AnyAsync();
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _dbSet.AnyAsync(u => u.UserId == id && !u.IsDeleted);
        }
    }
}
