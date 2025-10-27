using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AkAgenda.Api.Data.Migrations
{
    public partial class UpdateTables7 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Agendamento");

            migrationBuilder.DropColumn(
                name: "PriceService",
                table: "Schedule");

            migrationBuilder.DropColumn(
                name: "ServiceTime",
                table: "Schedule");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "PriceService",
                table: "Schedule",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "ServiceTime",
                table: "Schedule",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Agendamento",
                columns: table => new
                {
                    AgendamentoId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ClientName = table.Column<string>(type: "TEXT", nullable: false),
                    Compareceu = table.Column<bool>(type: "INTEGER", nullable: false),
                    DtaHoraAgendamento = table.Column<DateTime>(type: "TEXT", nullable: false),
                    ServicoAgendado = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Agendamento", x => x.AgendamentoId);
                });
        }
    }
}
