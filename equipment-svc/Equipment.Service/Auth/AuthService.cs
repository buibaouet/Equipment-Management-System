using System.Text.RegularExpressions;
using Equipment.Domain.Constant;
using Equipment.Domain.Extensions;
using Equipment.Domain.IRepositories;
using Equipment.Domain.Models.Auth;
using Equipment.Domain.Models.ReponseModel;
using Equipment.Domain.Models.User;
using Microsoft.AspNetCore.Http;

namespace Equipment.Service.Auth;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IJwtService _jwtService;

    public AuthService(
        IUserRepository userRepository,
        IRefreshTokenRepository refreshTokenRepository,
        IJwtService jwtService
    )
    {
        _userRepository = userRepository;
        _refreshTokenRepository = refreshTokenRepository;
        _jwtService = jwtService;
    }

    public async Task<Response<LoginResponseModel>> HandleLogin(LoginModel model)
    {
        if (string.IsNullOrEmpty(model.UserName) || string.IsNullOrEmpty(model.Password))
        {
            return new Response<LoginResponseModel>(
                new LoginResponseModel()
                {
                    Message = "Vui lòng cung cấp đầy đủ thông tin đăng nhập.",
                    Success = false,
                }
            );
        }

        var user = await _userRepository.GetAsync(x => x.UserName == model.UserName);

        if (user == null || user.IsDelete)
        {
            return new Response<LoginResponseModel>(
                new LoginResponseModel()
                {
                    Message = "Tên đăng nhập hoặc mật khẩu không đúng.",
                    Success = false,
                }
            );
        }

        // Kiểm tra tài khoản có bị khóa không
        if (user.IsBlock)
        {
            return new Response<LoginResponseModel>(
                new LoginResponseModel()
                {
                    Message = "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.",
                    Success = false,
                }
            );
        }

        // Kiểm tra mật khẩu
        if (!BcryptHasher.ValidatePassword(model.Password, user.Password))
        {
            // Tăng số lần đăng nhập thất bại
            user.FailedLoginAttempts++;

            // Nếu đăng nhập thất bại 3 lần liên tiếp, khóa tài khoản
            if (user.FailedLoginAttempts >= 3)
            {
                user.IsBlock = true;
                await _userRepository.UpdateAsync(user);
                return new Response<LoginResponseModel>(
                    new LoginResponseModel()
                    {
                        Message = "Bạn đã nhập sai mật khẩu 3 lần. Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.",
                        Success = false,
                    }
                );
            }

            await _userRepository.UpdateAsync(user);
            return new Response<LoginResponseModel>(
                new LoginResponseModel()
                {
                    Message = "Tên đăng nhập hoặc mật khẩu không đúng.",
                    Success = false,
                }
            );
        }

        // Đăng nhập thành công - reset failed login attempts
        user.FailedLoginAttempts = 0;
        await _userRepository.UpdateAsync(user);

        // Generate JWT token
        var accessToken = _jwtService.GenerateToken(user);

        // Generate refresh token
        var refreshToken = _jwtService.GenerateRefreshToken(user.Id);
        await _refreshTokenRepository.CreateAsync(refreshToken);

        var tokens = new LoginTokenResponseModel()
        {
            UserId = user.Id,
            AccessToken = accessToken,
            RefreshToken = refreshToken.Token
        };

        return new Response<LoginResponseModel>(
            new LoginResponseModel()
            {
                Success = true,
                Data = tokens,
                Message = "Đăng nhập thành công.",
            }
        );
    }

    public async Task<Response<string>> RefreshToken(RefreshTokenModel model)
    {
        try
        {
            if (string.IsNullOrEmpty(model.RefreshToken))
            {
                return new Response<string>(
                    StatusCodes.Status400BadRequest,
                    "Refresh token is required"
                );
            }

            // Get refresh token from database
            var refreshToken = await _refreshTokenRepository.GetAsync(x =>
                x.Token == model.RefreshToken
            );
            if (refreshToken == null)
            {
                return new Response<string>(
                    StatusCodes.Status404NotFound,
                    "Invalid refresh token"
                );
            }

            // Validate refresh token
            if (refreshToken.ExpiryDate < DateTime.UtcNow)
            {
                return new Response<string>(
                    StatusCodes.Status400BadRequest,
                    "Refresh token has expired"
                );
            }

            if (refreshToken.IsRevoked)
            {
                // If a refresh token is used after being revoked, it might indicate a token theft attempt
                // In this case, revoke all refresh tokens for this user as a security measure
                await _refreshTokenRepository.RevokeAllUserTokens(refreshToken.UserId);

                return new Response<string>(
                    StatusCodes.Status400BadRequest,
                    "Refresh token has been revoked or expired"
                );
            }

            // Get user
            var user = await _userRepository.GetByIdAsync(refreshToken.UserId);
            if (user == null)
            {
                return new Response<string>(StatusCodes.Status404NotFound, "User not found");
            }

            // Generate new tokens
            var newAccessToken = _jwtService.GenerateToken(user);

            return new Response<string>(newAccessToken);
        }
        catch (Exception ex)
        {
            return new Response<string>(
                StatusCodes.Status500InternalServerError,
                $"Error refreshing token: {ex.Message}"
            );
        }
    }

    public async Task<Response<RegisterResponseModel>> CreateUserAsync(CreateUserModel model)
    {
        var passwordValidation = ValidatePassword(model.Password);
        if (!passwordValidation)
        {
            return new Response<RegisterResponseModel>(
                new RegisterResponseModel()
                {
                    IsSuccess = false,
                    PasswordError = "Mật khẩu tối thiểu 8 ký tự bao gồm chữ, số và ký tự đặc biệt",
                }
            );
        }

        if (!ValidateEmail(model.Email))
        {
            return new Response<RegisterResponseModel>(
                new RegisterResponseModel()
                {
                    IsSuccess = false,
                    EmailError = "Địa chỉ email không hợp lệ",
                }
            );
        }

        bool existsUserName = await _userRepository.ExistAsync(u => u.UserName == model.UserName);
        if (existsUserName)
        {
            return new Response<RegisterResponseModel>(
                new RegisterResponseModel()
                {
                    IsSuccess = false,
                    UsernameError = "Tên đang nhập đã tồn tại",
                }
            );
        }

        bool existsEmail = await _userRepository.ExistAsync(u => u.Email == model.Email);
        if (existsEmail)
        {
            return new Response<RegisterResponseModel>(
                new RegisterResponseModel()
                {
                    IsSuccess = false,
                    EmailError = "Địa chỉ email đã tồn tại",
                }
            );
        }

        var user = new Domain.Entities.User
        {
            UserName = model.UserName,
            FirstName = model.FirstName,
            LastName = model.LastName,
            Password = BcryptHasher.HashPassword(model.Password),
            Email = model.Email,
            Role = Enumerations.Role.User
        };

        await _userRepository.CreateAsync(user);

        return new Response<RegisterResponseModel>(
            new RegisterResponseModel() { IsSuccess = true }
        );
    }

    public async Task<Response<ChangePasswordResponseModel>> ChangePasswordAsync(
        ChangePasswordInputModel model
    )
    {
        if (string.IsNullOrEmpty(model.OldPassword) || string.IsNullOrEmpty(model.NewPassword))
        {
            return new Response<ChangePasswordResponseModel>(
                new ChangePasswordResponseModel()
                {
                    OldPasswordError = string.IsNullOrEmpty(model.OldPassword)
                        ? "Vui lòng nhập mật khẩu cũ."
                        : "",
                    NewPasswordError = string.IsNullOrEmpty(model.NewPassword)
                        ? "Vui lòng nhập mật khẩu mới."
                        : "",
                    IsSuccess = false,
                }
            );
        }

        var passwordValidation = ValidatePassword(model.NewPassword);
        if (!passwordValidation)
        {
            return new Response<ChangePasswordResponseModel>(
                new ChangePasswordResponseModel()
                {
                    NewPasswordError =
                        "Mật khẩu tối thiểu 8 ký tự bao gồm chữ, số và ký tự đặc biệt",
                    IsSuccess = false,
                }
            );
        }

        var user = await _userRepository.GetByIdAsync(model.UserId);
        if (user == null || !BcryptHasher.ValidatePassword(model.OldPassword, user.Password))
        {
            return new Response<ChangePasswordResponseModel>(
                new ChangePasswordResponseModel()
                {
                    OldPasswordError = "Mật khẩu cũ không đúng.",
                    IsSuccess = false,
                }
            );
        }

        user.Password = BcryptHasher.HashPassword(model.NewPassword);
        await _userRepository.UpdateAsync(user);

        return new Response<ChangePasswordResponseModel>(
            new ChangePasswordResponseModel() { IsSuccess = true }
        );
    }

    /// <summary>
    /// Validates password requirements:
    /// - At least 8 characters
    /// - Contains at least one letter
    /// - Contains at least one number
    /// - Contains at least one special character
    /// </summary>
    /// <ParamPaging name="password">The password to validate</ParamPaging>
    /// <returns>Validation result with success status and error message if any</returns>
    private static bool ValidatePassword(string password)
    {
        if (
            password.Length < 8
            || !Regex.IsMatch(password, @"[a-zA-Z]")
            || !Regex.IsMatch(password, @"\d")
            || !Regex.IsMatch(password, @"[!@#$%^&*(),.?""':{}|<>]")
        )
        {
            return false;
        }

        return true;
    }

    /// <summary>
    /// Validates email format using RFC 5322 standard
    /// </summary>
    /// <ParamPaging name="email">The email to validate</ParamPaging>
    /// <returns>True if email is valid, false otherwise</returns>
    private static bool ValidateEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return false;

        // This pattern follows RFC 5322 standard
        const string pattern =
            @"^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|""(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*"")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$";

        try
        {
            // Check both the pattern and length
            return Regex.IsMatch(email, pattern, RegexOptions.IgnoreCase) && email.Length <= 254;
        }
        catch (RegexMatchTimeoutException)
        {
            return false;
        }
    }
}
