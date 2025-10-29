using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace csts.Models
{
    public class Ticket
    {
        [Key]
        public int TicketId { get; set; }

        [Required(ErrorMessage = "Give your ticket name here..")]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Give your desription here..")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Give your ticket priority here..")]
        public TicketPriority Priority { get; set; } = TicketPriority.Medium;

        [Required(ErrorMessage = "Give your ticket status here..")]
        public TicketStatus Status { get; set; } = TicketStatus.New;
        public bool IsDeleted { get; set; } = false;

        [ForeignKey("CreatedByUser")]
        public int CreatedBy { get; set; }

        [ForeignKey("AssignedToUser")]
        public int? AssignedTo { get; set; }

        // Navigation Properties
        public User CreatedByUser { get; set; }
        public User? AssignedToUser { get; set; }
        public ICollection<Comment> Comments { get; set; }
    }

    public enum TicketPriority
    {
        Low = 1,
        Medium = 2,
        High = 3
    }

    public enum TicketStatus
    {
        New = 1,
        Assigned = 2,
        InProgress = 3,
        Resolved = 4,
        Closed = 5
    }
}
