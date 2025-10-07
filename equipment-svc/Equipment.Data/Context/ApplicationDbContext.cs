using Equipment.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Equipment.Data.Context;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<EquipmentCategory> EquipmentCategories { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Department> Departments { get; set; }
    public DbSet<Equipment.Domain.Entities.Equipment> Equipments { get; set; } 

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuration for EquipmentCategory entity
        modelBuilder.Entity<EquipmentCategory>(builder =>
        {
            builder.ToTable("EquipmentCategories");

            builder.HasKey(x => x.Id);

            builder
                .HasIndex(x => x.Name)
                .HasDatabaseName("IX_EquipmentCategory_EquipmentCategoryName");
        });

        // Configuration for User entity
        modelBuilder.Entity<User>(builder =>
        {
            builder.ToTable("Users");

            builder.HasKey(x => x.Id);

            builder
                .HasOne(x => x.Department)
                .WithMany()
                .HasForeignKey(x => x.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configuration for Department entity
        modelBuilder.Entity<Department>(builder =>
        {
            builder.ToTable("Departments");

            builder.HasKey(x => x.Id);

            // Create unique index on Code
            builder.HasIndex(x => x.Code).IsUnique().HasDatabaseName("IX_Department_Code");
        });

        // Configuration for Equipment entity
        modelBuilder.Entity<Equipment.Domain.Entities.Equipment>(builder =>
        {
            builder.ToTable("Equipment");

            builder.HasKey(x => x.Id);

            builder.HasIndex(x => x.Code).IsUnique().HasDatabaseName("IX_Equipment_Code");

            // Configure relationships
            builder
                .HasOne(x => x.Category)
                .WithMany()
                .HasForeignKey(x => x.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            builder
                .HasOne(x => x.Department)
                .WithMany()
                .HasForeignKey(x => x.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);

            builder
                .HasOne(x => x.User)
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.SetNull);
        });
    }
}
