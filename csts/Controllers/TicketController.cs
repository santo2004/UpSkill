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
        private readonly IUserRepository _userRepo;

        public TicketController(TicketService ticketService, ITicketRepository ticketRepo, IUserRepository userRepo)
        {
            _ticketService = ticketService;
            _ticketRepo = ticketRepo;
            _userRepo = userRepo;
        }

        // Admin & Agent can list all tickets
        [Authorize(Roles = "Admin,Agent,Customer")]
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

        // Everyone (Admin,Agent,Customer) can view an individual ticket, but customers only their own ticket
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

        // Create ticket — any authenticated user (Admin,Agent,Customer)
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

                // return the created ticket as response data (helpful to frontend)
                var createdTicket = await _ticketService.GetTicketByIdAsync(ticketId);

                return StatusCode(201, new { status = 201, message = "Ticket created successfully", data = createdTicket });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = "Error creating ticket", error = ex.Message });
            }
        }

        // Update ticket: Admin & Agent can update everything.
        // Customer allowed but restricted — they can only set Status = Closed on their own tickets.
        [Authorize(Roles = "Admin,Agent,Customer")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTicket(int id, [FromBody] TicketUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { status = 400, message = "Invalid data" });

            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                var userRole = User.FindFirst(ClaimTypes.Role)!.Value;

                var ticketEntity = await _ticketRepo.GetByIdAsync(id);
                if (ticketEntity == null)
                    return NotFound(new { status = 404, message = "Ticket not found" });

                // If requester is a Customer, ensure they own the ticket and only update status to Closed
                if (userRole == "Customer")
                {
                    if (ticketEntity.CreatedBy != userId)
                        return Forbid("Customers can only modify their own tickets");

                    // customers allowed only to change status to Closed
                    if (dto.Status != TicketStatus.Closed)
                        return BadRequest(new { status = 400, message = "Customers can only close tickets" });

                    // construct minimal update DTO
                    var minimalDto = new TicketUpdateDto
                    {
                        Title = ticketEntity.Title,
                        Description = ticketEntity.Description,
                        Priority = ticketEntity.Priority,
                        Status = dto.Status,
                        AssignedTo = ticketEntity.AssignedTo
                    };

                    await _ticketService.UpdateTicketAsync(id, minimalDto);
                    return Ok(new { status = 200, message = "Ticket status updated to Closed" });
                }

                // Admin/Agent -> full update
                await _ticketService.UpdateTicketAsync(id, dto);
                return Ok(new { status = 200, message = "Ticket updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = "Error updating ticket", error = ex.Message });
            }
        }

        // Delete ticket -> Admin only
        [Authorize(Roles = "Admin")]
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

        // Filter (Admin/Agent)
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

        // Tickets by user - Admin/Agent/Customer, but customers only their own
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

        // PUT: api/tickets/{id}/assign  (Admin only)
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/assign")]
        public async Task<IActionResult> AssignTicket(int id, [FromBody] AssignTicketDto dto)
        {
            try
            {
                if (!await _ticketRepo.ExistsAsync(id))
                    return NotFound(new { status = 404, message = "Ticket not found" });

                if (!await _userRepo.ExistsAsync(dto.AgentId))
                    return BadRequest(new { status = 400, message = "Agent not found" });

                var agent = await _userRepo.GetByIdAsync(dto.AgentId);
                if (agent == null)
                    return BadRequest(new { status = 400, message = "Agent not found" });

                // ensure the agent actually has Role == Agent (depending on your enum/model)
                if (agent.Role.ToString() != "Agent")
                    return BadRequest(new { status = 400, message = "Provided user is not an agent" });

                var updateDto = new TicketUpdateDto
                {
                    Title = (await _ticketRepo.GetByIdAsync(id))!.Title,
                    Description = (await _ticketRepo.GetByIdAsync(id))!.Description,
                    Priority = (await _ticketRepo.GetByIdAsync(id))!.Priority,
                    Status = TicketStatus.Assigned,
                    AssignedTo = dto.AgentId
                };

                await _ticketService.UpdateTicketAsync(id, updateDto);

                return Ok(new { status = 200, message = $"Ticket #{id} assigned to agent {agent.Name}" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = "Error assigning ticket", error = ex.Message });
            }
        }

        public class AssignTicketDto
        {
            public int AgentId { get; set; }
        }
    }
}
