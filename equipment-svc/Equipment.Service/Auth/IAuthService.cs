using Equipment.Domain.Models.ReponseModel;
using Equipment.Domain.Models.User;

namespace Equipment.Service.Auth;

public interface IAuthService
{
    Task<Response<LoginResponseModel>> HandleLogin(LoginModel model);
}