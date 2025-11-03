using Equipment.Domain.Entities;

namespace Equipment.Domain.Models.Department;

public class DepartmentPagingModel : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int QuantityEquipment { get; set; }
    public int QuantityUser { get; set; }

    public int? ManagerId { get; set; }

    public string? ManagerName { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}
