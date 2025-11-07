using System.Linq.Expressions;
using Equipment.Domain.Constant;
using Equipment.Domain.IRepositories;
using Equipment.Domain.Models;
using Equipment.Domain.Models.EquipmentModel;
using Equipment.Domain.Models.ReponseModel;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Equipment.Service.Equipment;

public class EquipmentService : IEquipmentService
{
    private readonly IEquipmentRepository _equipmentRepository;
    private readonly IEquipmentCategoryRepository _equipmentCategoryRepository;
    private readonly IDepartmentRepository _departmentRepository;
    private readonly IUserRepository _userRepository;

    public EquipmentService(
        IEquipmentRepository equipmentRepository,
        IEquipmentCategoryRepository equipmentCategoryRepository,
        IDepartmentRepository departmentRepository,
        IUserRepository userRepository
    )
    {
        _equipmentRepository = equipmentRepository;
        _equipmentCategoryRepository = equipmentCategoryRepository;
        _departmentRepository = departmentRepository;
        _userRepository = userRepository;
    }

    public async Task<Response<Domain.Entities.Equipment>> GetById(int id)
    {
        var entity = await _equipmentRepository.GetByIdAsync(id);

        if (entity is null)
        {
            return new Response<Domain.Entities.Equipment>(StatusCodes.Status404NotFound);
        }

        return new Response<Domain.Entities.Equipment>(entity);
    }

    public async Task<Response<PagingDataModel<EquipmentPagingModel>>> GetPaging(
        EquipmentPagingParam param
    )
    {
        var resultData = new PagingDataModel<EquipmentPagingModel>();
        Expression<Func<Domain.Entities.Equipment, bool>> expression = equipment =>
            equipment.Id > 0
            && ((param.CategoryId == null) ? true : (equipment.CategoryId == param.CategoryId))
            && ((param.Status == null) ? true : (equipment.Status == param.Status))
            && (
                (param.DepartmentId == null) ? true : (equipment.DepartmentId == param.DepartmentId)
            );

        var pagingData = await _equipmentRepository.GetPagingAsync(param.ParamPaging, expression);

        foreach (var item in pagingData.Data)
        {
            var category = await _equipmentCategoryRepository.GetByIdAsync(item.CategoryId);
            var department = await _departmentRepository.GetByIdAsync(item.DepartmentId);
            var owner = await _userRepository.GetByIdAsync(item.OwnerId ?? 0);
            var equipmentModel = new EquipmentPagingModel
            {
                Id = item.Id,
                Code = item.Code,
                Name = item.Name,
                OwnerId = item.OwnerId,
                OwnerName = owner?.UserName + " - " + owner?.FullName,
                Price = item.Price,
                CategoryId = item.CategoryId,
                CategoryName = category?.Name ?? "-",
                DepartmentId = item.DepartmentId,
                DepartmentName = department?.Name ?? "-",
                Status = item.Status,
                CreatedDate = item.CreatedDate,
                UpdatedDate = item.UpdatedDate,
            };
            resultData.Data.Add(equipmentModel);
        }

        resultData.TotalPages = pagingData.TotalPages;
        resultData.TotalRecords = pagingData.TotalRecords;

        return new Response<PagingDataModel<EquipmentPagingModel>>(resultData);
    }

