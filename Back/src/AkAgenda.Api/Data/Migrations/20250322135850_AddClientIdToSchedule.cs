using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AkAgenda.Api.Data.Migrations
{
    public partial class AddClientIdToSchedule : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ClientId",
                table: "Schedule",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "PhoneNumber",
                table: "Client",
                type: "TEXT",
                maxLength: 11,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldMaxLength: 11);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClientId",
                table: "Schedule");

            migrationBuilder.AlterColumn<int>(
                name: "PhoneNumber",
                table: "Client",
                type: "INTEGER",
                maxLength: 11,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldMaxLength: 11);
        }
    }
}
