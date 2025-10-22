using Equipment.Domain.Constant;
using Equipment.Domain.Extensions;
using Equipment.Domain.IRepositories;
using Equipment.Domain.Models.ReponseModel;
using Equipment.Domain.Models.User;
using Microsoft.EntityFrameworkCore;

namespace Equipment.Service.User;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IDepartmentRepository _departmentRepository;

    public UserService(IUserRepository userRepository, IDepartmentRepository departmentRepository)
    {
        _userRepository = userRepository;
        _departmentRepository = departmentRepository;
    }

    public async Task<Response<UserResponseModel>> CreateUserAsync(CreateUserModel model)
    {
        var user = new Domain.Entities.User
        {
            FirstName = model.FirstName,
            LastName = model.LastName,
            Password = BcryptHasher.HashPassword(model.Password),
            BirthDate = model.BirthDate,
            Email = model.Email,
            IsActive = true
        };

        await _userRepository.CreateAsync(user);

        var entity = MapToResponseModel(user, string.Empty);

        return new Response<UserResponseModel>(entity);
    }

    public async Task<Response<UserResponseModel>> UpdateUserAsync(int id, UpdateUserModel model)
    {
        var user = await _userRepository.GetByIdAsync(id)
            ?? throw new ArgumentException("User not found");

        var department = await _departmentRepository.GetByIdAsync(model.DepartmentId)
            ?? throw new ArgumentException("Department not found");

        user.FirstName = model.FirstName;
        user.LastName = model.LastName;
        user.BirthDate = model.BirthDate;
        user.Email = model.Email;
        user.DepartmentId = model.DepartmentId;

        user = await _userRepository.UpdateAsync(user);

        var entity = MapToResponseModel(user, department.Name);

        return new Response<UserResponseModel>(entity);
    }

    public async Task<Response<UserResponseModel>> UpdateUserRoleAsync(int id, Enumerations.Role role)
    {
        var user = await _userRepository.GetByIdAsync(id)
            ?? throw new ArgumentException("User not found");

        user.Role = role;
        user = await _userRepository.UpdateAsync(user);

        var department = await _departmentRepository.GetByIdAsync(user.DepartmentId);
        var entity = MapToResponseModel(user, department?.Name ?? string.Empty);

        return new Response<UserResponseModel>(entity);
    }

    public async Task<Response<bool>> DeleteUserAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id)
            ?? throw new ArgumentException("User not found");

        user.IsActive = false;
        await _userRepository.UpdateAsync(user);
        
        return new Response<bool>(true);
    }

    public async Task<Response<UserResponseModel>> GetUserByIdAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id)
                   ?? throw new ArgumentException("User not found");

        var department = await _departmentRepository.GetByIdAsync(user.DepartmentId);
        var entity = MapToResponseModel(user, department?.Name ?? string.Empty);

        return new Response<UserResponseModel>(entity);
    }

    public async Task<Response<List<UserResponseModel>>> GetAllUsersAsync()
    {
        var users = await _userRepository.GetListAsync(u => u.IsActive)
            .Include(u => u.Department)
            .ToListAsync();

        var entities = users.Select(u => MapToResponseModel(u, u.Department.Name)).ToList();
        return new Response<List<UserResponseModel>>(entities);
    }

    private static UserResponseModel MapToResponseModel(Domain.Entities.User user, string departmentName)
    {
        return new UserResponseModel
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            BirthDate = user.BirthDate,
            Email = user.Email,
            Role = user.Role,
            DepartmentId = user.DepartmentId,
            DepartmentName = departmentName,
        };
    }
}
