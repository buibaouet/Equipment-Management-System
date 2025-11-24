namespace Equipment.Domain.Constant;

public class Enumerations
{
    public enum Role
    {
        Admin = 1,
        Manager = 2,
        User = 3,
        Supervisor = 4,
    }
    
    public enum EquipmentStatus
    {
        Available = 1, // Sẵn sàng
        Borrowed = 2, // Đang sử dụng
        Maintenance = 3, // Bảo trì
        Liquidation = 4, // Thanh lý
        Broken = 5, // Đã hỏng
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
    
    public enum ChartPeriodType
    {
        Week = 1,
        Month = 2,
        Quarter = 3
    }
}
