using Equipment.Domain.Models.Auth;
using Equipment.Domain.Models.ReponseModel;
using Equipment.Domain.Models.User;

namespace Equipment.Service.Auth;

public interface IAuthService
{
    Task<Response<LoginResponseModel>> HandleLogin(LoginModel model);
    Task<Response<string>> RefreshToken(RefreshTokenModel model);
    Task<Response<RegisterResponseModel>> CreateUserAsync(CreateUserModel model);
    Task<Response<ChangePasswordResponseModel>> ChangePasswordAsync(ChangePasswordInputModel model);
    Task<Response<string>> ForgotPasswordAsync(ForgotPasswordRequestModel model);
    Task<Response<ResetPasswordResponseModel>> ResetPasswordWithOtpAsync(ResetPasswordWithOtpModel model);
}