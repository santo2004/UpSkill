using Microsoft.AspNetCore.Mvc;
using csts.Services;
using csts.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using csts.Repositories.Interfaces;
using csts.DTOs;

namespace csts.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TicketController : ControllerBase
    {
        private readonly TicketService _ticketService;
        private readonly ITicketRepository _ticketRepo; 

        public TicketController(TicketService ticketService, ITicketRepository ticketRepo)
        {
            _ticketService = ticketService;
            _ticketRepo = ticketRepo;
        }

        [Authorize(Roles = "Admin,Agent")]
        [HttpGet]
        public async Task<IActionResult> GetAllTickets()
        {
            try
            {
                var tickets = await _ticketService.GetAllTicketsAsync();
                return Ok(new { status = 200, message = "Tickets fetched successfully", data = tickets });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = "Error fetching tickets", error = ex.Message });
            }
        }

        [Authorize(Roles = "Admin,Agent,Customer")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTicketById(int id)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                var userRole = User.FindFirst(ClaimTypes.Role)!.Value;

                var ticketEntity = await _ticketRepo.GetByIdAsync(id);
                if (ticketEntity == null)
                    return NotFound(new { status = 404, message = "Ticket not found" });

                if (userRole == "Customer" && ticketEntity.CreatedBy != userId)
                    return Forbid("You cannot view other users' tickets");

                var ticket = await _ticketService.GetTicketByIdAsync(id);
                return Ok(new { status = 200, message = "Ticket fetched successfully", data = ticket });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = "Error fetching ticket", error = ex.Message });
            }
        }

        [Authorize(Roles = "Admin,Agent,Customer")]
        [HttpPost]
        public async Task<IActionResult> CreateTicket([FromBody] TicketCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { status = 400, message = "Invalid ticket data" });

            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                dto.CreatedBy = userId;

                var ticketId = await _ticketService.AddTicketAsync(dto);
                return StatusCode(201, new { status = 201, message = "Ticket created successfully", ticketId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = "Error creating ticket", error = ex.Message });
            }
        }

        [Authorize(Roles = "Admin,Agent")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTicket(int id, [FromBody] TicketUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { status = 400, message = "Invalid data" });

            try
            {
                await _ticketService.UpdateTicketAsync(id, dto);
                return Ok(new { status = 200, message = "Ticket updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = "Error updating ticket", error = ex.Message });
            }
        }

        [Authorize(Roles = "Admin,Agent")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            try
            {
                await _ticketService.DeleteTicketAsync(id);
                return Ok(new { status = 200, message = "Ticket deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = "Error deleting ticket", error = ex.Message });
            }
        }

        [Authorize(Roles = "Admin,Agent")]
        [HttpGet("filter")]
        public async Task<IActionResult> FilterTickets([FromQuery] string? status, [FromQuery] string? priority)
        {
            try
            {
                TicketStatus? parsedStatus = null;
                TicketPriority? parsedPriority = null;

                if (Enum.TryParse(status, true, out TicketStatus st))
                    parsedStatus = st;
                if (Enum.TryParse(priority, true, out TicketPriority pr))
                    parsedPriority = pr;

                var tickets = await _ticketService.FilterTicketsAsync(parsedStatus, parsedPriority);
                return Ok(new { status = 200, message = "Tickets filtered successfully", data = tickets });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = "Error filtering tickets", error = ex.Message });
            }
        }

        [Authorize(Roles = "Admin,Agent,Customer")]
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetTicketsByUser(int userId)
        {
            try
            {
                var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                var currentRole = User.FindFirst(ClaimTypes.Role)!.Value;

                if (currentRole == "Customer" && currentUserId != userId)
                    return Forbid("You cannot view other users' tickets");

                var tickets = await _ticketService.GetTicketsByUserAsync(userId);
                return Ok(new { status = 200, message = "Tickets fetched successfully", data = tickets });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = "Error fetching user's tickets", error = ex.Message });
            }
        }
    }
}
