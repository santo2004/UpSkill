using csts.Models;

namespace csts.DTOs
{
    public class TicketCreateDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public TicketPriority Priority { get; set; } = TicketPriority.Medium;
        public int CreatedBy { get; set; }          // FK to UserId
        public int? AssignedTo { get; set; }        // Optional FK to UserId
    }

    public class TicketUpdateDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public TicketPriority Priority { get; set; } = TicketPriority.Medium;
        public TicketStatus Status { get; set; } = TicketStatus.New;
        public int? AssignedTo { get; set; }        // Can reassign ticket
        public bool IsDeleted { get; set; } = false;
    }

    public class TicketResponseDto
    {
        public int TicketId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string CreatedBy { get; set; } = string.Empty;
        public string? AssignedTo { get; set; }
        public bool IsDeleted { get; set; }
    }
}
