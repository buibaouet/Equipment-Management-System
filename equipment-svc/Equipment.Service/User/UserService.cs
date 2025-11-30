using Equipment.Domain.Constant;
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

    public UserService(IUserRepository userRepository, IDepartmentRepository departmentRepository)
    {
        _userRepository = userRepository;
        _departmentRepository = departmentRepository;
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
        };
    }
}
