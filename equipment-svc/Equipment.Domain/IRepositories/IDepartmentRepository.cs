using Equipment.Domain.Entities;

namespace Equipment.Domain.IRepositories;

public interface IDepartmentRepository : IBaseRepository<Department>
{
    Task<List<Department>> GetAllActive();
    Task<Department> GetByCode(string code);
    Task<bool> HasUsers(int departmentId);
    Task<bool> HasEquipments(int departmentId);
    Task<int> GetTotalUsers(int departmentId);
}
