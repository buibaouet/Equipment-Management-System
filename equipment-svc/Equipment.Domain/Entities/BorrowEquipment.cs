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
    /// Lý do từ chối (nếu có)
    /// </summary>
    public string? RejectionReason { get; set; }
}

