using Equipment.Data.Repositories;
using Equipment.Domain.IRepositories;
using Equipment.Service.Equipment;
using Equipment.Service.EquipmentCategory;

namespace Equipment.API.Extensions;

public static class DependencyInjectionExtension
{
    public static void AddDependencyInjection(this IServiceCollection services)
    {
        // Register Services
        services.AddScoped<IEquipmentCategoryService, EquipmentCategoryService>();
        services.AddScoped<IEquipmentService, EquipmentService>();
        
        // Register Repositories
        services.AddScoped<IEquipmentCategoryRepository, EquipmentCategoryRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IDepartmentRepository, DepartmentRepository>();
        services.AddScoped<IEquipmentRepository, EquipmentRepository>();
    }
}
