using Equipment.Domain.Constant;

namespace Equipment.Domain.Models.EquipmentHistoryModel;

public class EquipmentHistoryChangeModel
{
    public string Field { get; set; } = string.Empty;
    public string? OldValue { get; set; }
    public string? NewValue { get; set; }
}

public class EquipmentHistoryModel
{
    public int Id { get; set; }
    public int EquipmentId { get; set; }
    public Enumerations.EquipmentHistoryAction Action { get; set; }
    public string ActionName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<EquipmentHistoryChangeModel> Changes { get; set; } = new();
    public int? ActorUserId { get; set; }
    public string? ActorUserName { get; set; }
    public DateTime? CreatedDate { get; set; }
}

