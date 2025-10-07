using Equipment.Domain.Entities;
using Equipment.Domain.Models;
using Equipment.Domain.Models.ReponseModel;

namespace Equipment.Service.Equipment;

public interface IEquipmentService
{
    Task<Response<Domain.Entities.Equipment>> GetById(int id);
    Task<Response<PagingDataModel<Domain.Entities.Equipment>>> GetPaging(EquipmentPagingParam param);
    Task<Response<Domain.Entities.Equipment>> Create(Domain.Entities.Equipment equipment);
    Task<Response<Domain.Entities.Equipment>> Update(Domain.Entities.Equipment equipment);
    Task<Response<bool>> Delete(int id);
}
