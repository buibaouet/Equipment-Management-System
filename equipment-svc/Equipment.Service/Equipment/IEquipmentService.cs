using Equipment.Domain.Entities;
using Equipment.Domain.Models;
using Equipment.Domain.Models.EquipmentModel;
using Equipment.Domain.Models.ReponseModel;

namespace Equipment.Service.Equipment;

public interface IEquipmentService
{
    Task<Response<Domain.Entities.Equipment>> GetById(int id);
    Task<Response<PagingDataModel<EquipmentPagingModel>>> GetPaging(EquipmentPagingParam param);
    Task<Response<EquipmentResponseModel>> CreateOrUpdateEquipment(Domain.Entities.Equipment equipment);
    Task<Response<List<EquipmentModel>>> GetListEquipmentAvaiable(int userId);
}
