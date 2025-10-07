using Equipment.Domain.Constant;

namespace Equipment.Domain.Models;

public class EquipmentPagingParam : PaginationParam
{
    public Enumerations.EquipmentStatus? Status { get; set; }
    public int? DepartmentId { get; set; }
    public int? CategoryId { get; set; }
}