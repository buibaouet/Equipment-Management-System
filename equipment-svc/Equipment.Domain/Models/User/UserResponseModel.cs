using Equipment.Domain.Constant;

namespace Equipment.Domain.Models.User;

public class UserResponseModel
{
    public int Id { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime? BirthDate { get; set; }
    public string Email { get; set; } = string.Empty;
    public Enumerations.Role Role { get; set; }
    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; } = string.Empty;
}
