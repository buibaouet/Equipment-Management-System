using System.Linq.Dynamic.Core;
using Equipment.Domain.IRepositories;
using Equipment.Domain.Models;
using Equipment.Domain.Models.Category;
using Equipment.Domain.Models.ReponseModel;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Equipment.Service.EquipmentCategory;

public class EquipmentCategoryService : IEquipmentCategoryService
{
    private readonly IEquipmentCategoryRepository _repository;
    private readonly IEquipmentRepository _equipmentRepository;

    public EquipmentCategoryService(
        IEquipmentCategoryRepository repository,
        IEquipmentRepository equipmentRepository
    )
    {
        _repository = repository;
        _equipmentRepository = equipmentRepository;
    }

    public async Task<Response<List<Domain.Entities.EquipmentCategory>>> GetAllActive()
    {
        var activeCategories = await _repository.GetListAsync(ec => ec.IsActive).ToListAsync();
        return new Response<List<Domain.Entities.EquipmentCategory>>(activeCategories);
    }

    public async Task<Response<PagingDataModel<CategoryPagingModel>>> GetPaging(
        PaginationParam param
    )
    {
        try
        {
            var resultData = new PagingDataModel<CategoryPagingModel>();

            var pagingData = await _repository.GetPagingAsync<Domain.Entities.EquipmentCategory>(
                param
            );

            foreach (var item in pagingData.Data)
            {
                var quantityEquipment = await _equipmentRepository.CountAsync(x =>
                    x.DepartmentId == item.Id
                );
                var departmentModel = new CategoryPagingModel
                {
                    Id = item.Id,
                    Code = item.Code,
                    Name = item.Name,
                    IsActive = item.IsActive,
                    Quantity = quantityEquipment,
                    CreatedDate = item.CreatedDate,
                    UpdatedDate = item.UpdatedDate,
                };
                resultData.Data.Add(departmentModel);
            }

            resultData.TotalPages = pagingData.TotalPages;
            resultData.TotalRecords = pagingData.TotalRecords;

            return new Response<PagingDataModel<CategoryPagingModel>>(resultData);
        }
        catch (Exception ex)
        {
            return new Response<PagingDataModel<CategoryPagingModel>>(
                StatusCodes.Status500InternalServerError,
                $"Error during paging: {ex.Message}"
            );
        }
    }

    public async Task<Response<CategoryResponseModel>> CreateOrUpdate(
        Domain.Entities.EquipmentCategory category
    )
    {
        try
        {
            // Check if category with same code exists
            var exists = await _repository.ExistAsync(x =>
                x.Code.Trim() == category.Code.Trim() && x.Id != category.Id
            );

            if (exists)
            {
                return new Response<CategoryResponseModel>(
                    new CategoryResponseModel()
                    {
                        IsSuccess = false,
                        CodeError = "Mã danh mục đã tồn tại",
                    }
                );
            }

            // Thêm mới
            if (category.Id == 0)
            {
                category.IsActive = true;
                await _repository.CreateAsync(category);
            }
            else // Cập nhật
            {
                var existingCategory = await _repository.GetByIdAsync(category.Id);

                if (existingCategory == null)
                {
                    return new Response<CategoryResponseModel>(
                        StatusCodes.Status404NotFound,
                        "Danh mục thiết bị không tồn tại"
                    );
                }

                existingCategory.Code = category.Code;
                existingCategory.Name = category.Name;
                existingCategory.Description = category.Description;
                existingCategory.IsActive = category.IsActive;

                await _repository.UpdateAsync(existingCategory);
            }

            return new Response<CategoryResponseModel>(
                new CategoryResponseModel() { IsSuccess = true }
            );
        }
        catch (Exception ex)
        {
            return new Response<CategoryResponseModel>(
                StatusCodes.Status500InternalServerError,
                $"Error creating category: {ex.Message}"
            );
        }
    }

    public async Task<Response<Domain.Entities.EquipmentCategory>> GetByIdAsync(int id)
    {
        try
        {
            var entity = await _repository.GetByIdAsync(id);

            return new Response<Domain.Entities.EquipmentCategory>(entity);
        }
        catch (Exception ex)
        {
            return new Response<Domain.Entities.EquipmentCategory>(
                StatusCodes.Status500InternalServerError,
                $"Error category: {ex.Message}"
            );
        }
    }

    public async Task<Response<bool>> UpdateStatusCategory(int id)
    {
        try
        {
            var entity = await _repository.GetByIdAsync(id);

            if (entity == null)
            {
                return new Response<bool>(
                    StatusCodes.Status404NotFound,
                    "Danh mục thiết bị không tồn tại"
                );
            }

            entity.IsActive = !entity.IsActive;
            await _repository.UpdateAsync(entity);

            return new Response<bool>(true);
        }
        catch (Exception ex)
        {
            return new Response<bool>(
                StatusCodes.Status500InternalServerError,
                $"Error category: {ex.Message}"
            );
        }
    }
}
