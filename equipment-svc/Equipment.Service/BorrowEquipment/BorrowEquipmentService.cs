using System.Linq.Expressions;
using Equipment.Domain.Constant;
using Equipment.Domain.IRepositories;
using Equipment.Domain.Models;
using Equipment.Domain.Models.BorrowEquipmentModel;
using Equipment.Domain.Models.ReponseModel;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Equipment.Service.BorrowEquipment;

public class BorrowEquipmentService : IBorrowEquipmentService
{
    private readonly IBorrowEquipmentRepository _borrowEquipmentRepository;
    private readonly IEquipmentRepository _equipmentRepository;
    private readonly IUserRepository _userRepository;
    private readonly IDepartmentRepository _departmentRepository;
    private readonly IEquipmentCategoryRepository _equipmentCategoryRepository;

    public BorrowEquipmentService(
        IBorrowEquipmentRepository borrowEquipmentRepository,
        IEquipmentRepository equipmentRepository,
        IUserRepository userRepository,
        IDepartmentRepository departmentRepository,
        IEquipmentCategoryRepository equipmentCategoryRepository
    )
    {
        _borrowEquipmentRepository = borrowEquipmentRepository;
        _equipmentRepository = equipmentRepository;
        _userRepository = userRepository;
        _departmentRepository = departmentRepository;
        _equipmentCategoryRepository = equipmentCategoryRepository;
    }

    public async Task<Response<PagingDataModel<BorrowEquipmentPagingModel>>> GetPaging(
        PaginationParam param,
        int currentUserId
    )
    {
        var resultData = new PagingDataModel<BorrowEquipmentPagingModel>();

        Expression<Func<Domain.Entities.BorrowEquipment, bool>> expression = e =>
            e.Id > 0 && e.RequestedByUserId == currentUserId;

        var pagingData = await _borrowEquipmentRepository.GetPagingAsync(param, expression);

        foreach (var item in pagingData.Data)
        {
            var equipment = await _equipmentRepository.GetByIdAsync(item.EquipmentId);
            var category = await _equipmentCategoryRepository.GetByIdAsync(
                equipment?.CategoryId ?? 0
            );
            var department = await _departmentRepository.GetByIdAsync(equipment?.DepartmentId ?? 0);

            var borrowModel = new BorrowEquipmentPagingModel
            {
                Id = item.Id,
                EquipmentId = item.EquipmentId,
                EquipmentCode = equipment?.Code ?? "-",
                EquipmentName = equipment?.Name ?? "-",
                CategoryName = category?.Name ?? "-",
                DepartmentName = department?.Name ?? "-",
                FromDate = item.FromDate,
                ToDate = item.ToDate,
                Status = item.Status,
                CreatedDate = item.CreatedDate,
                UpdatedDate = item.UpdatedDate,
            };
            resultData.Data.Add(borrowModel);
        }

        resultData.TotalPages = pagingData.TotalPages;
        resultData.TotalRecords = pagingData.TotalRecords;

        return new Response<PagingDataModel<BorrowEquipmentPagingModel>>(resultData);
    }

