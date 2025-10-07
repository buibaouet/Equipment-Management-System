using Equipment.Data.Context;
using Equipment.Domain.Entities;
using Equipment.Domain.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace Equipment.Data.Repositories;

public class UserRepository : BaseRepository<User>, IUserRepository
{
    public UserRepository(ApplicationDbContext dbContext) : base(dbContext)
    {
    }
}
