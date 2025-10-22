using Equipment.Domain.Constant;
using Equipment.Domain.Models.ReponseModel;
using Equipment.Domain.Models.User;

namespace Equipment.Service.User;

public interface IUserService
{
    Task<Response<UserResponseModel>> CreateUserAsync(CreateUserModel model);
    Task<Response<UserResponseModel>> UpdateUserAsync(int id, UpdateUserModel model);
    Task<Response<UserResponseModel>> UpdateUserRoleAsync(int id, Enumerations.Role role);
    Task<Response<bool>> DeleteUserAsync(int id);
    Task<Response<UserResponseModel>> GetUserByIdAsync(int id);
    Task<Response<List<UserResponseModel>>> GetAllUsersAsync();
}
