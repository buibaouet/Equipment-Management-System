using Equipment.Data.Context;
using Equipment.Domain.Entities;
using Equipment.Domain.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace Equipment.Data.Repositories;

public class EquipmentRepository
    : BaseRepository<Equipment.Domain.Entities.Equipment>,
        IEquipmentRepository
{
    public EquipmentRepository(ApplicationDbContext dbContext)
        : base(dbContext) { }

    public async Task<bool> IsCodeUnique(string code)
    {
        return !await DbSet.AnyAsync(e => e.Code == code);
    }
}
