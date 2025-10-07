using Equipment.Data.Context;
using Equipment.Domain.Entities;
using Equipment.Domain.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace Equipment.Data.Repositories;

public class DepartmentRepository : BaseRepository<Department>, IDepartmentRepository
{
    public DepartmentRepository(ApplicationDbContext dbContext) : base(dbContext)
    {
    }
}
