using Equipment.Domain.Entities;
using Equipment.Domain.Models;
using Equipment.Domain.Models.Department;
using Equipment.Domain.Models.ReponseModel;

namespace Equipment.Service.Department;

public interface IDepartmentService
{
    Task<Response<List<Domain.Entities.Department>>> GetAllActive();
    Task<Response<PagingDataModel<DepartmentPagingModel>>> GetPaging(PaginationParam param);
    /// <summary>
    /// Tạo mới phòng ban / Cập nhật thông tin phòng ban
    /// </summary>
    /// <ParamPaging name="department"></ParamPaging>
    /// <returns></returns>
    Task<Response<DepartmentResponseModel>> CreateOrUpdate(Domain.Entities.Department department);
    
    /// <summary>
    /// Lấy thông tin phòng ban theo Id
    /// </summary>
    /// <ParamPaging name="id"></ParamPaging>
    /// <returns></returns>
    public Task<Response<Domain.Entities.Department>> GetByIdAsync(int id);
    
    /// <summary>
    /// Cập nhật trạng thái phòng ban
    /// </summary>
    /// <ParamPaging name="id"></ParamPaging>
    /// <returns></returns>
    public Task<Response<bool>> UpdateStatusDepartment(int id);
}
