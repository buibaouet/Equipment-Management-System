using System.Linq.Dynamic.Core;
using Equipment.Domain.IRepositories;
using Equipment.Domain.Models.ReponseModel;
using Microsoft.EntityFrameworkCore;

namespace Equipment.Service.EquipmentCategory;

public class EquipmentCategoryService : IEquipmentCategoryService
{
    private readonly IEquipmentCategoryRepository _repository;

    public EquipmentCategoryService(IEquipmentCategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task<Response<List<Domain.Entities.EquipmentCategory>>> GetAllActive()
    {
        var activeCategories = await _repository.GetListAsync(ec => ec.IsActive).ToListAsync();

        return new Response<List<Domain.Entities.EquipmentCategory>>(activeCategories);
    }
}
