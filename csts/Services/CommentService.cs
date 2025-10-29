using csts.DTOs;
using csts.Models;
using csts.Repositories.Interfaces;

namespace csts.Services
{
    public class CommentService
    {
        private readonly ICommentRepository _commentRepo;
        private readonly ITicketRepository _ticketRepo;
        private readonly IUserRepository _userRepo;

        public CommentService(ICommentRepository commentRepo, ITicketRepository ticketRepo, IUserRepository userRepo)
        {
            _commentRepo = commentRepo;
            _ticketRepo = ticketRepo;
            _userRepo = userRepo;
        }

        private static CommentResponseDto ToResponse(Comment c) => new()
        {
            CommentId = c.CommentId,
            Message = c.Message,
            TicketId = c.TicketId,
            UserName = c.User?.Name ?? "Unknown"
        };

        // ✅ Get comments for a specific ticket
        public async Task<IEnumerable<CommentResponseDto>> GetCommentsByTicketAsync(int ticketId)
        {
            var comments = await _commentRepo.GetCommentsByTicketAsync(ticketId);
            return comments.Select(ToResponse);
        }

        // ✅ Get comments for a specific user
        public async Task<IEnumerable<CommentResponseDto>> GetCommentsByUserAsync(int userId)
        {
            var comments = await _commentRepo.GetCommentsByUserAsync(userId);
            return comments.Select(ToResponse);
        }

        // ✅ Add new comment (validate user & ticket)
        public async Task<CommentResponseDto> AddCommentAsync(CommentCreateDto dto)
        {
            if (!await _ticketRepo.ExistsAsync(dto.TicketId))
                throw new Exception("Invalid Ticket ID");

            if (!await _userRepo.ExistsAsync(dto.UserId))
                throw new Exception("Invalid User ID");

            var comment = new Comment
            {
                Message = dto.Message.Trim(),
                TicketId = dto.TicketId,
                UserId = dto.UserId,
                IsDeleted = false
            };

            await _commentRepo.AddAsync(comment);
            await _commentRepo.SaveChangesAsync();

            // reload with username
            var saved = await _commentRepo.GetByIdAsync(comment.CommentId);
            return ToResponse(saved!);
        }

        // ✅ Update comment message
        public async Task UpdateCommentAsync(int id, CommentUpdateDto dto)
        {
            var comment = await _commentRepo.GetByIdAsync(id);
            if (comment == null || comment.IsDeleted)
                throw new Exception("Comment not found");

            comment.Message = dto.Message.Trim();
            await _commentRepo.UpdateAsync(comment);
            await _commentRepo.SaveChangesAsync();
        }

        // ✅ Soft delete
        public async Task DeleteCommentAsync(int id)
        {
            await _commentRepo.DeleteAsync(id);
            await _commentRepo.SaveChangesAsync();
        }
    }
}
