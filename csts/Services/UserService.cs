using csts.DTOs;
using csts.Models;
using csts.Repositories.Interfaces;

namespace csts.Services
{
    public class UserService
    {
        private readonly IUserRepository _userRepo;

        public UserService(IUserRepository userRepo)
        {
            _userRepo = userRepo;
        }

        private static UserResponseDto ToUserResponse(User u) => new()
        {
            UserId = u.UserId,
            Name = u.Name,
            Email = u.Email,
            Role = u.Role.ToString(),
            IsActive = u.IsActive
        };

        public async Task<IEnumerable<UserResponseDto>> GetAllUsersAsync()
        {
            var users = await _userRepo.GetActiveUserAsync();
            return users.Select(ToUserResponse);
        }

        public async Task<UserResponseDto?> GetUserByIdAsync(int id)
        {
            var user = await _userRepo.GetByIdAsync(id);
            if (user == null || user.IsDeleted) return null;

            return ToUserResponse(user);
        }

        public async Task UpdateUserStatusAsync(int id, bool isActive)
        {
            var user = await _userRepo.GetByIdAsync(id);
            if (user == null || user.IsDeleted) return;

            user.IsActive = isActive;
            await _userRepo.UpdateAsync(user);
            await _userRepo.SaveChangesAsync();
        }

        public async Task DeleteUserAsync(int id)
        {
            await _userRepo.DeleteAsync(id);
            await _userRepo.SaveChangesAsync();
        }
    }
}
