using Equipment.Service.EquipmentCategory;
using Microsoft.AspNetCore.Mvc;

namespace Equipment.API.Controllers;

/// <summary>
/// API Danh mục thiết bị
/// </summary>
[Route("api/equipment-category")]
[ApiController]
public class EquipmentCategoryController : ControllerBase
{
    private readonly IEquipmentCategoryService _service;

    /// <summary>
    /// EquipmentCategoryController
    /// </summary>
    /// <param name="service"></param>
    public EquipmentCategoryController(IEquipmentCategoryService service)
    {
        _service = service;
    }

    /// <summary>
    /// Lấy danh sách danh mục đang hoạt động
    /// </summary>
    /// <returns></returns>
    [HttpPost("active")]
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
                "Xảy ra lỗi trong quá trình xử lý: \n" + ex.Message + ex.StackTrace
            );
        }
    }
}
