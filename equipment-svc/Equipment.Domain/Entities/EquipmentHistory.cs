using Equipment.Domain.Constant;

namespace Equipment.Domain.Entities;

public class EquipmentHistory : BaseEntity
{
    public int EquipmentId { get; set; }
    public Enumerations.EquipmentHistoryAction Action { get; set; }
    public string? Description { get; set; }
    public string? ChangesJson { get; set; }
    public int? ActorUserId { get; set; }
    public string? ActorUserName { get; set; }
}

