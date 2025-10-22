using Equipment.Domain.Models.User;
using Equipment.Service.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Equipment.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// Đăng nhập hệ thống
    /// </summary>
    /// <param name="loginModel"></param>
    /// <returns></returns>
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult> Login(LoginModel loginModel)
    {
        try
        {
            var res = await _authService.HandleLogin(loginModel);
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
