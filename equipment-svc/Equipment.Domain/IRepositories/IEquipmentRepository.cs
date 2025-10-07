using Equipment.Domain.Entities;

namespace Equipment.Domain.IRepositories;

public interface IEquipmentRepository : IBaseRepository<Equipment.Domain.Entities.Equipment>
{
    Task<bool> IsCodeUnique(string code);
}
