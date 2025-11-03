namespace Equipment.Domain.Entities;

public class Department : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int? ManagerId { get; set; }
    public bool IsActive { get; set; } = true;
}
