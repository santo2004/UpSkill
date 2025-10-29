using System.ComponentModel.DataAnnotations;

namespace csts.Models
{
    public class Comment
    {
        [Key]
        public int CommentId { get; set; }

        [Required(ErrorMessage = "Give your ticket id here..")]
        public int TicketId { get; set; }

        [Required(ErrorMessage = "Give your user id here..")]
        public int UserId { get; set; }

        [Required(ErrorMessage = "Give your comment/message here..")]
        public string Message { get; set; } = string.Empty;
        public DateTime CreateDate { get; set; } = DateTime.UtcNow;
        public bool IsDeleted { get; set; } = false;

        // Navigation Properties
        public Ticket Ticket { get; set; }
        public User User { get; set; }
    }
}