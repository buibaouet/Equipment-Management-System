namespace Equipment.Domain.Models.EquipmentModel;

public class EquipmentResponseModel
{
    public bool IsSuccess { get; set; }
    public string CodeError { get; set; } = string.Empty;
    public string NameError { get; set; } = string.Empty;
    public string CategoryIdError { get; set; } = string.Empty;
    public string DepartmentIdError { get; set; } = string.Empty;
    public string PriceError { get; set; } = string.Empty;
}