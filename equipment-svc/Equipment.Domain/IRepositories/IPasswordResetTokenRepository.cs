using Equipment.Domain.Entities;

namespace Equipment.Domain.IRepositories;

public interface IPasswordResetTokenRepository : IBaseRepository<PasswordResetToken>
{
    Task InvalidateUserTokensAsync(int userId);
}


