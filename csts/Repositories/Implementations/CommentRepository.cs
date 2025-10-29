using csts.Data;
using csts.Models;
using csts.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace csts.Repositories.Implementations
{
    public class CommentRepository : GenericRepository<Comment>, ICommentRepository
    {
        public CommentRepository(AppDbContext context) : base(context) { }

        // ✅ Get all comments for a ticket (sorted by latest)
        public async Task<IEnumerable<Comment>> GetCommentsByTicketAsync(int ticketId)
        {
            return await _dbSet
                .Include(c => c.User)
                .Include(c => c.Ticket)
                .Where(c => c.TicketId == ticketId && !c.IsDeleted)
                .OrderByDescending(c => c.CreatedDate)   // ✅ Fixed: CreatedDate instead of CreateDate
                .AsNoTracking()
                .ToListAsync();
        }

        // ✅ Get all comments made by a specific user (sorted by latest)
        public async Task<IEnumerable<Comment>> GetCommentsByUserAsync(int userId)
        {
            return await _dbSet
                .Include(c => c.Ticket)
                .Include(c => c.User)
                .Where(c => c.UserId == userId && !c.IsDeleted)
                .OrderByDescending(c => c.CreatedDate)   // ✅ Fixed: CreatedDate instead of CreateDate
                .AsNoTracking()
                .ToListAsync();
        }

        // ✅ Get comment by ID (with navigation properties)
        public override async Task<Comment?> GetByIdAsync(int id)
        {
            return await _dbSet
                .Include(c => c.User)
                .Include(c => c.Ticket)
                .FirstOrDefaultAsync(c => c.CommentId == id && !c.IsDeleted);
        }
    }
}
