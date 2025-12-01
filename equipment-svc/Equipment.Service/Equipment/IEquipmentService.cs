using Equipment.Domain.Models;
using Equipment.Domain.Models.EquipmentHistoryModel;
using Equipment.Domain.Models.EquipmentModel;
using Equipment.Domain.Models.ReponseModel;

namespace Equipment.Service.Equipment;

public interface IEquipmentService
{
    Task<Response<Domain.Entities.Equipment>> GetById(int id);
    Task<Response<PagingDataModel<EquipmentPagingModel>>> GetPaging(EquipmentPagingParam param);
    Task<Response<PagingDataModel<MyEquipmentPagingModel>>> GetPagingMyEquipment(PaginationParam param, int userId);
    Task<Response<EquipmentResponseModel>> CreateOrUpdateEquipment(
        Domain.Entities.Equipment equipment,
        int currentUserId
    );
    Task<Response<List<EquipmentModel>>> GetListEquipmentAvaiable(int userId);
    Task<Response<List<EquipmentHistoryModel>>> GetHistory(int equipmentId);
    Task<Response<bool>> DeleteEquipment(int id);
}
