namespace Equipment.Domain.Models.Dashboard;

public class DashboardModel
{
    public int TotalEquipment { get; set; }
    public int TotalBorrow { get; set; }
    public List<EquipmentByCategoryModel> EquipmentByCategory { get; set; } = new();
    public List<EquipmentByStatusModel> EquipmentByStatus { get; set; } = new();
    public List<UserRankingTopModel> UserRankingTop { get; set; } = new();
}

public class EquipmentByCategoryModel
{
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class EquipmentByStatusModel
{
    public int Status { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class BorrowReturnChartModel
{
    public string Period { get; set; } = string.Empty;
    public int BorrowCount { get; set; }
}

public class UserRankingTopModel
{
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public int OwnedCount { get; set; }
    public int BorrowedCount { get; set; }
    public int TotalCount { get; set; }
}
