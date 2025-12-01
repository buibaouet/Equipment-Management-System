using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Equipment.Data.Migrations
{
    /// <inheritdoc />
    public partial class _20251201123637_AddIsDeleteColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDelete",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDelete",
                table: "RefreshTokens",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDelete",
                table: "Equipments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDelete",
                table: "EquipmentHistories",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDelete",
                table: "EquipmentCategories",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDelete",
                table: "Departments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDelete",
                table: "BorrowEquipments",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDelete",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "IsDelete",
                table: "RefreshTokens");

            migrationBuilder.DropColumn(
                name: "IsDelete",
                table: "Equipments");

            migrationBuilder.DropColumn(
                name: "IsDelete",
                table: "EquipmentHistories");

            migrationBuilder.DropColumn(
                name: "IsDelete",
                table: "EquipmentCategories");

            migrationBuilder.DropColumn(
                name: "IsDelete",
                table: "Departments");

            migrationBuilder.DropColumn(
                name: "IsDelete",
                table: "BorrowEquipments");
        }
    }
}
