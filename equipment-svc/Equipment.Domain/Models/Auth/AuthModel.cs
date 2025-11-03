namespace Equipment.Domain.Models.Auth;

public class ChangePasswordInputModel
{
    public int UserId { get; set; }
    public string OldPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}

public class ChangePasswordResponseModel
{
    public bool IsSuccess { get; set; }
    public string OldPasswordError { get; set; } = string.Empty;
    public string NewPasswordError { get; set; } = string.Empty;
}

public class RegisterResponseModel
{
    public bool IsSuccess { get; set; }
    public string PasswordError { get; set; } = string.Empty;
    public string EmailError { get; set; } = string.Empty;
    public string UsernameError { get; set; } = string.Empty;
}