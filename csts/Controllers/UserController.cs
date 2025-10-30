using Microsoft.AspNetCore.Mvc;
using csts.Services;
using csts.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace csts.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        public UserController(UserService userService)
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

        //[AllowAnonymous]
        //[HttpPost]
        //public async Task<IActionResult> CreateUser([FromBody] UserCreateDto dto)
        //{
        //    if (!ModelState.IsValid)
        //        return BadRequest(new { status = 400, message = "Invalid user data" });

        //    try
        //    {
        //        var userId = await _userService.AddUserAsync(dto);
        //        var createdUser = await _userService.GetUserByIdAsync(userId);
        //        return StatusCode(201, new { status = 201, message = "User created successfully", data = createdUser });
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new { status = 500, message = "Error creating user", error = ex.Message });
        //    }
        //}

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { status = 400, message = "Invalid data" });

            try
            {
                await _userService.UpdateUserAsync(id, dto);
                return Ok(new { status = 200, message = "User updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = "Error updating user", error = ex.Message });
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
