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

    /// <summary>
    /// Ngày nhập
    /// </summary>
    public DateTime? ImportDate { get; set; }

    /// <summary>
    /// Giá tiền
    /// </summary>
    public decimal Price { get; set; }

    /// <summary>
    /// Xuất xứ
    /// </summary>
    public string? OriginOfGoods { get; set; }

    /// <summary>
    /// Hãng sản xuất
    /// </summary>
    public string? Manufacturer { get; set; }

    /// <summary>
    /// Mô tả
    /// </summary>
    public string? Description { get; set; }
    public Enumerations.EquipmentStatus Status { get; set; }

    // Foreign keys and navigation properties
    public int CategoryId { get; set; }
    public int DepartmentId { get; set; }
    public int? OwnerId { get; set; }
}
