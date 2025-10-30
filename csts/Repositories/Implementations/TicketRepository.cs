using csts.Data;
using csts.Models;
using csts.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace csts.Repositories.Implementations
{
    public class TicketRepository : GenericRepository<Ticket>, ITicketRepository
    {
        public TicketRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<Ticket>> GetAllActiveAsync()
        {
            return await _dbSet
                .Include(t => t.CreatedByUser)
                .Include(t => t.AssignedToUser)
                .Where(t => !t.IsDeleted)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<IEnumerable<Ticket>> GetTicketsByUserAsync(int userId)
        {
            return await _dbSet
                .Include(t => t.CreatedByUser)
                .Include(t => t.AssignedToUser)
                .Where(t => t.CreatedBy == userId && !t.IsDeleted)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<IEnumerable<Ticket>> FilterTicketsAsync(TicketStatus? status, TicketPriority? priority)
        {
            var query = _dbSet
                .Include(t => t.CreatedByUser)
                .Include(t => t.AssignedToUser)
                .Where(t => !t.IsDeleted)
                .AsQueryable();

            if (status.HasValue)
                query = query.Where(t => t.Status == status.Value);

            if (priority.HasValue)
                query = query.Where(t => t.Priority == priority.Value);

            return await query.AsNoTracking().ToListAsync();
        }

        public override async Task<Ticket?> GetByIdAsync(int id)
        {
            return await _dbSet
                .Include(t => t.CreatedByUser)
                .Include(t => t.AssignedToUser)
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.TicketId == id && !t.IsDeleted);
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _dbSet.AnyAsync(t => t.TicketId == id && !t.IsDeleted);
        }
    }
}
