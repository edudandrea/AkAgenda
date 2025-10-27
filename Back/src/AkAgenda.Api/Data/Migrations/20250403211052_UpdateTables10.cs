using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AkAgenda.Api.Data.Migrations
{
    public partial class UpdateTables10 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Attended",
                table: "Schedule",
                type: "INTEGER",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Attended",
                table: "Schedule");
        }
    }
}