    public async Task<Response<BorrowEquipmentDataModel>> GetById(int id, int currentUserId)
    {
        var borrowRequest = await _borrowEquipmentRepository.GetByIdAsync(id);
        if (borrowRequest == null || borrowRequest.RequestedByUserId != currentUserId)
        {
            return new Response<BorrowEquipmentDataModel>(
                StatusCodes.Status404NotFound,
                "Yêu cầu mượn không tồn tại"
            );
        }

        var equipment = await _equipmentRepository.GetByIdAsync(borrowRequest.EquipmentId);
        var category = await _equipmentCategoryRepository.GetByIdAsync(equipment?.CategoryId ?? 0);
        var department = await _departmentRepository.GetByIdAsync(equipment?.DepartmentId ?? 0);
        var userRequest = await _userRepository.GetByIdAsync(borrowRequest.RequestedByUserId);
        var userApproved = borrowRequest.ApprovedByUserId.HasValue
            ? await _userRepository.GetByIdAsync(borrowRequest.ApprovedByUserId.Value)
            : null;

        var borrowModel = new BorrowEquipmentDataModel
        {
            Id = borrowRequest.Id,
            EquipmentId = borrowRequest.EquipmentId,
            EquipmentCode = equipment?.Code ?? "-",
            EquipmentName = equipment?.Name ?? "-",
            CategoryName = category?.Name ?? "-",
            DepartmentName = department?.Name ?? "-",
            FromDate = borrowRequest.FromDate,
            ToDate = borrowRequest.ToDate,
            Status = borrowRequest.Status,
            BorrowerId = borrowRequest.RequestedByUserId,
            BorrowerName = userRequest?.UserName + " - " + userRequest?.FullName,
            ApprovedByUserId = borrowRequest.ApprovedByUserId,
            ApprovedByName =
                userApproved != null ? userApproved.UserName + " - " + userApproved.FullName : null,
            ApprovedDate = borrowRequest.ApprovedDate,
            ReturnedDate = borrowRequest.ReturnedDate,
            StatusAfterReturn = borrowRequest.StatusAfterReturn,
            ProcessingForm = borrowRequest.ProcessingForm,
            ProcessingNote = borrowRequest.ProcessingNote,
        };
        return new Response<BorrowEquipmentDataModel>(borrowModel);
    }

    public async Task<
        Response<PagingDataModel<BorrowEquipmentRequestPagingModel>>
    > GetRequestPaging(PaginationParam param, int currentUserId)
    {
        var resultData = new PagingDataModel<BorrowEquipmentRequestPagingModel>();

        var user = await _userRepository.GetByIdAsync(currentUserId);
        if (user == null)
        {
            return new Response<PagingDataModel<BorrowEquipmentRequestPagingModel>>(resultData);
        }

        var equipmentList = _equipmentRepository.GetListAsync(x =>
            (
                user.Role == Enumerations.Role.Admin ? x.Id > 0
                : user.Role == Enumerations.Role.Manager
                    ? (x.DepartmentId == user.DepartmentId || x.OwnerId == currentUserId)
                : x.OwnerId == currentUserId
            )
        );

        Expression<Func<Domain.Entities.BorrowEquipment, bool>> expression = e =>
            e.Id > 0
            && e.Status == Enumerations.BorrowEquipmentStatus.Pendding
            && equipmentList.Select(eq => eq.Id).Contains(e.EquipmentId);

        var pagingData = await _borrowEquipmentRepository.GetPagingAsync(param, expression);

        foreach (var item in pagingData.Data)
        {
            var equipment = await _equipmentRepository.GetByIdAsync(item.EquipmentId);
            var category = await _equipmentCategoryRepository.GetByIdAsync(
                equipment?.CategoryId ?? 0
            );
            var department = await _departmentRepository.GetByIdAsync(equipment?.DepartmentId ?? 0);
            var userRequest = await _userRepository.GetByIdAsync(item.RequestedByUserId);

            var borrowModel = new BorrowEquipmentRequestPagingModel
            {
                Id = item.Id,
                EquipmentId = item.EquipmentId,
                EquipmentCode = equipment?.Code ?? "-",
                EquipmentName = equipment?.Name ?? "-",
                CategoryName = category?.Name ?? "-",
                DepartmentName = department?.Name ?? "-",
                FromDate = item.FromDate,
                ToDate = item.ToDate,
                BorrowerId = item.RequestedByUserId,
                BorrowerName = userRequest?.UserName + " - " + userRequest?.FullName,
                CreatedDate = item.CreatedDate,
                UpdatedDate = item.UpdatedDate,
            };
            resultData.Data.Add(borrowModel);
        }

        resultData.TotalPages = pagingData.TotalPages;
        resultData.TotalRecords = pagingData.TotalRecords;

        return new Response<PagingDataModel<BorrowEquipmentRequestPagingModel>>(resultData);
    }

