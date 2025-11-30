using Equipment.Domain.Constant;
using Equipment.Domain.Extensions;

namespace Equipment.Domain.Entities;

public class User : BaseEntity
{
    [Searchable]
    public string UserName { get; set; } = string.Empty;

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    [Searchable]
    public string FullName
    {
        get { return FirstName + " " + LastName; }
        set { value = this.FirstName + " " + this.LastName; }
    }

    public string Password { get; set; } = string.Empty;
    public DateTime? BirthDate { get; set; }
    public string Email { get; set; } = string.Empty;
    public Enumerations.Role Role { get; set; }

    // Department relationship
    public int? DepartmentId { get; set; }

    public string? Bio { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; } = string.Empty;
    public string? Address { get; set; } = string.Empty;
}
