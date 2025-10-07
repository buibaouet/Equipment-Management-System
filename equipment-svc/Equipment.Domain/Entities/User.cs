using Equipment.Domain.Constant;

namespace Equipment.Domain.Entities;

public class User : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public DateTime? BirthDate { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public Enumerations.Role Role { get; set; }

    // Department relationship
    public int DepartmentId { get; set; }
    public virtual Department Department { get; set; } = null!;
    
    public bool IsActive { get; set; } = true;
}
