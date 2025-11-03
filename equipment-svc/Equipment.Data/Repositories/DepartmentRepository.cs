using Equipment.Data.Context;
using Equipment.Domain.Entities;
using Equipment.Domain.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace Equipment.Data.Repositories;

public class DepartmentRepository : BaseRepository<Department>, IDepartmentRepository
{
    private readonly ApplicationDbContext _context;

    public DepartmentRepository(ApplicationDbContext dbContext)
        : base(dbContext)
    {
        _context = dbContext;
    }

    public async Task<List<Department>> GetAllActive()
    {
        return await _context.Departments.Where(d => d.IsActive).OrderBy(d => d.Code).ToListAsync();
    }

    public async Task<Department> GetByCode(string code)
    {
        return await _context.Departments.FirstOrDefaultAsync(d =>
            d.Code.ToLower() == code.ToLower()
        );
    }

    public async Task<bool> HasUsers(int departmentId)
    {
        return await _context.Users.AnyAsync(u => u.DepartmentId == departmentId);
    }

    public async Task<bool> HasEquipments(int departmentId)
    {
        return await _context.Equipments.AnyAsync(e => e.DepartmentId == departmentId);
    }

    public async Task<List<Department>> GetByIds(List<int> ids)
    {
        return await _context.Departments.Where(d => ids.Contains(d.Id)).ToListAsync();
    }

    public async Task<int> GetTotalUsers(int departmentId)
    {
        return await _context.Users.CountAsync(u => u.DepartmentId == departmentId);
    }

    public async Task<int> GetTotalEquipments(int departmentId)
    {
        return await _context.Equipments.CountAsync(e => e.DepartmentId == departmentId);
    }
}
