using Equipment.Domain.Constant;
using Equipment.Domain.Models;
using Equipment.Domain.Models.EquipmentHistoryModel;
using Equipment.Domain.Models.ReponseModel;

namespace Equipment.Service.EquipmentHistory;

public interface IEquipmentHistoryService
{
    Task LogAsync(
        int equipmentId,
        Enumerations.EquipmentHistoryAction action,
        string description,
        int? actorUserId,
        string? actorUserName,
        List<EquipmentHistoryChangeModel>? changes = null
    );

    Task<Response<List<EquipmentHistoryModel>>> GetHistoryAsync(
        int equipmentId
    );
}

