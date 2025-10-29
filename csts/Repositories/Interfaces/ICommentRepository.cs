using csts.Models;

namespace csts.Repositories.Interfaces
{
    public interface ICommentRepository : IGenericRepository<Comment>
    {
        Task<IEnumerable<Comment>> GetCommentsByTicketAsync(int ticketId);
        Task<IEnumerable<Comment>> GetCommentsByUserAsync(int userId);
    }
}
