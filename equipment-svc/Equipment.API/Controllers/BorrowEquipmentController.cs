using Equipment.Domain.Entities;
using Equipment.Domain.Models;
using Equipment.Domain.Models.BorrowEquipmentModel;
using Equipment.Service.BorrowEquipment;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Equipment.API.Controllers;

[ApiController]
[Route("api/borrow-equipment")]
[Authorize]
public class BorrowEquipmentController : ControllerBase
{
    private readonly IBorrowEquipmentService _borrowEquipmentService;

    public BorrowEquipmentController(IBorrowEquipmentService borrowEquipmentService)
    {
        _borrowEquipmentService = borrowEquipmentService;
    }

    /// <summary>
    /// Lấy danh sách yêu cầu mượn thiết bị phân trang
    /// </summary>
    /// <param name="param"></param>
    /// <returns></returns>
    [HttpPost("paging")]
    public async Task<ActionResult> GetPaging([FromBody] PaginationParam param)
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
            
            var res = await _borrowEquipmentService.GetPaging(param, currentUserId.Value);
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
    /// Tạo yêu cầu mượn thiết bị / Sửa yêu cầu mượn thiết bị
    /// </summary>
    /// <param name="borrowEquipment"></param>
    /// <returns></returns>
    [HttpPost]
    public async Task<ActionResult> CreateOrUpdateBorrowRequest(
        [FromBody] BorrowEquipment borrowEquipment
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

            var res = await _borrowEquipmentService.CreateOrUpdateBorrowRequest(
                borrowEquipment,
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
                "Xảy ra lỗi trong quá trình xử lý: \n" + ex.Message + ex.StackTrace
            );
        }
    }

    /// <summary>
    /// Trả thiết bị
    /// </summary>
    /// <param name="param"></param>
    /// <returns></returns>
    [HttpPut("return")]
    public async Task<ActionResult> ReturnEquipment([FromBody] ReturnEquipmentModel param)
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

            var res = await _borrowEquipmentService.ReturnEquipment(param, currentUserId.Value);
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
    /// Duyệt yêu cầu mượn thiết bị
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpPut("approve/{id}")]
    public async Task<ActionResult> ApproveBorrowRequest(int id)
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

            var res = await _borrowEquipmentService.ApproveBorrowRequest(id, currentUserId.Value);
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
    /// Từ chối yêu cầu mượn thiết bị
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpPut("reject/{id}")]
    public async Task<ActionResult> RejectBorrowRequest(int id)
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

            var res = await _borrowEquipmentService.RejectBorrowRequest(
                id,
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
                "Xảy ra lỗi trong quá trình xử lý: \n" + ex.Message + ex.StackTrace
            );
        }
    }
    
    /// <summary>
    /// Lấy danh sách yêu cầu mượn thiết bị phân trang để duyệt
    /// </summary>
    /// <param name="param"></param>
    /// <returns></returns>
    [HttpPost("request/paging")]
    public async Task<ActionResult> GetRequestPaging([FromBody] PaginationParam param)
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
            
            var res = await _borrowEquipmentService.GetRequestPaging(param, currentUserId.Value);
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
    /// Lấy thông tin chi tiết yêu cầu mượn thiết bị
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpGet("{id}")]
    public async Task<ActionResult> GetById(int id)
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

            var res = await _borrowEquipmentService.GetById(
                id,
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