    public async Task<Response<EquipmentResponseModel>> CreateOrUpdateEquipment(
        Domain.Entities.Equipment equipment
    )
    {
        try
        {
            // Check required fields
            if (string.IsNullOrWhiteSpace(equipment.Code))
            {
                return new Response<EquipmentResponseModel>(
                    new EquipmentResponseModel()
                    {
                        IsSuccess = false,
                        CodeError = "Mã thiết bị không được để trống",
                    }
                );
            }
            if (string.IsNullOrWhiteSpace(equipment.Name))
            {
                return new Response<EquipmentResponseModel>(
                    new EquipmentResponseModel()
                    {
                        IsSuccess = false,
                        NameError = "Tên thiết bị không được để trống",
                    }
                );
            }
            if (equipment.Price < 0)
            {
                return new Response<EquipmentResponseModel>(
                    new EquipmentResponseModel()
                    {
                        IsSuccess = false,
                        PriceError = "Giá tiền không hợp lệ",
                    }
                );
            }
            if (equipment.CategoryId <= 0)
            {
                return new Response<EquipmentResponseModel>(
                    new EquipmentResponseModel()
                    {
                        IsSuccess = false,
                        CategoryIdError = "Vui lòng chọn danh mục thiết bị",
                    }
                );
            }
            var existCate = await _equipmentCategoryRepository.ExistAsync(x =>
                x.Id == equipment.CategoryId
            );
            if (!existCate)
            {
                return new Response<EquipmentResponseModel>(
                    new EquipmentResponseModel()
                    {
                        IsSuccess = false,
                        CategoryIdError = "Danh mục thiết bị không tồn tại",
                    }
                );
            }

            if (equipment.DepartmentId <= 0)
            {
                return new Response<EquipmentResponseModel>(
                    new EquipmentResponseModel()
                    {
                        IsSuccess = false,
                        DepartmentIdError = "Vui lòng chọn phòng ban sử dụng",
                    }
                );
            }

            var existDept = await _departmentRepository.ExistAsync(x =>
                x.Id == equipment.DepartmentId
            );
            if (!existDept)
            {
                return new Response<EquipmentResponseModel>(
                    new EquipmentResponseModel()
                    {
                        IsSuccess = false,
                        DepartmentIdError = "Phòng ban không tồn tại",
                    }
                );
            }

            // Check if category with same code exists
            var exists = await _equipmentRepository.ExistAsync(x =>
                x.Code.Trim() == equipment.Code.Trim() && x.Id != equipment.Id
            );

            if (exists)
            {
                return new Response<EquipmentResponseModel>(
                    new EquipmentResponseModel()
                    {
                        IsSuccess = false,
                        CodeError = "Mã thiết bị đã tồn tại",
                    }
                );
            }

            // Thêm mới
            if (equipment.Id == 0)
            {
                equipment.Status = Enumerations.EquipmentStatus.Available;
                await _equipmentRepository.CreateAsync(equipment);
            }
            else // Cập nhật
            {
                var existingCategory = await _equipmentRepository.GetByIdAsync(equipment.Id);

                if (existingCategory == null)
                {
                    return new Response<EquipmentResponseModel>(
                        StatusCodes.Status404NotFound,
                        "Không tìm thấy thiết bị"
                    );
                }

                existingCategory.Code = equipment.Code;
                existingCategory.Name = equipment.Name;
                existingCategory.Description = equipment.Description;
                existingCategory.ImportDate = equipment.ImportDate;
                existingCategory.Manufacturer = equipment.Manufacturer;
                existingCategory.OriginOfGoods = equipment.OriginOfGoods;
                existingCategory.Price = equipment.Price;
                existingCategory.CategoryId = equipment.CategoryId;
                existingCategory.DepartmentId = equipment.DepartmentId;
                existingCategory.OwnerId = equipment.OwnerId;
                existingCategory.Status = equipment.Status;

                await _equipmentRepository.UpdateAsync(existingCategory);
            }

            return new Response<EquipmentResponseModel>(
                new EquipmentResponseModel() { IsSuccess = true }
            );
        }
        catch (Exception ex)
        {
            return new Response<EquipmentResponseModel>(
                StatusCodes.Status500InternalServerError,
                $"Error creating category: {ex.Message}"
            );
        }
    }

    public async Task<Response<List<EquipmentModel>>> GetListEquipmentAvaiable(int userId)
    {
        var avaiableEquipments = await _equipmentRepository
            .GetListAsync(x =>
                x.OwnerId != userId && x.Status == Enumerations.EquipmentStatus.Available
            )
            .ToListAsync();

        var entity = avaiableEquipments
            .Select(async item =>
            {
                var category = await _equipmentCategoryRepository.GetByIdAsync(item.CategoryId);
                var department = await _departmentRepository.GetByIdAsync(item.DepartmentId);
                return new EquipmentModel
                {
                    Id = item.Id,
                    Code = item.Code,
                    Name = item.Name,
                    Price = item.Price,
                    CategoryId = item.CategoryId,
                    CategoryName = category?.Name ?? "-",
                    DepartmentId = item.DepartmentId,
                    DepartmentName = department?.Name ?? "-",
                };
            })
            .Select(t => t.Result)
            .ToList();

        return new Response<List<EquipmentModel>>(entity);
    }
}
