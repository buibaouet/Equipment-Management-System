using Equipment.Domain.Constant;

namespace Equipment.Domain.Models;

public class EquipmentPagingParam
{
    public PaginationParam ParamPaging { get; set; }
    public Enumerations.EquipmentStatus? Status { get; set; }
    public int? DepartmentId { get; set; }
    public int? CategoryId { get; set; }
}