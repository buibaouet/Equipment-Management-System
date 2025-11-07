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
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<BorrowEquipment> BorrowEquipments { get; set; }

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
            builder.ToTable("Equipments");

            builder.HasKey(x => x.Id);

            builder.HasIndex(x => x.Code).IsUnique().HasDatabaseName("IX_Equipment_Code");

            // Configure decimal precision for Price
            builder.Property(x => x.Price)
                .HasPrecision(18, 2);
        });

        // Configuration for RefreshToken entity
        modelBuilder.Entity<RefreshToken>(builder =>
        {
            builder.ToTable("RefreshTokens");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Token)
                .IsRequired()
                .HasMaxLength(100);
        });

        // Configuration for BorrowEquipment entity
        modelBuilder.Entity<BorrowEquipment>(builder =>
        {
            builder.ToTable("BorrowEquipments");

            builder.HasKey(x => x.Id);
        });
    }
}
