using Equipment.Domain.Models.ReponseModel;

namespace Equipment.Service.EquipmentCategory;

public interface IEquipmentCategoryService
{
    /// <summary>
    /// Lấy tất cả danh mục thiết bị đang hoạt động
    /// </summary>
    /// <returns></returns>
    public Task<Response<List<Domain.Entities.EquipmentCategory>>> GetAllActive();
}