using Equipment.Domain.Constant;
using Equipment.Domain.Entities;

namespace Equipment.Domain.Models.BorrowEquipmentModel;

public class BorrowEquipmentPagingModel : BaseEntity
{
    public int EquipmentId { get; set; }
    public string EquipmentCode { get; set; } = string.Empty;
    public string EquipmentName { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public Enumerations.BorrowEquipmentStatus Status { get; set; }
}

