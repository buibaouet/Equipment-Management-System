using Equipment.Domain.Entities;
using Equipment.Domain.Models;
using Equipment.Service.EquipmentCategory;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Equipment.API.Controllers;

/// <summary>
/// API Danh mục thiết bị
/// </summary>
[Route("api/category")]
[ApiController]
public class EquipmentCategoryController : ControllerBase
{
    private readonly IEquipmentCategoryService _service;

    /// <summary>
    /// EquipmentCategoryController
    /// </summary>
    /// <ParamPaging name="service"></ParamPaging>
    public EquipmentCategoryController(IEquipmentCategoryService service)
    {
        _service = service;
    }

    /// <summary>
    /// Lấy danh sách danh mục đang hoạt động
    /// </summary>
    /// <returns></returns>
    [HttpGet("active")]
    public async Task<IActionResult> GetEquipmentCategoryActive()
    {
        try
        {
            var res = await _service.GetAllActive();
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
    /// Lấy danh sách danh mục thiết bị phân trang
    /// </summary>
    /// <ParamPaging name="param"></ParamPaging>
    /// <returns></returns>
    [HttpPost("paging")]
    public async Task<IActionResult> GetPaging([FromBody] PaginationParam param)
    {
        try
        {
            var res = await _service.GetPaging(param);
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
    /// Tạo mới danh mục thiết bị / Cập nhật thông tin danh mục thiết bị
    /// </summary>
    /// <ParamPaging name="category"></ParamPaging>
    /// <returns></returns>
    [HttpPost]
    public async Task<IActionResult> CreateOrUpdate([FromBody] EquipmentCategory category)
    {
        try
        {
            var res = await _service.CreateOrUpdate(category);
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
    /// Lấy thông tin danh mục theo Id
    /// </summary>
    /// <ParamPaging name="id"></ParamPaging>
    /// <returns></returns>
    [HttpGet("{id}")]
    public async Task<ActionResult> GetById(int id)
    {
        try
        {
            var res = await _service.GetByIdAsync(id);
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
    /// Lấy thông tin danh mục theo Id
    /// </summary>
    /// <ParamPaging name="id"></ParamPaging>
    /// <returns></returns>
    [HttpPut("status/{id}")]
    public async Task<ActionResult> UpdateStatusCategory(int id)
    {
        try
        {
            var res = await _service.UpdateStatusCategory(id);
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
    /// Xóa danh mục thiết bị (soft delete)
    /// </summary>
    /// <ParamPaging name="id"></ParamPaging>
    /// <returns></returns>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteCategory(int id)
    {
        try
        {
            var res = await _service.DeleteCategory(id);
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
