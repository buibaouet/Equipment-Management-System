using Equipment.Domain.Extensions;

namespace Equipment.Domain.Entities;

public class EquipmentCategory : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}
