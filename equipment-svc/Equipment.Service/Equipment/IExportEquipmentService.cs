using Equipment.Domain.Models;
using Equipment.Domain.Models.EquipmentHistoryModel;
using Equipment.Domain.Models.EquipmentModel;
using Equipment.Domain.Models.ReponseModel;

namespace Equipment.Service.Equipment;

public interface IExportEquipmentService
{
    Task<byte[]> ExportEquipment();
}
