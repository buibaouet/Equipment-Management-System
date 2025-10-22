namespace Equipment.Domain.Models.User;

public class LoginModel
{
    public string UserName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginResponseModel
{
    public bool Success { get; set; }
    public UserResponseModel User { get; set; } = new UserResponseModel();
    public string Message { get; set; } = string.Empty;
}