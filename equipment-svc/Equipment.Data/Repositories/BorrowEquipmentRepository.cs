using Equipment.Data.Context;
using Equipment.Domain.Entities;
using Equipment.Domain.IRepositories;

namespace Equipment.Data.Repositories;

public class BorrowEquipmentRepository : BaseRepository<BorrowEquipment>, IBorrowEquipmentRepository
{
    public BorrowEquipmentRepository(ApplicationDbContext dbContext)
        : base(dbContext) { }
}
