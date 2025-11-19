namespace Equipment.Domain.Constant;

public class Enumerations
{
    public enum Role : int
    {
        Admin = 1,
        Manager = 2,
        User = 3,
    }
    
    public enum EquipmentStatus
    {
        Available = 1, // Còn sử dụng
        Borrowed = 2, // Đang mượn
        Maintenance = 3, // Đang bảo dưỡng
        Lost = 4, // Đã mất
        BrokenPart = 5, // Hỏng một phần
        Broken = 6, // Đã hỏng
    }
    
    public enum BorrowEquipmentStatus
    {
        Pendding = 0, // Chờ duyệt
        Borrowed = 1, // Đang mượn
        Rejected = 2, // Từ chối
        Returned = 3, // Đã trả
    }
    
    public enum ReturnEquipmentProcessing
    {
        Repair = 1, // Sửa chữa
        BuyNew = 2, // Mua mới
        Compensation = 3, // Bồi thường
    }

    public enum EquipmentHistoryAction
    {
        Created = 1,
        Updated = 2,
        BorrowRequested = 3,
        BorrowApproved = 4,
        BorrowRejected = 5,
        Returned = 6,
    }
}
