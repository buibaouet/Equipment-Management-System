using Equipment.Domain.Constant;
using Equipment.Domain.Extensions;
using Equipment.Domain.IRepositories;
using Equipment.Domain.Models;
using Equipment.Domain.Models.ReponseModel;
using Equipment.Domain.Models.User;
using Microsoft.AspNetCore.Http;

namespace Equipment.Service.User;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IDepartmentRepository _departmentRepository;
    private readonly IEquipmentRepository _equipmentRepository;
    private readonly IBorrowEquipmentRepository _borrowEquipmentRepository;
    private readonly IEquipmentHistoryRepository _equipmentHistoryRepository;

    public UserService(
        IUserRepository userRepository,
        IDepartmentRepository departmentRepository,
        IEquipmentRepository equipmentRepository,
        IBorrowEquipmentRepository borrowEquipmentRepository,
        IEquipmentHistoryRepository equipmentHistoryRepository
    )
    {
        _userRepository = userRepository;
        _departmentRepository = departmentRepository;
        _equipmentRepository = equipmentRepository;
        _borrowEquipmentRepository = borrowEquipmentRepository;
        _equipmentHistoryRepository = equipmentHistoryRepository;
    }

    public async Task<Response<PagingDataModel<ManaUserResponseModel>>> GetPaging(
        PaginationParam param
    )
    {
        var resultData = new PagingDataModel<ManaUserResponseModel>();

        var pagingData = await _userRepository.GetPagingAsync<Domain.Entities.User>(param);

        foreach (var item in pagingData.Data)
        {
            var department = await _departmentRepository.GetByIdAsync(item.DepartmentId ?? 0);
            var userModel = new ManaUserResponseModel
            {
                Id = item.Id,
                UserName = item.UserName,
                FirstName = item.FirstName,
                LastName = item.LastName,
                Email = item.Email,
                Role = item.Role,
                DepartmentId = item.DepartmentId,
                DepartmentName = department?.Name ?? "-",
                IsBlock = item.IsBlock,
            };
            resultData.Data.Add(userModel);
        }

        resultData.TotalPages = pagingData.TotalPages;
        resultData.TotalRecords = pagingData.TotalRecords;

        return new Response<PagingDataModel<ManaUserResponseModel>>(resultData);
    }

    public async Task<Response<UpdateUserResponseModel>> UpdateUserAsync(
        int id,
        UpdateUserModel model
    )
    {
        var user =
            await _userRepository.GetByIdAsync(id) ?? throw new ArgumentException("User not found");

        var existsEmail = await _userRepository.ExistAsync(u =>
            u.Email == model.Email && u.Id != id
        );

        if (existsEmail)
        {
            return new Response<UpdateUserResponseModel>(
                new UpdateUserResponseModel()
                {
                    IsSuccess = false,
                    EmailError = "Địa chỉ email đã tồn tại",
                }
            );
        }

        user.FirstName = model.FirstName;
        user.LastName = model.LastName;
        user.BirthDate = model.BirthDate;
        user.Email = model.Email;
        user.Bio = model.Bio;
        user.Address = model.Address;
        user.PhoneNumber = model.PhoneNumber;

        await _userRepository.UpdateAsync(user);

        return new Response<UpdateUserResponseModel>(
            new UpdateUserResponseModel() { IsSuccess = true }
        );
    }

    public async Task<Response<CreateUserResponseModel>> AddNewUserByAdmin(int userId, CreateUserByAdminInput model)
    {
        var user =
            await _userRepository.GetByIdAsync(userId) ?? throw new ArgumentException("User not found");
        
        if(user.Role != Enumerations.Role.Admin)
        {
            return new Response<CreateUserResponseModel>(
                StatusCodes.Status403Forbidden,
                "Chỉ có Admin mới có quyền thêm người dùng"
            );
        }
        
        var existsUsername = await _userRepository.ExistAsync(u =>
            u.UserName == model.UserName
        );
        
        if (existsUsername)
        {
            return new Response<CreateUserResponseModel>(
                new CreateUserResponseModel()
                {
                    IsSuccess = false,
                    UsernameError = "Tên đăng nhập đã tồn tại",
                }
            );
        }
        
        var existsEmail = await _userRepository.ExistAsync(u =>
            u.Email == model.Email
        );
        
        if (existsEmail)
        {
            return new Response<CreateUserResponseModel>(
                new CreateUserResponseModel()
                {
                    IsSuccess = false,
                    EmailError = "Địa chỉ email đã tồn tại",
                }
            );
        }
        
        var newUser = new Domain.Entities.User
        {
            UserName = model.UserName,
            FirstName = model.FirstName,
            LastName = model.LastName,
            Email = model.Email,
            Role = model.Role,
            DepartmentId = model.DepartmentId,
            PhoneNumber = model.PhoneNumber,
            Address = model.Address,
            BirthDate = model.BirthDate,
            Bio = model.Bio,
            // Default password
            Password = BcryptHasher.HashPassword("Default@123"),
        };
        await _userRepository.CreateAsync(newUser);
        
        return new Response<CreateUserResponseModel>(
            new CreateUserResponseModel() { IsSuccess = true }
        );
    }

    public async Task<Response<bool>> UpdateUserRoleDepartmentAsync(
        int id,
        UpdateRoleDepartmentUserModel param
    )
    {
        var user =
            await _userRepository.GetByIdAsync(id) ?? throw new ArgumentException("User not found");
        
        var existsEmail = await _userRepository.ExistAsync(u =>
            u.Email == param.Email && u.Id != id
        );

        if (existsEmail)
        {
            return new Response<bool>(
                StatusCodes.Status400BadRequest,
                "Địa chỉ email đã tồn tại"
            );
        }

        user.FirstName = param.FirstName;
        user.LastName = param.LastName;
        user.BirthDate = param.BirthDate;
        user.Email = param.Email;
        user.Bio = param.Bio;
        user.Address = param.Address;
        user.PhoneNumber = param.PhoneNumber;
        user.Role = param.Role;
        user.DepartmentId = param.DepartmentId;
        await _userRepository.UpdateAsync(user);

        return new Response<bool>(true);
    }

    public async Task<Response<UserResponseModel>> GetUserByIdAsync(int id)
    {
        var user =
            await _userRepository.GetByIdAsync(id) ?? throw new ArgumentException("User not found");

        var department = await _departmentRepository.GetByIdAsync(user.DepartmentId ?? 0);
        var entity = MapToResponseModel(user, department?.Name ?? string.Empty);

        return new Response<UserResponseModel>(entity);
    }

    public async Task<Response<List<UserNameModel>>> GetListManager()
    {
        var managers = _userRepository.GetListAsync(u => u.Role == Enumerations.Role.Manager);

        var result = managers
            .Select(u => new UserNameModel
            {
                Id = u.Id,
                UserName = u.UserName,
                FullName = u.FullName,
            })
            .ToList();

        return new Response<List<UserNameModel>>(result);
    }
    
    public async Task<Response<List<UserNameModel>>> GetListUserActive()
    {
        var managers = _userRepository.GetListAsync(u => u.Role != Enumerations.Role.Admin);

        var result = managers
            .Select(u => new UserNameModel
            {
                Id = u.Id,
                UserName = u.UserName,
                FullName = u.FullName,
            })
            .ToList();

        return new Response<List<UserNameModel>>(result);
    }

    private static UserResponseModel MapToResponseModel(
        Domain.Entities.User user,
        string departmentName
    )
    {
        return new UserResponseModel
        {
            Id = user.Id,
            UserName = user.UserName,
            FirstName = user.FirstName,
            LastName = user.LastName,
            BirthDate = user.BirthDate,
            Email = user.Email,
            Role = user.Role,
            DepartmentId = user.DepartmentId,
            DepartmentName = departmentName,
            Bio = user.Bio,
            PhoneNumber = user.PhoneNumber,
            Address = user.Address,
            IsBlock = user.IsBlock,
        };
    }

    public async Task<Response<bool>> DeleteUser(int id)
    {
        try
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                return new Response<bool>(
                    StatusCodes.Status404NotFound,
                    "Người dùng không tồn tại"
                );
            }

            if (user.IsDelete)
            {
                return new Response<bool>(
                    StatusCodes.Status400BadRequest,
                    "Người dùng đã bị xóa"
                );
            }

            // Check if user is referenced by Equipment (OwnerId)
            var equipmentCount = await _equipmentRepository.CountAsync(x =>
                x.OwnerId == id
            );
            if (equipmentCount > 0)
            {
                return new Response<bool>(
                    StatusCodes.Status400BadRequest,
                    "Người dùng đang là chủ sở hữu của thiết bị, không thể xóa"
                );
            }

            // Check if user is referenced by BorrowEquipment (RequestedByUserId or ApprovedByUserId)
            var borrowEquipmentCount = await _borrowEquipmentRepository.CountAsync(x =>
                x.RequestedByUserId == id || x.ApprovedByUserId == id
            );
            if (borrowEquipmentCount > 0)
            {
                return new Response<bool>(
                    StatusCodes.Status400BadRequest,
                    "Người dùng đang có liên quan đến yêu cầu mượn thiết bị, không thể xóa"
                );
            }

            // Check if user is referenced by Department (ManagerId)
            var departmentCount = await _departmentRepository.CountAsync(x =>
                x.ManagerId == id
            );
            if (departmentCount > 0)
            {
                return new Response<bool>(
                    StatusCodes.Status400BadRequest,
                    "Người dùng đang là quản lý của phòng ban, không thể xóa"
                );
            }

            // Soft delete
            user.IsDelete = true;
            user.UpdatedDate = DateTime.Now;
            await _userRepository.UpdateAsync(user);

            return new Response<bool>(true);
        }
        catch (Exception ex)
        {
            return new Response<bool>(
                StatusCodes.Status500InternalServerError,
                $"Lỗi khi xóa người dùng: {ex.Message}"
            );
        }
    }

    public async Task<Response<bool>> BlockUserAsync(int id, int currentUserId)
    {
        try
        {
            var currentUser = await _userRepository.GetByIdAsync(currentUserId);
            if(currentUser == null || currentUser.Role != Enumerations.Role.Admin)
            {
                return new Response<bool>(
                    StatusCodes.Status403Forbidden,
                    "Chỉ có Admin mới có quyền khóa/mở khóa tài khoản người dùng"
                );
            }
            
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                return new Response<bool>(
                    StatusCodes.Status404NotFound,
                    "Người dùng không tồn tại"
                );
            }

            user.IsBlock = !user.IsBlock;
            user.FailedLoginAttempts = 0;
            await _userRepository.UpdateAsync(user);

            return new Response<bool>(true);
        }
        catch (Exception ex)
        {
            return new Response<bool>(
                StatusCodes.Status500InternalServerError,
                $"Lỗi khi khóa/mở khóa tài khoản: {ex.Message}"
            );
        }
    }
}
