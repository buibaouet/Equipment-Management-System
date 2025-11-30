using System.Globalization;
using System.Linq.Expressions;
using Equipment.Domain.Constant;
using Equipment.Domain.IRepositories;
using Equipment.Domain.Models;
using Equipment.Domain.Models.EquipmentHistoryModel;
using Equipment.Domain.Models.EquipmentModel;
using Equipment.Domain.Models.ReponseModel;
using Equipment.Service.EquipmentHistory;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Equipment.Service.Equipment;

public class EquipmentService : IEquipmentService
{
    private readonly IEquipmentRepository _equipmentRepository;
    private readonly IEquipmentCategoryRepository _equipmentCategoryRepository;
    private readonly IDepartmentRepository _departmentRepository;
    private readonly IUserRepository _userRepository;
    private readonly IBorrowEquipmentRepository _borrowEquipmentRepository;
    private readonly IEquipmentHistoryService _equipmentHistoryService;

    public EquipmentService(
        IEquipmentRepository equipmentRepository,
        IEquipmentCategoryRepository equipmentCategoryRepository,
        IDepartmentRepository departmentRepository,
        IUserRepository userRepository,
        IBorrowEquipmentRepository borrowEquipmentRepository,
        IEquipmentHistoryService equipmentHistoryService
    )
    {
        _equipmentRepository = equipmentRepository;
        _equipmentCategoryRepository = equipmentCategoryRepository;
        _departmentRepository = departmentRepository;
        _userRepository = userRepository;
        _borrowEquipmentRepository = borrowEquipmentRepository;
        _equipmentHistoryService = equipmentHistoryService;
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
            && ((param.OwnerId == null) ? true : (equipment.OwnerId == param.OwnerId))
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
        Domain.Entities.Equipment equipment,
        int currentUserId
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

            var actor = await _userRepository.GetByIdAsync(currentUserId);
            var actorDisplayName = GetUserDisplayName(actor);

            // Thêm mới
            if (equipment.Id == 0)
            {
                equipment.Status = Enumerations.EquipmentStatus.Available;
                await _equipmentRepository.CreateAsync(equipment);

                var creationChanges = await BuildEquipmentChanges(null, equipment);

                await _equipmentHistoryService.LogAsync(
                    equipment.Id,
                    Enumerations.EquipmentHistoryAction.Created,
                    $"{actorDisplayName ?? $"Người dùng {currentUserId}"} đã tạo thiết bị {equipment.Code}",
                    currentUserId,
                    actorDisplayName,
                    creationChanges
                );
            }
            else // Cập nhật
            {
                var existingEquipment = await _equipmentRepository.GetByIdAsync(equipment.Id);

                if (existingEquipment == null)
                {
                    return new Response<EquipmentResponseModel>(
                        StatusCodes.Status404NotFound,
                        "Không tìm thấy thiết bị"
                    );
                }

                var changes = await BuildEquipmentChanges(existingEquipment, equipment);

                existingEquipment.Code = equipment.Code;
                existingEquipment.Name = equipment.Name;
                existingEquipment.Description = equipment.Description;
                existingEquipment.ImportDate = equipment.ImportDate;
                existingEquipment.Manufacturer = equipment.Manufacturer;
                existingEquipment.OriginOfGoods = equipment.OriginOfGoods;
                existingEquipment.Price = equipment.Price;
                existingEquipment.CategoryId = equipment.CategoryId;
                existingEquipment.DepartmentId = equipment.DepartmentId;
                existingEquipment.OwnerId = equipment.OwnerId;
                existingEquipment.ReasonBroken = equipment.ReasonBroken;
                existingEquipment.SolutionBroken = equipment.SolutionBroken;
                existingEquipment.Status = equipment.Status;

                await _equipmentRepository.UpdateAsync(existingEquipment);

                if (changes.Any())
                {
                    await _equipmentHistoryService.LogAsync(
                        equipment.Id,
                        Enumerations.EquipmentHistoryAction.Updated,
                        $"{actorDisplayName ?? $"Người dùng {currentUserId}"} đã cập nhật thiết bị {equipment.Code}",
                        currentUserId,
                        actorDisplayName,
                        changes
                    );
                }
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

    public async Task<Response<List<EquipmentHistoryModel>>> GetHistory(
        int equipmentId
    )
    {
        var equipment = await _equipmentRepository.GetByIdAsync(equipmentId);
        if (equipment == null)
        {
            return new Response<List<EquipmentHistoryModel>>(
                StatusCodes.Status404NotFound,
                "Không tìm thấy thiết bị"
            );
        }

        return await _equipmentHistoryService.GetHistoryAsync(equipmentId);
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

    public async Task<Response<PagingDataModel<MyEquipmentPagingModel>>> GetPagingMyEquipment(
        PaginationParam param,
        int userId
    )
    {
        var resultData = new PagingDataModel<MyEquipmentPagingModel>();

        // list equipment borrowed by user
        var borrowedEquipments = await _borrowEquipmentRepository
            .GetListAsync(x =>
                x.RequestedByUserId == userId
                && x.Status == Enumerations.BorrowEquipmentStatus.Borrowed
            )
            .ToListAsync();

        var borrowedEquipmentsIds = borrowedEquipments.Select(x => x.EquipmentId).ToList();

        Expression<Func<Domain.Entities.Equipment, bool>> expression = equipment =>
            equipment.Id > 0
            && (equipment.OwnerId == userId || borrowedEquipmentsIds.Contains(equipment.Id));

        var pagingData = await _equipmentRepository.GetPagingAsync(param, expression);

        foreach (var item in pagingData.Data)
        {
            var category = await _equipmentCategoryRepository.GetByIdAsync(item.CategoryId);
            var department = await _departmentRepository.GetByIdAsync(item.DepartmentId);
            var owner = await _userRepository.GetByIdAsync(item.OwnerId ?? 0);
            var equipmentModel = new MyEquipmentPagingModel
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
                IsBorrow = borrowedEquipmentsIds.Contains(item.Id),
                RemainingDays = borrowedEquipmentsIds.Contains(item.Id)
                    ? (borrowedEquipments
                        .FirstOrDefault(x => x.EquipmentId == item.Id)!
                        .ToDate
                        .Date - DateTime.Now.Date).Days
                    : 0,
            };
            resultData.Data.Add(equipmentModel);
        }

        resultData.TotalPages = pagingData.TotalPages;
        resultData.TotalRecords = pagingData.TotalRecords;

        return new Response<PagingDataModel<MyEquipmentPagingModel>>(resultData);
    }

    private async Task<List<EquipmentHistoryChangeModel>> BuildEquipmentChanges(
        Domain.Entities.Equipment? oldEquipment,
        Domain.Entities.Equipment newEquipment
    )
    {
        var changes = new List<EquipmentHistoryChangeModel>();
        
        var oldCategory = await _equipmentCategoryRepository.GetByIdAsync(oldEquipment?.CategoryId ?? 0);
        var oldDepartment = await _departmentRepository.GetByIdAsync(oldEquipment?.DepartmentId ?? 0);
        var oldOwner = await _userRepository.GetByIdAsync(oldEquipment?.OwnerId ?? 0);
        
        var newCategory = await _equipmentCategoryRepository.GetByIdAsync(newEquipment?.CategoryId ?? 0);
        var newDepartment = await _departmentRepository.GetByIdAsync(newEquipment?.DepartmentId ?? 0);
        var newOwner = await _userRepository.GetByIdAsync(newEquipment?.OwnerId ?? 0);
        
        Dictionary<int, string> statusName = new()
        {
            { (int)Enumerations.EquipmentStatus.Available, "Sẵn sàng" },
            { (int)Enumerations.EquipmentStatus.Borrowed, "Đang sử dụng" },
            { (int)Enumerations.EquipmentStatus.Maintenance, "Bảo trì" },
            { (int)Enumerations.EquipmentStatus.Liquidation, "Thanh lý" },
            { (int)Enumerations.EquipmentStatus.Broken, "Đã hỏng" },
        };

        Compare(changes, "Mã thiết bị", oldEquipment?.Code, newEquipment.Code);
        Compare(changes, "Tên thiết bị", oldEquipment?.Name, newEquipment.Name);
        Compare(changes, "Mô tả", oldEquipment?.Description, newEquipment.Description);
        Compare(changes, "Ngày nhập", oldEquipment?.ImportDate, newEquipment.ImportDate);
        Compare(changes, "Hãng sản xuất", oldEquipment?.Manufacturer, newEquipment.Manufacturer);
        Compare(changes, "Xuất xứ", oldEquipment?.OriginOfGoods, newEquipment.OriginOfGoods);
        Compare(changes, "Giá tiền", oldEquipment?.Price, newEquipment.Price);
        Compare(changes, "Danh mục", oldCategory?.Name, newCategory?.Name);
        Compare(changes, "Phòng ban", oldDepartment?.Name, newDepartment?.Name);
        Compare(changes, "Chủ sở hữu", oldOwner?.FullName, newOwner?.FullName);
        Compare(changes, "Lý do hỏng", oldEquipment?.ReasonBroken, newEquipment?.ReasonBroken);
        Compare(changes, "Hướng xử lý", oldEquipment?.SolutionBroken, newEquipment?.SolutionBroken);
        Compare(changes, "Trạng thái", oldEquipment != null ? statusName[(int)oldEquipment.Status] : null, statusName[(int)newEquipment.Status]);

        return changes;
    }

    private static void Compare(
        ICollection<EquipmentHistoryChangeModel> changes,
        string field,
        object? oldValue,
        object? newValue
    )
    {
        if (oldValue == null && newValue == null)
        {
            return;
        }

        if (Equals(oldValue, newValue))
        {
            return;
        }

        changes.Add(
            new EquipmentHistoryChangeModel
            {
                Field = field,
                OldValue = FormatValue(oldValue),
                NewValue = FormatValue(newValue),
            }
        );
    }

    private static string? FormatValue(object? value)
    {
        return value switch
        {
            null => null,
            DateTime dateTime => dateTime.ToString("dd/MM/yyyy"),
            DateTimeOffset dateTimeOffset => dateTimeOffset.ToString("dd/MM/yyyy"),
            decimal decimalValue => decimalValue.ToString("N2", CultureInfo.InvariantCulture),
            Enumerations.EquipmentStatus status => status.ToString(),
            _ => value.ToString(),
        };
    }

    private static string? GetUserDisplayName(Domain.Entities.User? user)
    {
        if (user == null)
        {
            return null;
        }

        if (string.IsNullOrWhiteSpace(user.FullName))
        {
            return user.UserName;
        }

        return $"{user.UserName} - {user.FullName}";
    }
}
