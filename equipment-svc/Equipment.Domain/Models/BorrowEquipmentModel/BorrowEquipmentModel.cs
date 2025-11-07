using Equipment.Domain.Constant;

namespace Equipment.Domain.Models.BorrowEquipmentModel;

public class ReturnEquipmentModel
{
    public int Id { get; set; }
    public Enumerations.EquipmentStatus Status { get; set; }
}