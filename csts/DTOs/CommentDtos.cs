namespace csts.DTOs
{
    public class CommentCreateDto
    {
        public string Message { get; set; } = string.Empty;
        public int TicketId { get; set; }
        public int UserId { get; set; }
    }

    public class CommentUpdateDto
    {
        public string Message { get; set; } = string.Empty;
    }

    public class CommentResponseDto
    {
        public int CommentId { get; set; }
        public string Message { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public int TicketId { get; set; }
        public DateTime CreateDate { get; set; }
    }
}
