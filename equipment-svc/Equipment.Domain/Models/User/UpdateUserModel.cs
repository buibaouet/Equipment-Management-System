using Equipment.Domain.Constant;

namespace Equipment.Domain.Models.User;

public class UpdateUserModel
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime? BirthDate { get; set; }
    public string Email { get; set; } = string.Empty;
    public Enumerations.Role Role { get; set; }
    public int DepartmentId { get; set; }
}
