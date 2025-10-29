using csts.DTOs;
using csts.Models;
using csts.Repositories.Interfaces;

namespace csts.Services
{
    public class TicketService
    {
        private readonly ITicketRepository _ticketRepo;
        private readonly IUserRepository _userRepo;

        public TicketService(ITicketRepository ticketRepo, IUserRepository userRepo)
        {
            _ticketRepo = ticketRepo;
            _userRepo = userRepo;
        }

        private static TicketResponseDto ToTicketResponse(Ticket t) => new()
        {
            TicketId = t.TicketId,
            Title = t.Title,
            Description = t.Description,
            Priority = t.Priority.ToString(),
            Status = t.Status.ToString(),
            CreatedBy = t.CreatedByUser?.Name ?? "Unknown",
            AssignedTo = t.AssignedToUser?.Name,
            IsDeleted = t.IsDeleted
        };

        // ✅ Get all active tickets
        public async Task<IEnumerable<TicketResponseDto>> GetAllTicketsAsync()
        {
            var tickets = await _ticketRepo.GetAllActiveAsync();
            return tickets.Select(ToTicketResponse);
        }

        // ✅ Get single ticket by ID
        public async Task<TicketResponseDto?> GetTicketByIdAsync(int id)
        {
            var ticket = await _ticketRepo.GetByIdAsync(id);
            if (ticket == null) return null;

            return ToTicketResponse(ticket);
        }

        // ✅ Create new ticket (validation + auto-status)
        public async Task<int> AddTicketAsync(TicketCreateDto dto)
        {
            if (!await _userRepo.ExistsAsync(dto.CreatedBy))
                throw new Exception("Invalid CreatedBy user");

            if (dto.AssignedTo.HasValue && !await _userRepo.ExistsAsync(dto.AssignedTo.Value))
                throw new Exception("AssignedTo user does not exist");

            var ticket = new Ticket
            {
                Title = dto.Title.Trim(),
                Description = dto.Description.Trim(),
                Priority = dto.Priority,
                CreatedBy = dto.CreatedBy,
                AssignedTo = dto.AssignedTo,
                Status = TicketStatus.New,
                IsDeleted = false
            };

            await _ticketRepo.AddAsync(ticket);
            await _ticketRepo.SaveChangesAsync();
            return ticket.TicketId;
        }

        // ✅ Update existing ticket
        public async Task UpdateTicketAsync(int id, TicketUpdateDto dto)
        {
            var ticket = await _ticketRepo.GetByIdAsync(id);
            if (ticket == null || ticket.IsDeleted) return;

            if (dto.AssignedTo.HasValue && !await _userRepo.ExistsAsync(dto.AssignedTo.Value))
                throw new Exception("AssignedTo user does not exist");

            ticket.Title = dto.Title.Trim();
            ticket.Description = dto.Description.Trim();
            ticket.Priority = dto.Priority;
            ticket.Status = dto.Status;
            ticket.AssignedTo = dto.AssignedTo;

            await _ticketRepo.UpdateAsync(ticket);
            await _ticketRepo.SaveChangesAsync();
        }

        // ✅ Soft delete
        public async Task DeleteTicketAsync(int id)
        {
            await _ticketRepo.DeleteAsync(id);
            await _ticketRepo.SaveChangesAsync();
        }

        // ✅ Filter (bonus)
        public async Task<IEnumerable<TicketResponseDto>> FilterTicketsAsync(TicketStatus? status, TicketPriority? priority)
        {
            var tickets = await _ticketRepo.FilterTicketsAsync(status, priority);
            return tickets.Select(ToTicketResponse);
        }

        // ✅ Get tickets by specific user
        public async Task<IEnumerable<TicketResponseDto>> GetTicketsByUserAsync(int userId)
        {
            var tickets = await _ticketRepo.GetTicketsByUserAsync(userId);
            return tickets.Select(ToTicketResponse);
        }
    }
}
