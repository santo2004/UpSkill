using Microsoft.AspNetCore.Mvc;
using csts.Services;
using csts.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace csts.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;

        public UsersController(UserService userService)
        {
            _userService = userService;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _userService.GetAllUsersAsync();
                return Ok(new { status = 200, message = "Users fetched successfully", data = users });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = "Error fetching users", error = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);
                if (user == null)
                    return NotFound(new { status = 404, message = "User not found" });

                return Ok(new { status = 200, message = "User fetched successfully", data = user });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = "Error fetching user", error = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateUserStatus(int id, [FromBody] bool isActive)
        {
            try
            {
                await _userService.UpdateUserStatusAsync(id, isActive);
                return Ok(new { status = 200, message = "User status updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = "Error updating user status", error = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                await _userService.DeleteUserAsync(id);
                return Ok(new { status = 200, message = "User deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = "Error deleting user", error = ex.Message });
            }
        }
    }
}
