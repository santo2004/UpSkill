using csts.Data;
using csts.Models;
using csts.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace csts.Repositories.Implementations
{
    public class TicketRepository : GenericRepository<Ticket>, ITicketRepository
    {
        public TicketRepository(AppDbContext context) : base(context) { }

        // ✅ Get all active tickets (includes user names)
        public async Task<IEnumerable<Ticket>> GetAllActiveAsync()
        {
            return await _dbSet
                .Include(t => t.CreatedByUser)
                .Include(t => t.AssignedToUser)
                .Where(t => !t.IsDeleted)
                .AsNoTracking()
                .ToListAsync();
        }

        // ✅ Get all tickets created by a specific user
        public async Task<IEnumerable<Ticket>> GetTicketsByUserAsync(int userId)
        {
            return await _dbSet
                .Include(t => t.CreatedByUser)
                .Include(t => t.AssignedToUser)
                .Where(t => t.CreatedBy == userId && !t.IsDeleted)
                .AsNoTracking()
                .ToListAsync();
        }

        // ✅ Filter tickets dynamically by status and priority
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

        // ✅ Overridden — loads navigation properties
        public override async Task<Ticket?> GetByIdAsync(int id)
        {
            return await _dbSet
                .Include(t => t.CreatedByUser)
                .Include(t => t.AssignedToUser)
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.TicketId == id && !t.IsDeleted);
        }

        // ✅ Check if ticket exists
        public async Task<bool> ExistsAsync(int id)
        {
            return await _dbSet.AnyAsync(t => t.TicketId == id && !t.IsDeleted);
        }
    }
}
