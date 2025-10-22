using Equipment.Data.Repositories;
using Equipment.Domain.IRepositories;
using Equipment.Service.Auth;
using Equipment.Service.Equipment;
using Equipment.Service.EquipmentCategory;
using Equipment.Service.User;

namespace Equipment.API.Extensions;

public static class DependencyInjectionExtension
{
    public static void AddDependencyInjection(this IServiceCollection services)
    {
        // Register Services
        services.AddScoped<IEquipmentCategoryService, EquipmentCategoryService>();
        services.AddScoped<IEquipmentService, EquipmentService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IAuthService, AuthService>();
        
        // Register Repositories
        services.AddScoped<IEquipmentCategoryRepository, EquipmentCategoryRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IDepartmentRepository, DepartmentRepository>();
        services.AddScoped<IEquipmentRepository, EquipmentRepository>();
    }
}
