using Equipment.Domain.Extensions;
using Equipment.Domain.IRepositories;
using Equipment.Domain.Models.ReponseModel;
using Equipment.Domain.Models.User;

namespace Equipment.Service.Auth;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IDepartmentRepository _departmentRepository;

    public AuthService(IUserRepository userRepository, IDepartmentRepository departmentRepository)
    {
        _userRepository = userRepository;
        _departmentRepository = departmentRepository;
    }

    public async Task<Response<LoginResponseModel>> HandleLogin(LoginModel model)
    {
        if (string.IsNullOrEmpty(model.UserName) || string.IsNullOrEmpty(model.Password))
        {
            return new Response<LoginResponseModel>(
                new LoginResponseModel()
                {
                    Message = "Vui long cung cấp đầy đủ thông tin đăng nhập.",
                    Success = false,
                }
            );
        }

        var user = await _userRepository.GetAsync(x => x.UserName == model.UserName);

        if (user == null || !BcryptHasher.ValidatePassword(model.Password, user.Password))
        {
            return new Response<LoginResponseModel>(
                new LoginResponseModel()
                {
                    Message = "Tên đăng nhập hoặc mật khẩu không đúng.",
                    Success = false,
                }
            );
        }

        var entity = MapToResponseModel(user);

        return new Response<LoginResponseModel>(
            new LoginResponseModel()
            {
                Success = true,
                User = entity,
                Message = "Đăng nhập thành công.",
            }
        );
    }

    private static UserResponseModel MapToResponseModel(Domain.Entities.User user)
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
            DepartmentName = user.Department.Name,
            UserName = user.UserName,
        };
    }
}
