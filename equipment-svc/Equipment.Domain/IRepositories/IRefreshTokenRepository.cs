using Equipment.Domain.Entities;

namespace Equipment.Domain.IRepositories;

public interface IRefreshTokenRepository : IBaseRepository<RefreshToken>
{
    Task RevokeAllUserTokens(int userId);
}
