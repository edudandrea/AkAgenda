using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AkAgenda.Api.Data.Migrations
{
    public partial class UpdateTables8 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ServiceName",
                table: "Schedule");

            migrationBuilder.AddColumn<int>(
                name: "ServiceId",
                table: "Schedule",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ServiceId",
                table: "Schedule");

            migrationBuilder.AddColumn<string>(
                name: "ServiceName",
                table: "Schedule",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }
    }
}
