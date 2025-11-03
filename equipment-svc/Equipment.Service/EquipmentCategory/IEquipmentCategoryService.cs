using Equipment.Domain.Models.ReponseModel;
using Equipment.Domain.Models;
using Equipment.Domain.Models.Category;

namespace Equipment.Service.EquipmentCategory;

public interface IEquipmentCategoryService
{
    /// <summary>
    /// Lấy tất cả danh mục thiết bị đang hoạt động
    /// </summary>
    /// <returns></returns>
    public Task<Response<List<Domain.Entities.EquipmentCategory>>> GetAllActive();

    /// <summary>
    /// Lấy danh sách danh mục thiết bị phân trang
    /// </summary>
    /// <param name="param"></param>
    /// <returns></returns>
    Task<Response<PagingDataModel<CategoryPagingModel>>> GetPaging(PaginationParam param);

    /// <summary>
    /// Tạo mới danh mục thiết bị / Cập nhật thông tin danh mục thiết bị
    /// </summary>
    /// <param name="category"></param>
    /// <returns></returns>
    Task<Response<CategoryResponseModel>> CreateOrUpdate(Domain.Entities.EquipmentCategory category);
    
    /// <summary>
    /// Lấy thông tin danh mục thiết bị theo Id
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    public Task<Response<Domain.Entities.EquipmentCategory>> GetByIdAsync(int id);
    
    /// <summary>
    /// Cập nhật trạng thái danh mục thiết bị
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    public Task<Response<bool>> UpdateStatusCategory(int id);
}