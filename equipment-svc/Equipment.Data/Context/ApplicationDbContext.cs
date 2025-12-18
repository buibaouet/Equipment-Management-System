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
    public DbSet<EquipmentHistory> EquipmentHistories { get; set; }
    public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }

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

            builder.Property(x => x.IsDelete)
                .HasDefaultValue(false);
        });

        // Configuration for User entity
        modelBuilder.Entity<User>(builder =>
        {
            builder.ToTable("Users");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.IsDelete)
                .HasDefaultValue(false);
        });

        // Configuration for Department entity
        modelBuilder.Entity<Department>(builder =>
        {
            builder.ToTable("Departments");

            builder.HasKey(x => x.Id);

            // Create unique index on Code
            builder.HasIndex(x => x.Code).IsUnique().HasDatabaseName("IX_Department_Code");

            builder.Property(x => x.IsDelete)
                .HasDefaultValue(false);
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

            builder.Property(x => x.IsDelete)
                .HasDefaultValue(false);
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

        // Configuration for PasswordResetToken entity
        modelBuilder.Entity<PasswordResetToken>(builder =>
        {
            builder.ToTable("PasswordResetTokens");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.OtpCode)
                .IsRequired()
                .HasMaxLength(10);

            builder.Property(x => x.Email)
                .IsRequired()
                .HasMaxLength(256);
        });

        // Configuration for BorrowEquipment entity
        modelBuilder.Entity<BorrowEquipment>(builder =>
        {
            builder.ToTable("BorrowEquipments");

            builder.HasKey(x => x.Id);
        });

        modelBuilder.Entity<EquipmentHistory>(builder =>
        {
            builder.ToTable("EquipmentHistories");

            builder.HasKey(x => x.Id);

            builder.HasIndex(x => x.EquipmentId)
                .HasDatabaseName("IX_EquipmentHistories_EquipmentId");

            builder.Property(x => x.Action)
                .IsRequired();

            builder.Property(x => x.Description)
                .HasMaxLength(1000);
        });
    }
}
