using csts.Models;

namespace csts.Repositories.Interfaces
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<IEnumerable<User>> GetActiveUserAsync();
        Task<User?> GetByEmailAsync(string email);
        Task<bool> EmailExistsAsync(string email, int? excludeUserId = null);
        Task<bool> ExistsAsync(int id);
    }
}
