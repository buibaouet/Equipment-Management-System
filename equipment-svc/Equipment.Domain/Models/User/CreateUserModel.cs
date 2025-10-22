using Equipment.Domain.Constant;

namespace Equipment.Domain.Models.User;

public class CreateUserModel
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public DateTime? BirthDate { get; set; }
    public string Email { get; set; } = string.Empty;
}
