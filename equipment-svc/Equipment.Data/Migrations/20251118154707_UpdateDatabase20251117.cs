using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Equipment.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDatabase20251117 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProcessingForm",
                table: "BorrowEquipments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ReturnedDate",
                table: "BorrowEquipments",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "StatusAfterReturn",
                table: "BorrowEquipments",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProcessingForm",
                table: "BorrowEquipments");

            migrationBuilder.DropColumn(
                name: "ReturnedDate",
                table: "BorrowEquipments");

            migrationBuilder.DropColumn(
                name: "StatusAfterReturn",
                table: "BorrowEquipments");
        }
    }
}
