using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AkAgenda.Api.Data.Migrations
{
    public partial class UpdateTables5 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Agendamento",
                columns: table => new
                {
                    AgendamentoId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ClienteName = table.Column<string>(type: "TEXT", nullable: false),
                    DtaHoraAgendamento = table.Column<DateTime>(type: "TEXT", nullable: false),
                    ServicoAgendado = table.Column<string>(type: "TEXT", nullable: false),
                    Compareceu = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Agendamento", x => x.AgendamentoId);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Agendamento");
        }
    }
}
