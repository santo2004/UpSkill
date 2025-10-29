using Microsoft.AspNetCore.Mvc;
using csts.Services;
using csts.DTOs;
using csts.Models;
using Microsoft.AspNetCore.Authorization;

namespace csts.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TicketController : ControllerBase
    {
        private readonly TicketService _ticketService;

        public TicketController(TicketService ticketService)
        {
            _ticketService = ticketService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTickets()
        {
            var tickets = await _ticketService.GetAllTicketsAsync();
            return Ok(tickets);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTicketById(int id)
        {
            var ticket = await _ticketService.GetTicketByIdAsync(id);
            if (ticket == null) return NotFound("Ticket not found");
            return Ok(ticket);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTicket([FromBody] TicketCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var ticketId = await _ticketService.AddTicketAsync(dto);
                var created = await _ticketService.GetTicketByIdAsync(ticketId);
                return CreatedAtAction(nameof(GetTicketById), new { id = ticketId }, created);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTicket(int id, [FromBody] TicketUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _ticketService.UpdateTicketAsync(id, dto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            await _ticketService.DeleteTicketAsync(id);
            return NoContent();
        }

        [HttpGet("filter")]
        public async Task<IActionResult> FilterTickets([FromQuery] string? status, [FromQuery] string? priority)
        {
            TicketStatus? parsedStatus = null;
            TicketPriority? parsedPriority = null;

            if (Enum.TryParse(status, true, out TicketStatus st))
                parsedStatus = st;

            if (Enum.TryParse(priority, true, out TicketPriority pr))
                parsedPriority = pr;

            var tickets = await _ticketService.FilterTicketsAsync(parsedStatus, parsedPriority);
            return Ok(tickets);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetTicketsByUser(int userId)
        {
            var tickets = await _ticketService.GetTicketsByUserAsync(userId);
            return Ok(tickets);
        }
    }
}
