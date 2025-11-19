using Equipment.Domain.Entities;
using Equipment.Domain.Models;
using Equipment.Service.Equipment;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Equipment.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EquipmentController : ControllerBase
{
    private readonly IEquipmentService _equipmentService;
    private readonly IExportEquipmentService _exportEquipmentService;

    public EquipmentController(
        IEquipmentService equipmentService,
        IExportEquipmentService exportEquipmentService
    )
    {
        _equipmentService = equipmentService;
        _exportEquipmentService = exportEquipmentService;
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
    public async Task<ActionResult> CreateOrUpdateEquipment(
        [FromBody] Domain.Entities.Equipment equipment
    )
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

            var res = await _equipmentService.CreateOrUpdateEquipment(
                equipment,
                currentUserId.Value
            );
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
    /// Lấy lịch sử thay đổi của thiết bị
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpGet("{id}/history")]
    public async Task<ActionResult> GetHistory(int id)
    {
        try
        {
            var res = await _equipmentService.GetHistory(id);
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

    /// <summary>
    /// Xuất file danh sách thiết bị
    /// </summary>
    /// <returns></returns>
    [HttpGet("export")]
    public async Task<FileResult> ExportEquipment()
    {
        var file = await _exportEquipmentService.ExportEquipment();
        return File(
            file,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Danh_sach_thiet_bi.xlsx"
        );
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
