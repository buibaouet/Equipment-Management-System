using Equipment.Domain.Entities;
using Equipment.Domain.Models;
using Equipment.Service.Department;
using Microsoft.AspNetCore.Mvc;

namespace Equipment.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DepartmentController : ControllerBase
{
    private readonly IDepartmentService _departmentService;

    public DepartmentController(IDepartmentService departmentService)
    {
        _departmentService = departmentService;
    }

    /// <summary>
    /// Lấy danh sách phòng ban đang hoạt động
    /// </summary>
    /// <returns></returns>
    [HttpGet("active")]
    public async Task<ActionResult> GetAllActive()
    {
        try
        {
            var res = await _departmentService.GetAllActive();
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
    /// Lấy danh sách phòng ban phân trang
    /// </summary>
    /// <param name="param"></param>
    /// <returns></returns>
    [HttpPost("paging")]
    public async Task<ActionResult> GetPaging([FromBody] PaginationParam param)
    {
        try
        {
            var res = await _departmentService.GetPaging(param);
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
    /// Tạo mới / Cập nhật thông tin phòng ban
    /// </summary>
    /// <param name="department"></param>
    /// <returns></returns>
    [HttpPost]
    public async Task<IActionResult> CreateOrUpdate([FromBody] Department department)
    {
        try
        {
            var res = await _departmentService.CreateOrUpdate(department);
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
    /// Lấy thông tin phòng ban theo Id
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpGet("{id}")]
    public async Task<ActionResult> GetById(int id)
    {
        try
        {
            var res = await _departmentService.GetByIdAsync(id);
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
    /// cập nhật trạng thái phòng ban
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpPut("status/{id}")]
    public async Task<ActionResult> UpdateStatusDepartment(int id)
    {
        try
        {
            var res = await _departmentService.UpdateStatusDepartment(id);
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
}
