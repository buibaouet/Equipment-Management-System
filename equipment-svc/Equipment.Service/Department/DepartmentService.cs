using Equipment.Domain.IRepositories;
using Equipment.Domain.Models;
using Equipment.Domain.Models.Department;
using Equipment.Domain.Models.ReponseModel;
using Microsoft.AspNetCore.Http;

namespace Equipment.Service.Department;

public class DepartmentService : IDepartmentService
{
    private readonly IDepartmentRepository _departmentRepository;
    private readonly IEquipmentRepository _equipmentRepository;
    private readonly IUserRepository _userRepository;

    public DepartmentService(
        IDepartmentRepository departmentRepository,
        IEquipmentRepository equipmentRepository,
        IUserRepository userRepository
    )
    {
        _departmentRepository = departmentRepository;
        _equipmentRepository = equipmentRepository;
        _userRepository = userRepository;
    }

    public async Task<Response<List<Domain.Entities.Department>>> GetAllActive()
    {
        try
        {
            var departments = await _departmentRepository.GetAllActive();
            return new Response<List<Domain.Entities.Department>>(departments);
        }
        catch (Exception ex)
        {
            return new Response<List<Domain.Entities.Department>>(
                StatusCodes.Status500InternalServerError,
                ex.Message
            );
        }
    }

    public async Task<Response<PagingDataModel<DepartmentPagingModel>>> GetPaging(
        PaginationParam param
    )
    {
        try
        {
            var resultData = new PagingDataModel<DepartmentPagingModel>();

            var pagingData = await _departmentRepository.GetPagingAsync<Domain.Entities.Department>(
                param
            );

            foreach (var item in pagingData.Data)
            {
                var quantityEquipment = await _equipmentRepository.CountAsync(x =>
                    x.DepartmentId == item.Id
                );
                var quantityUser = await _userRepository.CountAsync(x => x.DepartmentId == item.Id);
                var manager = await _userRepository.GetByIdAsync(item.ManagerId ?? 0);
                var departmentModel = new DepartmentPagingModel
                {
                    Id = item.Id,
                    Code = item.Code,
                    Name = item.Name,
                    IsActive = item.IsActive,
                    ManagerId = item.ManagerId,
                    ManagerName = manager?.UserName + " - " + manager?.FullName,
                    QuantityEquipment = quantityEquipment,
                    QuantityUser = quantityUser,
                    CreatedDate = item.CreatedDate,
                    UpdatedDate = item.UpdatedDate,
                };
                resultData.Data.Add(departmentModel);
            }

            resultData.TotalPages = pagingData.TotalPages;
            resultData.TotalRecords = pagingData.TotalRecords;

            return new Response<PagingDataModel<DepartmentPagingModel>>(resultData);
        }
        catch (Exception ex)
        {
            return new Response<PagingDataModel<DepartmentPagingModel>>(
                StatusCodes.Status500InternalServerError,
                ex.Message
            );
        }
    }

    public async Task<Response<DepartmentResponseModel>> CreateOrUpdate(
        Domain.Entities.Department department
    )
    {
        try
        {
            // Check if department with same code exists
            var exists = await _departmentRepository.ExistAsync(x =>
                x.Code.Trim() == department.Code.Trim() && x.Id != department.Id
            );

            if (exists)
            {
                return new Response<DepartmentResponseModel>(
                    new DepartmentResponseModel()
                    {
                        IsSuccess = false,
                        CodeError = "Mã danh mục đã tồn tại",
                    }
                );
            }

            // Thêm mới
            if (department.Id == 0)
            {
                department.IsActive = true;
                await _departmentRepository.CreateAsync(department);
            }
            else // Cập nhật
            {
                var existingDepartment = await _departmentRepository.GetByIdAsync(department.Id);

                if (existingDepartment == null)
                {
                    return new Response<DepartmentResponseModel>(
                        StatusCodes.Status404NotFound,
                        "Danh mục thiết bị không tồn tại"
                    );
                }

                // Cập nhật trạng thái từ hoạt động sang ngừng hoạt động
                if (existingDepartment.IsActive && !department.IsActive)
                {
                    var quantityEquipment = await _equipmentRepository.CountAsync(x =>
                        x.DepartmentId == department.Id
                    );
                    var quantityUser = await _userRepository.CountAsync(x =>
                        x.DepartmentId == department.Id
                    );

                    if (quantityEquipment > 0 || quantityUser > 0)
                    {
                        return new Response<DepartmentResponseModel>(
                            StatusCodes.Status400BadRequest,
                            "Phòng ban đang được sử dụng, không thể ngừng hoạt động"
                        );
                    }
                }

                existingDepartment.Code = department.Code;
                existingDepartment.Name = department.Name;
                existingDepartment.Description = department.Description;
                existingDepartment.ManagerId = department.ManagerId;
                existingDepartment.IsActive = department.IsActive;

                await _departmentRepository.UpdateAsync(existingDepartment);
            }

            return new Response<DepartmentResponseModel>(
                new DepartmentResponseModel() { IsSuccess = true }
            );
        }
        catch (Exception ex)
        {
            return new Response<DepartmentResponseModel>(
                StatusCodes.Status500InternalServerError,
                $"Error creating department: {ex.Message}"
            );
        }
    }

    public async Task<Response<Domain.Entities.Department>> GetByIdAsync(int id)
    {
        try
        {
            var entity = await _departmentRepository.GetByIdAsync(id);

            return new Response<Domain.Entities.Department>(entity);
        }
        catch (Exception ex)
        {
            return new Response<Domain.Entities.Department>(
                StatusCodes.Status500InternalServerError,
                $"Error department: {ex.Message}"
            );
        }
    }

    public async Task<Response<bool>> UpdateStatusDepartment(int id)
    {
        try
        {
            var entity = await _departmentRepository.GetByIdAsync(id);

            if (entity == null)
            {
                return new Response<bool>(StatusCodes.Status404NotFound, "Phòng ban không tồn tại");
            }
            var quantityEquipment = await _equipmentRepository.CountAsync(x =>
                x.DepartmentId == entity.Id
            );
            var quantityUser = await _userRepository.CountAsync(x => x.DepartmentId == entity.Id);

            if (entity.IsActive && (quantityEquipment > 0 || quantityUser > 0))
            {
                return new Response<bool>(
                    StatusCodes.Status400BadRequest,
                    "Phòng ban đang được sử dụng, không thể ngừng hoạt động"
                );
            }

            entity.IsActive = !entity.IsActive;
            await _departmentRepository.UpdateAsync(entity);

            return new Response<bool>(true);
        }
        catch (Exception ex)
        {
            return new Response<bool>(
                StatusCodes.Status500InternalServerError,
                $"Có lỗi xảy ra khi cập nhật trạng thái phòng ban"
            );
        }
    }
}
