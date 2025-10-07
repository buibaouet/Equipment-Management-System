using System.Linq.Expressions;
using Equipment.Domain.IRepositories;
using Equipment.Domain.Models;
using Equipment.Domain.Models.ReponseModel;
using Microsoft.AspNetCore.Http;

namespace Equipment.Service.Equipment;

public class EquipmentService : IEquipmentService
{
    private readonly IEquipmentRepository _equipmentRepository;

    public EquipmentService(IEquipmentRepository equipmentRepository)
    {
        _equipmentRepository = equipmentRepository;
    }

    public async Task<Response<Domain.Entities.Equipment>> GetById(int id)
    {
        var entity = await _equipmentRepository.GetById(id);

        if (entity is null)
        {
            return new Response<Domain.Entities.Equipment>(StatusCodes.Status404NotFound);
        }

        return new Response<Domain.Entities.Equipment>(entity);
    }

    public async Task<Response<PagingDataModel<Domain.Entities.Equipment>>> GetPaging(
        EquipmentPagingParam param
    )
    {
        Expression<Func<Domain.Entities.Equipment, bool>> expression = equipment =>
            equipment.Id > 0
            && (
                (param.CategoryId == null)
                || (equipment.CategoryId == param.CategoryId && param.Status == null)
                || (equipment.Status == param.Status && param.DepartmentId == null)
                || (equipment.DepartmentId == param.DepartmentId)
            );

        var pagingData = await _equipmentRepository.GetPagingAsync(param, expression);

        return new Response<PagingDataModel<Domain.Entities.Equipment>>(pagingData);
    }

    public async Task<Response<Domain.Entities.Equipment>> Create(
        Domain.Entities.Equipment equipment
    )
    {
        // Validate unique code
        if (!await _equipmentRepository.IsCodeUnique(equipment.Code))
        {
            return new Response<Domain.Entities.Equipment>(StatusCodes.Status409Conflict);
        }

        var entity = await _equipmentRepository.CreateAsync(equipment);

        return new Response<Domain.Entities.Equipment>(entity);
    }

    public async Task<Response<Domain.Entities.Equipment>> Update(
        Domain.Entities.Equipment equipment
    )
    {
        var existing = await _equipmentRepository.GetById(equipment.Id);
        if (existing == null)
        {
            return new Response<Domain.Entities.Equipment>(StatusCodes.Status404NotFound);
        }

        // Check if code is changed and validate uniqueness
        if (
            existing.Code != equipment.Code
            && !await _equipmentRepository.IsCodeUnique(equipment.Code)
        )
        {
            return new Response<Domain.Entities.Equipment>(StatusCodes.Status409Conflict);
        }

        var entity = await _equipmentRepository.UpdateAsync(equipment);

        return new Response<Domain.Entities.Equipment>(entity);
    }

    public async Task<Response<bool>> Delete(int id)
    {
        var result = await _equipmentRepository.DeleteByIdAsync(id);

        return new Response<bool>(result);
    }
}
