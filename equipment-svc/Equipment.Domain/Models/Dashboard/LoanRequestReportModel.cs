using Equipment.Domain.Constant;

namespace Equipment.Domain.Models.Dashboard;

public class LoanRequestReportModel
{
    public int Id { get; set; }
    public string EquipmentCode { get; set; } = string.Empty;
    public string EquipmentName { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public string OwnerName { get; set; } = string.Empty;
    public string BorrowerName { get; set; } = string.Empty;
    public DateTime? ApprovedDate { get; set; }
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public DateTime? ReturnedDate { get; set; }
    public Enumerations.BorrowEquipmentStatus Status { get; set; }
}


