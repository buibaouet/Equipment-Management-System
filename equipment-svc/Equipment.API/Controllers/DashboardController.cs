using Equipment.Domain.Constant;
using Equipment.Service.Dashboard;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Equipment.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    /// <summary>
    /// Lấy dữ liệu dashboard
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    public async Task<ActionResult> GetDashboardData()
    {
        try
        {
            var res = await _dashboardService.GetDashboardDataAsync();
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
    /// Lấy dữ liệu dashboard mượn
    /// </summary>
    /// <param name="periodType">Loại chu kỳ: 1 = Tuần, 2 = Tháng, 3 = Quý</param>
    /// <returns></returns>
    [HttpGet("borrow-chart")]
    public async Task<ActionResult> GetDashboardBorrow([FromQuery] Enumerations.ChartPeriodType periodType = Enumerations.ChartPeriodType.Week)
    {
        try
        {
            var res = await _dashboardService.GetDashboardBorrowAsync(periodType);
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
