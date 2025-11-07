using Equipment.Domain.Constant;
using Equipment.Domain.Entities;

namespace Equipment.Domain.Models.EquipmentModel;

public class EquipmentPagingModel : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; } = string.Empty;
    public int? OwnerId { get; set; }
    public string? OwnerName { get; set; } = string.Empty;
    public Enumerations.EquipmentStatus Status { get; set; }
}

public class MyEquipmentPagingModel : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; } = string.Empty;
    public int? OwnerId { get; set; }
    public string? OwnerName { get; set; } = string.Empty;
    public Enumerations.EquipmentStatus Status { get; set; }
    public bool IsBorrow { get; set; }
    public int RemainingDays { get; set; }
}