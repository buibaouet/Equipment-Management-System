using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Equipment.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDatabase20251124 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ReasonBroken",
                table: "Equipments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SolutionBroken",
                table: "Equipments",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReasonBroken",
                table: "Equipments");

            migrationBuilder.DropColumn(
                name: "SolutionBroken",
                table: "Equipments");
        }
    }
}
