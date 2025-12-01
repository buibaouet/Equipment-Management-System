using Equipment.Domain.Constant;

namespace Equipment.Domain.Models.User;

public class CreateUserModel
{
    public string UserName { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}

public class CreateUserByAdminInput
{
    public string UserName { get; set; } = default!;
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
    public string Email { get; set; } = default!;
    public Enumerations.Role Role { get; set; }
    public int DepartmentId { get; set; }

    public string? PhoneNumber { get; set; }   // optional
    public string? Address { get; set; }       // optional
    public DateTime? BirthDate { get; set; }   // optional
    public string? Bio { get; set; }           // optional
}

public class CreateUserResponseModel
{
    public bool IsSuccess { get; set; }
    public string EmailError { get; set; } = string.Empty;
    public string UsernameError { get; set; } = string.Empty;
}