using Equipment.Domain.Constant;
using Equipment.Domain.Models;
using Equipment.Domain.Models.ReponseModel;
using Equipment.Domain.Models.User;

namespace Equipment.Service.User;

public interface IUserService
{
    Task<Response<PagingDataModel<ManaUserResponseModel>>> GetPaging(PaginationParam param);
    Task<Response<UpdateUserResponseModel>> UpdateUserAsync(int id, UpdateUserModel model);
    Task<Response<CreateUserResponseModel>> AddNewUserByAdmin(int userId, CreateUserByAdminInput model);
    Task<Response<bool>> UpdateUserRoleDepartmentAsync(int id, UpdateRoleDepartmentUserModel param);
    Task<Response<UserResponseModel>> GetUserByIdAsync(int id);
    Task<Response<List<UserNameModel>>> GetListManager();
    Task<Response<List<UserNameModel>>> GetListUserActive();
}
