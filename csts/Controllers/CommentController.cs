using Microsoft.AspNetCore.Mvc;
using csts.Services;
using csts.DTOs;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace csts.Controllers
{
    [Authorize(Roles = "Admin,Agent,Customer")]
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly CommentService _commentService;

        public CommentController(CommentService commentService)
        {
            _commentService = commentService;
        }

        [HttpGet("ticket/{ticketId}")]
        public async Task<IActionResult> GetCommentsByTicket(int ticketId)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                var userRole = User.FindFirst(ClaimTypes.Role)!.Value;

                if (userRole == "Customer")
                {
                    var comments = await _commentService.GetCommentsByUserAsync(userId);
                    var belongs = comments.Any(c => c.TicketId == ticketId);
                    if (!belongs) return Forbid("You cannot view comments of other tickets");
                }

                var data = await _commentService.GetCommentsByTicketAsync(ticketId);
                return Ok(new { status = 200, message = "Comments fetched successfully", data });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = "Error fetching comments", error = ex.Message });
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetCommentsByUser(int userId)
        {
            try
            {
                var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                var currentRole = User.FindFirst(ClaimTypes.Role)!.Value;

                if (currentRole == "Customer" && currentUserId != userId)
                    return Forbid("You cannot view other users' comments");

                var comments = await _commentService.GetCommentsByUserAsync(userId);
                return Ok(new { status = 200, message = "Comments fetched successfully", data = comments });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = "Error fetching comments", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddComment([FromBody] CommentCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { status = 400, message = "Invalid comment data" });

            try
            {
                var result = await _commentService.AddCommentAsync(dto);
                return StatusCode(201, new { status = 201, message = "Comment added successfully", data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = "Error adding comment", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateComment(int id, [FromBody] CommentUpdateDto dto)
        {
            try
            {
                await _commentService.UpdateCommentAsync(id, dto);
                return Ok(new { status = 200, message = "Comment updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = "Error updating comment", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            try
            {
                await _commentService.DeleteCommentAsync(id);
                return Ok(new { status = 200, message = "Comment deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = "Error deleting comment", error = ex.Message });
            }
        }
    }
}
