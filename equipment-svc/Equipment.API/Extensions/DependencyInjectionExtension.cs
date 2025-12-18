using Equipment.Data.Repositories;
using Equipment.Domain.IRepositories;
using Equipment.Service.Auth;
using Equipment.Service.BorrowEquipment;
using Equipment.Service.Dashboard;
using Equipment.Service.Department;
using Equipment.Service.Equipment;
using Equipment.Service.EquipmentCategory;
using Equipment.Service.EquipmentHistory;
using Equipment.Service.User;
using Equipment.Service.Email;

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
        services.AddScoped<IDepartmentService, DepartmentService>();
        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<IBorrowEquipmentService, BorrowEquipmentService>();
        services.AddScoped<IEquipmentHistoryService, EquipmentHistoryService>();
        services.AddScoped<IExportEquipmentService, ExportEquipmentService>();
        services.AddScoped<IDashboardService, DashboardService>();
        
        // Register Repositories
        services.AddScoped<IEquipmentCategoryRepository, EquipmentCategoryRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IDepartmentRepository, DepartmentRepository>();
        services.AddScoped<IEquipmentRepository, EquipmentRepository>();
        services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
        services.AddScoped<IBorrowEquipmentRepository, BorrowEquipmentRepository>();
        services.AddScoped<IEquipmentHistoryRepository, EquipmentHistoryRepository>();
        services.AddScoped<IPasswordResetTokenRepository, PasswordResetTokenRepository>();
        services.AddScoped<IEmailSender, EmailSender>();
    }
}
