using System.ComponentModel.DataAnnotations;
using Equipment.Domain.Constant;
using Equipment.Domain.Extensions;

namespace Equipment.Domain.Entities;

public class Equipment : BaseEntity
{
    [Searchable]
    public string Code { get; set; } = string.Empty;
    [Searchable]
    public string Name { get; set; } = string.Empty;
    public DateTime ImportDate { get; set; }
    public decimal Price { get; set; }
    public string OriginOfGoods { get; set; } = string.Empty;
    public Enumerations.EquipmentStatus Status { get; set; }

    // Foreign keys and navigation properties
    public int CategoryId { get; set; }
    public virtual EquipmentCategory Category { get; set; } = null!;

    public int DepartmentId { get; set; }
    public virtual Department Department { get; set; } = null!;

    public int? UserId { get; set; }
    public virtual User? User { get; set; }
}
