using csts.Models;

namespace csts.Repositories.Interfaces
{
    public interface ITicketRepository : IGenericRepository<Ticket>
    {
        Task<IEnumerable<Ticket>> GetAllActiveAsync();
        Task<IEnumerable<Ticket>> GetTicketsByUserAsync(int userId);
        Task<IEnumerable<Ticket>> FilterTicketsAsync(TicketStatus? status, TicketPriority? priority);
        Task<bool> ExistsAsync(int id);
    }
}