    public async Task<Response<BorrowEquipmentResponseModel>> CreateOrUpdateBorrowRequest(
        Domain.Entities.BorrowEquipment borrowEquipment,
        int currentUserId
    )
    {
        try
        {
            // Validate required fields
            if (borrowEquipment.EquipmentId <= 0)
            {
                return new Response<BorrowEquipmentResponseModel>(
                    new BorrowEquipmentResponseModel()
                    {
                        IsSuccess = false,
                        EquipmentIdError = "Vui lòng chọn thiết bị",
                    }
                );
            }

            if (borrowEquipment.FromDate >= borrowEquipment.ToDate)
            {
                return new Response<BorrowEquipmentResponseModel>(
                    new BorrowEquipmentResponseModel()
                    {
                        IsSuccess = false,
                        ToDateError = "Ngày kết thúc phải sau ngày bắt đầu",
                    }
                );
            }

            if (borrowEquipment.FromDate < DateTime.Today)
            {
                return new Response<BorrowEquipmentResponseModel>(
                    new BorrowEquipmentResponseModel()
                    {
                        IsSuccess = false,
                        FromDateError = "Ngày bắt đầu không được là ngày trong quá khứ",
                    }
                );
            }

            // Check if equipment exists
            var equipment = await _equipmentRepository.GetByIdAsync(borrowEquipment.EquipmentId);
            if (equipment == null)
            {
                return new Response<BorrowEquipmentResponseModel>(
                    new BorrowEquipmentResponseModel()
                    {
                        IsSuccess = false,
                        EquipmentIdError = "Thiết bị không tồn tại",
                    }
                );
            }

            // Check if equipment is available
            if (equipment.Status != Enumerations.EquipmentStatus.Available)
            {
                return new Response<BorrowEquipmentResponseModel>(
                    new BorrowEquipmentResponseModel()
                    {
                        IsSuccess = false,
                        EquipmentIdError = "Thiết bị không khả dụng để mượn",
                    }
                );
            }

            // Check if there's an overlapping approved request
            var overlappingRequest = await _borrowEquipmentRepository.GetAsync(x =>
                x.Id != borrowEquipment.Id
                && x.EquipmentId == borrowEquipment.EquipmentId
                && (
                    x.Status == Enumerations.BorrowEquipmentStatus.Pendding
                    || x.Status == Enumerations.BorrowEquipmentStatus.Borrowed
                )
                && (
                    (x.FromDate <= borrowEquipment.FromDate && x.ToDate >= borrowEquipment.FromDate)
                    || (x.FromDate <= borrowEquipment.ToDate && x.ToDate >= borrowEquipment.ToDate)
                    || (
                        x.FromDate >= borrowEquipment.FromDate && x.ToDate <= borrowEquipment.ToDate
                    )
                )
            );

            if (overlappingRequest != null)
            {
                return new Response<BorrowEquipmentResponseModel>(
                    new BorrowEquipmentResponseModel()
                    {
                        IsSuccess = false,
                        EquipmentIdError = "Thiết bị đã được mượn trong khoảng thời gian này",
                    }
                );
            }

            // Set request details
            borrowEquipment.RequestedByUserId = currentUserId;
            borrowEquipment.Status = Enumerations.BorrowEquipmentStatus.Pendding;

            if (borrowEquipment.Id == 0)
            {
                await _borrowEquipmentRepository.CreateAsync(borrowEquipment);
            }
            else
            {
                var existingBorrow = await _borrowEquipmentRepository.GetByIdAsync(
                    borrowEquipment.Id
                );

                if (existingBorrow == null)
                {
                    return new Response<BorrowEquipmentResponseModel>(
                        StatusCodes.Status404NotFound,
                        "Yêu cầu mượn không tồn tại"
                    );
                }

                existingBorrow.EquipmentId = borrowEquipment.EquipmentId;
                existingBorrow.FromDate = borrowEquipment.FromDate;
                existingBorrow.ToDate = borrowEquipment.ToDate;
                // Reset status to Pendding on update
                existingBorrow.Status = Enumerations.BorrowEquipmentStatus.Pendding;

                await _borrowEquipmentRepository.UpdateAsync(borrowEquipment);
            }

            return new Response<BorrowEquipmentResponseModel>(
                new BorrowEquipmentResponseModel() { IsSuccess = true }
            );
        }
        catch (Exception ex)
        {
            return new Response<BorrowEquipmentResponseModel>(
                StatusCodes.Status500InternalServerError,
                $"Error creating borrow request: {ex.Message}"
            );
        }
    }

