using Equipment.Domain.Constant;
using Equipment.Domain.Models;
using Equipment.Domain.Models.User;
using Equipment.Service.User;
using Microsoft.AspNetCore.Mvc;

namespace Equipment.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }
    
    /// <summary>
    /// Lấy danh sách người dùng phân trang
    /// </summary>
    /// <ParamPaging name="param"></ParamPaging>
    /// <returns></returns>
    [HttpPost("paging")]
    public async Task<ActionResult> GetPaging([FromBody] PaginationParam param)
    {
        try
        {
            var res = await _userService.GetPaging(param);
            if (res.StatusCode != StatusCodes.Status200OK)
            {
                return StatusCode(res.StatusCode, res.Message);
            }
            return Ok(res);
        }
        catch (Exception ex)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                "Xảy ra lỗi trong quá trình xử lý: \n" + ex.Message + ex.StackTrace
            );
        }
    }
    
    /// <summary>
    /// Thêm mới người dùng bởi Admin
    /// </summary>
    /// <ParamPaging name="param"></ParamPaging>
    /// <returns></returns>
    [HttpPost]
    public async Task<ActionResult> AddNewUserByAdmin([FromBody] CreateUserByAdminInput param)
    {
        try
        {
            var currentUserId = GetCurrentUserId();
            if (currentUserId == null)
            {
                return StatusCode(
                    StatusCodes.Status401Unauthorized,
                    "Không thể xác định người dùng"
                );
            }
            
            var res = await _userService.AddNewUserByAdmin((int)currentUserId, param);
            if (res.StatusCode != StatusCodes.Status200OK)
            {
                return StatusCode(res.StatusCode, res.Message);
            }
            return Ok(res);
        }
        catch (Exception ex)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                "Xảy ra lỗi trong quá trình xử lý: \n" + ex.Message + ex.StackTrace
            );
        }
    }

    /// <summary>
    /// Lấy thông tin người dùng theo Id
    /// </summary>
    /// <ParamPaging name="id"></ParamPaging>
    /// <returns></returns>
    [HttpGet("{id}")]
    public async Task<ActionResult> GetById(int id)
    {
        try
        {
            var res = await _userService.GetUserByIdAsync(id);
            if (res.StatusCode != StatusCodes.Status200OK)
            {
                return StatusCode(res.StatusCode, res.Message);
            }
            return Ok(res);
        }
        catch (Exception ex)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                "Xảy ra lỗi trong quá trình xử lý: \n" + ex.Message + ex.StackTrace
            );
        }
    }

    /// <summary>
    /// Cập nhật thông tin người dùng
    /// </summary>
    /// <ParamPaging name="id"></ParamPaging>
    /// <ParamPaging name="model"></ParamPaging>
    /// <returns></returns>
    [HttpPut("{id}")]
    public async Task<ActionResult> Update(int id, [FromBody] UpdateUserModel model)
    {
        try
        {
            var res = await _userService.UpdateUserAsync(id, model);
            if (res.StatusCode != StatusCodes.Status200OK)
            {
                return StatusCode(res.StatusCode, res.Message);
            }
            return Ok(res);
        }
        catch (Exception ex)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                "Xảy ra lỗi trong quá trình xử lý: \n" + ex.Message + ex.StackTrace
            );
        }
    }

    /// <summary>
    /// Cập nhật vai trò và phòng ban người dùng
    /// </summary>
    /// <ParamPaging name="id"></ParamPaging>
    /// <ParamPaging name="param"></ParamPaging>
    /// <returns></returns>
    [HttpPut("role-department/{id}")]
    public async Task<ActionResult> UpdateRole(int id, [FromBody] UpdateRoleDepartmentUserModel param)
    {
        try
        {
            var res = await _userService.UpdateUserRoleDepartmentAsync(id, param);
            if (res.StatusCode != StatusCodes.Status200OK)
            {
                return StatusCode(res.StatusCode, res.Message);
            }
            return Ok(res);
        }
        catch (Exception ex)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                "Xảy ra lỗi trong quá trình xử lý: \n" + ex.Message + ex.StackTrace
            );
        }
    }
    
    /// <summary>
    /// Lấy danh sách quản lý
    /// </summary>
    /// <returns></returns>
    [HttpGet("managers")]
    public async Task<ActionResult> GetListManager()
    {
        try
        {
            var res = await _userService.GetListManager();
            if (res.StatusCode != StatusCodes.Status200OK)
            {
                return StatusCode(res.StatusCode, res.Message);
            }
            return Ok(res);
        }
        catch (Exception ex)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                "Xảy ra lỗi trong quá trình xử lý: \n" + ex.Message + ex.StackTrace
            );
        }
    }
    
    /// <summary>
    /// Lấy danh sách user active
    /// </summary>
    /// <returns></returns>
    [HttpGet("active")]
    public async Task<ActionResult> GetListUserActive()
    {
        try
        {
            var res = await _userService.GetListUserActive();
            if (res.StatusCode != StatusCodes.Status200OK)
            {
                return StatusCode(res.StatusCode, res.Message);
            }
            return Ok(res);
        }
        catch (Exception ex)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                "Xảy ra lỗi trong quá trình xử lý: \n" + ex.Message + ex.StackTrace
            );
        }
    }
    
    private int? GetCurrentUserId()
    {
        // JWT token stores user ID in "sub" claim (JwtRegisteredClaimNames.Sub)
        var userIdClaim =
            User.FindFirst("sub")
            ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
        {
            return userId;
        }
        return null;
    }
}
