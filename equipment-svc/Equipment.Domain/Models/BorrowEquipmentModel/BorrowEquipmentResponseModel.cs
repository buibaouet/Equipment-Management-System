namespace Equipment.Domain.Models.BorrowEquipmentModel;

public class BorrowEquipmentResponseModel
{
    public bool IsSuccess { get; set; }
    public string EquipmentIdError { get; set; } = string.Empty;
    public string FromDateError { get; set; } = string.Empty;
    public string ToDateError { get; set; } = string.Empty;
}