    public async Task<Response<bool>> ReturnEquipment(ReturnEquipmentModel param)
    {
        try
        {
            var borrowRequest = await _borrowEquipmentRepository.GetByIdAsync(param.Id);
            if (borrowRequest == null)
            {
                return new Response<bool>(
                    StatusCodes.Status404NotFound,
                    "Không tìm thấy yêu cầu mượn"
                );
            }

            if (borrowRequest.Status != Enumerations.BorrowEquipmentStatus.Borrowed)
            {
                return new Response<bool>(
                    StatusCodes.Status400BadRequest,
                    "Thiết bị này đang không được mượn"
                );
            }

            var equipment = await _equipmentRepository.GetByIdAsync(borrowRequest.EquipmentId);
            if (equipment == null)
            {
                return new Response<bool>(StatusCodes.Status404NotFound, "Không tìm thấy thiết bị");
            }

            equipment.Status = param.Status;
            await _equipmentRepository.UpdateAsync(equipment);

            borrowRequest.Status = Enumerations.BorrowEquipmentStatus.Returned;
            borrowRequest.StatusAfterReturn = param.Status;
            borrowRequest.ReturnedDate = DateTime.Now;
            borrowRequest.ProcessingForm = param.ProcessingForm;
            borrowRequest.ProcessingNote = param.ProcessingNote;
            await _borrowEquipmentRepository.UpdateAsync(borrowRequest);

            return new Response<bool>(true);
        }
        catch (Exception ex)
        {
            return new Response<bool>(
                StatusCodes.Status500InternalServerError,
                $"Error returning equipment: {ex.Message}"
            );
        }
    }

    public async Task<Response<bool>> ApproveBorrowRequest(int id, int currentUserId)
    {
        try
        {
            var borrowRequest = await _borrowEquipmentRepository.GetByIdAsync(id);
            if (borrowRequest == null)
            {
                return new Response<bool>(
                    StatusCodes.Status404NotFound,
                    "Không tìm thấy yêu cầu mượn"
                );
            }

            if (borrowRequest.Status != Enumerations.BorrowEquipmentStatus.Pendding)
            {
                return new Response<bool>(
                    StatusCodes.Status400BadRequest,
                    "Yêu cầu này đã được xử lý"
                );
            }

            // Check authorization
            var currentUser = await _userRepository.GetByIdAsync(currentUserId);
            if (currentUser == null)
            {
                return new Response<bool>(
                    StatusCodes.Status404NotFound,
                    "Không tìm thấy người dùng"
                );
            }

            var equipment = await _equipmentRepository.GetByIdAsync(borrowRequest.EquipmentId);
            if (equipment == null)
            {
                return new Response<bool>(StatusCodes.Status404NotFound, "Không tìm thấy thiết bị");
            }

            // Check if user has permission: Admin, Manager of department, or Owner of equipment
            bool hasPermission = false;

            // Admin can approve
            if (currentUser.Role == Enumerations.Role.Admin)
            {
                hasPermission = true;
            }
            // Manager of department can approve
            else if (
                currentUser.Role == Enumerations.Role.Manager
                && currentUser.DepartmentId.HasValue
                && equipment.DepartmentId == currentUser.DepartmentId.Value
            )
            {
                var department = await _departmentRepository.GetByIdAsync(
                    currentUser.DepartmentId.Value
                );
                if (department != null && department.ManagerId == currentUserId)
                {
                    hasPermission = true;
                }
            }
            // Owner of equipment can approve
            else if (equipment.OwnerId == currentUserId)
            {
                hasPermission = true;
            }

            if (!hasPermission)
            {
                return new Response<bool>(
                    StatusCodes.Status403Forbidden,
                    "Bạn không có quyền duyệt yêu cầu này"
                );
            }

            // Check if equipment is still available
            if (equipment.Status != Enumerations.EquipmentStatus.Available)
            {
                return new Response<bool>(
                    StatusCodes.Status400BadRequest,
                    "Thiết bị không khả dụng để mượn"
                );
            }

            // Check for overlapping approved requests
            var overlappingRequest = await _borrowEquipmentRepository.GetAsync(x =>
                x.Id != id
                && x.EquipmentId == borrowRequest.EquipmentId
                && x.Status == Enumerations.BorrowEquipmentStatus.Borrowed
                && (
                    (x.FromDate <= borrowRequest.FromDate && x.ToDate >= borrowRequest.FromDate)
                    || (x.FromDate <= borrowRequest.ToDate && x.ToDate >= borrowRequest.ToDate)
                    || (x.FromDate >= borrowRequest.FromDate && x.ToDate <= borrowRequest.ToDate)
                )
            );

            if (overlappingRequest != null)
            {
                return new Response<bool>(
                    StatusCodes.Status400BadRequest,
                    "Thiết bị đã được mượn trong khoảng thời gian này"
                );
            }

            // Approve the request
            borrowRequest.Status = Enumerations.BorrowEquipmentStatus.Borrowed;
            borrowRequest.ApprovedByUserId = currentUserId;
            borrowRequest.ApprovedDate = DateTime.Now;
            borrowRequest.ProcessingNote = null;

            await _borrowEquipmentRepository.UpdateAsync(borrowRequest);

            // Update equipment status to Borrowed
            equipment.Status = Enumerations.EquipmentStatus.Borrowed;
            await _equipmentRepository.UpdateAsync(equipment);

            return new Response<bool>(true);
        }
        catch (Exception ex)
        {
            return new Response<bool>(
                StatusCodes.Status500InternalServerError,
                $"Error approving borrow request: {ex.Message}"
            );
        }
    }

