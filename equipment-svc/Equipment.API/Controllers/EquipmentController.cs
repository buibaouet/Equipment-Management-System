using Equipment.Domain.Entities;
using Equipment.Domain.Models;
using Equipment.Service.Equipment;
using Microsoft.AspNetCore.Mvc;

namespace Equipment.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EquipmentController : ControllerBase
{
    private readonly IEquipmentService _equipmentService;

    public EquipmentController(IEquipmentService equipmentService)
    {
        _equipmentService = equipmentService;
    }

    /// <summary>
    /// Lấy thông tin thiết bị theo Id
    /// </summary>
    /// <ParamPaging name="id"></ParamPaging>
    /// <returns></returns>
    [HttpGet("{id}")]
    public async Task<ActionResult> GetById(int id)
    {
        try
        {
            var res = await _equipmentService.GetById(id);
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
    /// Lấy danh sách thiết bị phân trang
    /// </summary>
    /// <ParamPaging name="param"></ParamPaging>
    /// <returns></returns>
    [HttpPost("paging")]
    public async Task<ActionResult> GetPaging([FromBody] EquipmentPagingParam param)
    {
        try
        {
            var res = await _equipmentService.GetPaging(param);
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
    /// Tạo mới thiết bị / Cập nhật thông tin thiết bị
    /// </summary>
    /// <ParamPaging name="equipment"></ParamPaging>
    /// <returns></returns>
    [HttpPost]
    public async Task<ActionResult> CreateOrUpdateEquipment([FromBody] Domain.Entities.Equipment equipment)
    {
        try
        {
            var res = await _equipmentService.CreateOrUpdateEquipment(equipment);
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
    /// Lấy danh sách thiết bị còn sẵn
    /// </summary>
    /// <returns></returns>
    [HttpGet("available")]
    public async Task<ActionResult> GetListEquipmentAvaiable()
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
            
            var res = await _equipmentService.GetListEquipmentAvaiable(currentUserId.Value);
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
    /// Lấy danh sách thiết bị phân trang thiet bị của tôi
    /// </summary>
    /// <ParamPaging name="param"></ParamPaging>
    /// <returns></returns>
    [HttpPost("me/paging")]
    public async Task<ActionResult> GetPagingMyEquipment([FromBody] PaginationParam param)
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
            
            var res = await _equipmentService.GetPagingMyEquipment(param, currentUserId.Value);
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
