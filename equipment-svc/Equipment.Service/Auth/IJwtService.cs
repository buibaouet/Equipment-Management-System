using System.Security.Claims;
using Equipment.Domain.Entities;

namespace Equipment.Service.Auth;

public interface IJwtService
{
    string GenerateToken(Domain.Entities.User user);
    RefreshToken GenerateRefreshToken(int userId);
    ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
}