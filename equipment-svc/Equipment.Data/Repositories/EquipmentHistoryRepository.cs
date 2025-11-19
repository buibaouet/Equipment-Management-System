using Equipment.Data.Context;
using Equipment.Domain.Entities;
using Equipment.Domain.IRepositories;

namespace Equipment.Data.Repositories;

public class EquipmentHistoryRepository : BaseRepository<EquipmentHistory>, IEquipmentHistoryRepository
{
    public EquipmentHistoryRepository(ApplicationDbContext dbContext)
        : base(dbContext)
    {
    }
}

