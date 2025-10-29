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

        public async Task<int> AddUserAsync(UserCreateDto dto)
        {
            //check for duplicate users - email
            if (await _userRepo.EmailExistsAsync(dto.Email))
                throw new Exception($"User with email '{dto.Email}' already exists");

            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email.Trim(),
                PasswordHash = dto.PasswordHash,
                Role = dto.Role,
                IsActive = true
            };

            await _userRepo.AddAsync(user);
            await _userRepo.SaveChangesAsync();

            return user.UserId;
        }

        public async Task UpdateUserAsync(int id, UserUpdateDto dto)
        {
            var user = await _userRepo.GetByIdAsync(id);
            if (user == null || user.IsDeleted) return;

            // ✅ Check email uniqueness for update too
            if (await _userRepo.EmailExistsAsync(dto.Email, id))
                throw new Exception($"Email '{dto.Email}' is already used by another user");

            user.Name = dto.Name.Trim();
            user.Email = dto.Email.Trim();
            user.PasswordHash = dto.PasswordHash;
            user.Role = dto.Role;
            user.IsActive = dto.IsActive;

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