    public async Task<Response<bool>> RejectBorrowRequest(int id, int currentUserId)
    {
        try
        {
            var borrowRequest = await _borrowEquipmentRepository.GetByIdAsync(id);
            if (borrowRequest == null)
            {
                return new Response<bool>(
                    StatusCodes.Status404NotFound,
                    "Không tìm thấy yêu cầu mượn"
                );
            }

            if (borrowRequest.Status != Enumerations.BorrowEquipmentStatus.Pendding)
            {
                return new Response<bool>(
                    StatusCodes.Status400BadRequest,
                    "Yêu cầu này đã được xử lý"
                );
            }

            // Check authorization
            var currentUser = await _userRepository.GetByIdAsync(currentUserId);
            if (currentUser == null)
            {
                return new Response<bool>(
                    StatusCodes.Status404NotFound,
                    "Không tìm thấy người dùng"
                );
            }

            var equipment = await _equipmentRepository.GetByIdAsync(borrowRequest.EquipmentId);
            if (equipment == null)
            {
                return new Response<bool>(StatusCodes.Status404NotFound, "Không tìm thấy thiết bị");
            }

            // Check if user has permission: Admin, Manager of department, or Owner of equipment
            bool hasPermission = false;

            // Admin can reject
            if (currentUser.Role == Enumerations.Role.Admin)
            {
                hasPermission = true;
            }
            // Manager of department can reject
            else if (
                currentUser.Role == Enumerations.Role.Manager
                && currentUser.DepartmentId.HasValue
                && equipment.DepartmentId == currentUser.DepartmentId.Value
            )
            {
                var department = await _departmentRepository.GetByIdAsync(
                    currentUser.DepartmentId.Value
                );
                if (department != null && department.ManagerId == currentUserId)
                {
                    hasPermission = true;
                }
            }
            // Owner of equipment can reject
            else if (equipment.OwnerId == currentUserId)
            {
                hasPermission = true;
            }

            if (!hasPermission)
            {
                return new Response<bool>(
                    StatusCodes.Status403Forbidden,
                    "Bạn không có quyền từ chối yêu cầu này"
                );
            }

            // Reject the request
            borrowRequest.Status = Enumerations.BorrowEquipmentStatus.Rejected;
            borrowRequest.ApprovedByUserId = currentUserId;
            borrowRequest.ApprovedDate = DateTime.Now;

            await _borrowEquipmentRepository.UpdateAsync(borrowRequest);

            return new Response<bool>(true);
        }
        catch (Exception ex)
        {
            return new Response<bool>(
                StatusCodes.Status500InternalServerError,
                $"Error rejecting borrow request: {ex.Message}"
            );
        }
    }
}
