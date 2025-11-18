using Equipment.Domain.Constant;

namespace Equipment.Domain.Entities;

public class BorrowEquipment : BaseEntity
{
    /// <summary>
    /// Thiết bị được yêu cầu mượn
    /// </summary>
    public int EquipmentId { get; set; }

    /// <summary>
    /// Người yêu cầu mượn
    /// </summary>
    public int RequestedByUserId { get; set; }

    /// <summary>
    /// Ngày bắt đầu mượn
    /// </summary>
    public DateTime FromDate { get; set; }

    /// <summary>
    /// Ngày kết thúc mượn
    /// </summary>
    public DateTime ToDate { get; set; }

    /// <summary>
    /// Trạng thái yêu cầu
    /// </summary>
    public Enumerations.BorrowEquipmentStatus Status { get; set; }

    /// <summary>
    /// Người duyệt/từ chối yêu cầu
    /// </summary>
    public int? ApprovedByUserId { get; set; }

    /// <summary>
    /// Ngày duyệt/từ chối
    /// </summary>
    public DateTime? ApprovedDate { get; set; }

    /// <summary>
    /// Trạng thái thiết bị sau khi trả
    /// </summary>
    public Enumerations.EquipmentStatus? StatusAfterReturn { get; set; }

    /// <summary>
    /// Ngay trả thiết bị
    /// </summary>
    public DateTime? ReturnedDate { get; set; }
    
    /// <summary>
    /// Hình thức xử lý khi trả thiết bị
    /// </summary>
    public Enumerations.ReturnEquipmentProcessing? ProcessingForm { get; set; }

    /// <summary>
    /// Ghi chú hình thức xử lý khi trả thiết bị (nếu có)
    /// </summary>
    public string? ProcessingNote { get; set; }
}

