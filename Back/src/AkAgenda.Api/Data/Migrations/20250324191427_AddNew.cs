using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AkAgenda.Api.Data.Migrations
{
    public partial class AddNew : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProfessionalId",
                table: "Schedule",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AnamneseId",
                table: "Client",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Facebook",
                table: "Client",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Instagram",
                table: "Client",
                type: "TEXT",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfessionalId",
                table: "Schedule");

            migrationBuilder.DropColumn(
                name: "AnamneseId",
                table: "Client");

            migrationBuilder.DropColumn(
                name: "Facebook",
                table: "Client");

            migrationBuilder.DropColumn(
                name: "Instagram",
                table: "Client");
        }
    }
}
