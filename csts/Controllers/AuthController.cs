using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using csts.Repositories.Interfaces;
using csts.DTOs;
using csts.Models;
using Microsoft.AspNetCore.Authorization;

namespace csts.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepo;
        private readonly IConfiguration _config;

        public AuthController(IUserRepository userRepo, IConfiguration config)
        {
            _userRepo = userRepo;
            _config = config;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { status = 400, message = "Invalid registration data" });

            try
            {
                if (await _userRepo.EmailExistsAsync(dto.Email))
                    return Conflict(new { status = 409, message = "Email already registered" });

                var user = new User
                {
                    Name = dto.Name.Trim(),
                    Email = dto.Email.Trim(),
                    PasswordHash = dto.Password, 
                    Role = dto.Role,
                    IsActive = true
                };

                await _userRepo.AddAsync(user);
                await _userRepo.SaveChangesAsync();

                return StatusCode(201, new
                {
                    status = 201,
                    message = "User registered successfully",
                    data = new { user.UserId, user.Name, user.Email, user.Role }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = "Error during registration", error = ex.Message });
            }
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            try
            {
                var user = await _userRepo.GetByEmailAsync(dto.Email);
                if (user == null || user.PasswordHash != dto.Password)
                    return Unauthorized(new { status = 401, message = "Invalid email or password" });

                if (!user.IsActive)
                    return Forbid("User account inactive");

                var claims = new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role.ToString())
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: _config["Jwt:Issuer"],
                    audience: _config["Jwt:Audience"],
                    claims: claims,
                    expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(_config["Jwt:ExpireMinutes"])),
                    signingCredentials: creds
                );

                return Ok(new
                {
                    status = 200,
                    message = "Login successful",
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expires = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_config["Jwt:ExpireMinutes"]))
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = "Error during login", error = ex.Message });
            }
        }
    }
}
