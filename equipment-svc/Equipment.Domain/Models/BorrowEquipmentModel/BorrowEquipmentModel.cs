using Equipment.Domain.Constant;

namespace Equipment.Domain.Models.BorrowEquipmentModel;

public class ReturnEquipmentModel
{
    public int Id { get; set; }
    public Enumerations.EquipmentStatus Status { get; set; }
    
    public Enumerations.ReturnEquipmentProcessing? ProcessingForm { get; set; }
    public string? ProcessingNote { get; set; }
}

public class BorrowEquipmentDataModel
{
    public int Id { get; set; }
    public int EquipmentId { get; set; }
    public string EquipmentCode { get; set; } = string.Empty;
    public string EquipmentName { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public int BorrowerId { get; set; }
    public string BorrowerName { get; set; } = string.Empty;
    public int? ApprovedByUserId { get; set; }
    public string? ApprovedByName { get; set; }
    public DateTime? ApprovedDate { get; set; }
    public DateTime? ReturnedDate { get; set; }
    public Enumerations.BorrowEquipmentStatus? Status { get; set; }
    public Enumerations.EquipmentStatus? StatusAfterReturn { get; set; }
    public Enumerations.ReturnEquipmentProcessing? ProcessingForm { get; set; }
    public string? ProcessingNote { get; set; }
}