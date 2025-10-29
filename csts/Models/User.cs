using System.ComponentModel.DataAnnotations;

namespace csts.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required(ErrorMessage = "Give your name here..")]
        [MaxLength(100)]
        [RegularExpression(@"^[a-zA-Z\s]+$", ErrorMessage = "Name must contain only letters")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Give your email here..")]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Give your password here..")]
        public string PasswordHash { get; set; } = string.Empty;
        
        [Required]
        public UserRole Role { get; set; } = UserRole.Customer;
        public bool IsActive { get; set; } = true;
        public bool IsDeleted { get; set; } = false;

        //Navigation Properties
        public ICollection<Ticket> CreatedTickets { get; set; }
        public ICollection<Ticket> AssignedTickets { get; set; }
        public ICollection<Comment> Comments { get; set; }
    }

    public enum UserRole
    {
        Admin = 1,
        Agent = 2,
        Customer = 3
    }
}
