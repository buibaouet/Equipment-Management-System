using Equipment.Data.Context;
using Equipment.Domain.Entities;
using Equipment.Domain.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace Equipment.Data.Repositories;

public class EquipmentCategoryRepository : BaseRepository<EquipmentCategory>, IEquipmentCategoryRepository
{
    public EquipmentCategoryRepository(ApplicationDbContext dbContext) : base(dbContext)
    {
    }

}
