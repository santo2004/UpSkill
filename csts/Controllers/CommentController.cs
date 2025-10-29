using Microsoft.AspNetCore.Mvc;
using csts.Services;
using csts.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace csts.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly CommentService _commentService;

        public CommentController(CommentService commentService)
        {
            _commentService = commentService;
        }

        // ✅ Get all comments for a specific ticket
        [HttpGet("ticket/{ticketId}")]
        public async Task<IActionResult> GetCommentsByTicket(int ticketId)
        {
            var comments = await _commentService.GetCommentsByTicketAsync(ticketId);
            return Ok(comments);
        }

        // ✅ Get all comments by a specific user
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetCommentsByUser(int userId)
        {
            var comments = await _commentService.GetCommentsByUserAsync(userId);
            return Ok(comments);
        }

        // ✅ Add new comment
        [HttpPost]
        public async Task<IActionResult> AddComment([FromBody] CommentCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var createdComment = await _commentService.AddCommentAsync(dto);
                return CreatedAtAction(nameof(GetCommentsByTicket), new { ticketId = dto.TicketId }, createdComment);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // ✅ Update comment
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateComment(int id, [FromBody] CommentUpdateDto dto)
        {
            await _commentService.UpdateCommentAsync(id, dto);
            return NoContent();
        }

        // ✅ Soft delete comment
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            await _commentService.DeleteCommentAsync(id);
            return NoContent();
        }
    }
}
