using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using AkAgenda.Api.Data;
using AkAgenda.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AkAgenda.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ScheduleController : ControllerBase
    {
        private readonly DataContext _context;
        public ScheduleController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetSchedules()
        {
            var schedules = _context.Schedule.Where(c => !string.IsNullOrEmpty(c.ScheduleDesc)).ToList();
            if (schedules.Count == 0)
            {
                return NotFound("Nenhum Agendamneto encontrado");
            }

            return Ok(schedules);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]

        public IActionResult GetScheduleByid(int id)
        {
            var schedules = _context.Schedule.FirstOrDefault(schedules => schedules.ScheduleId == id);
            if (schedules == null)
            {
                return NotFound();
            }
            return Ok(schedules);
        }

        [HttpGet("client")]
        [AllowAnonymous]
        public IActionResult GetScheduleByClient(string cliente)
        {
            var schedule = _context.Schedule.FirstOrDefault(schedule => schedule.ClientName == cliente);
            if (schedule == null)
            {
                return NotFound();
            }
            return Ok(schedule);
        }

        [HttpGet("schedule")]
        [AllowAnonymous]
        public async Task<IActionResult> GetSchedulesByTopClients([FromQuery] bool topClients = false)
        {
            if (topClients)
            {
                var currentMonth = DateTime.Now.Month;
                var currentYear = DateTime.Now.Year;

                var topClientsList = await _context.Schedule
                    .Where(s => s.ScheduleDate.Month == currentMonth && s.ScheduleDate.Year == currentYear)
                    .GroupBy(s => s.ClientId)
                    .Select(g => new
                    {
                        ClientId = g.Key,
                        ClientName = _context.Client.Where(c => c.ClientId == g.Key).Select(c => c.ClientName).FirstOrDefault(),
                        BookingCount = g.Count()
                    })
                    .OrderByDescending(c => c.BookingCount)
                    .Take(10)
                    .ToListAsync();

                return Ok(topClientsList);
            }

            // Se o parâmetro "topClients" não for passado, retorna todos os agendamentos normalmente
            var schedules = await _context.Schedule.ToListAsync();
            return Ok(schedules);
        }


        [HttpPost]
        [AllowAnonymous]
        public IActionResult CreateSchedule([FromBody] Schedule schedule)
        {
            if (schedule == null)
                return BadRequest("Dados inválidos.");

            if (string.IsNullOrEmpty(schedule.ScheduleDesc))
                return BadRequest(new { error = "O campo scheduleDesc é obrigatório." });            

            // Verifica se já existe agendamento no mesmo horário
            bool exists = _context.Schedule.Any(s =>
                s.ProfessionalId == schedule.ProfessionalId &&
                s.ScheduleDate == schedule.ScheduleDate
            );

            if (exists)
                return Conflict(new { error = "Já existe um agendamento para esse horário com esse profissional." });

            _context.Schedule.Add(schedule);
            _context.SaveChanges();

            return Ok(schedule);
        }

        [HttpGet("agendamentos/ocupados")]
        public IActionResult GetHorariosOcupados(int profissionalId, DateTime data)
        {
            var horarios = _context.Schedule
                .Where(s =>
                    s.ProfessionalId == profissionalId &&
                    s.ScheduleDate.Date == data.Date
                )
                .Select(s => s.ScheduleDate.TimeOfDay)
                .ToList();

            return Ok(horarios);
        }


        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> UpdateSchedule(int id, [FromBody] JsonElement body)
        {
            var scheduleToUpdate = await _context.Schedule.FirstOrDefaultAsync(s => s.ScheduleId == id);

            if (scheduleToUpdate == null)
            {
                return NotFound();
            }

            // Atualizando apenas os campos enviados
            if (body.TryGetProperty("scheduleDate", out var scheduleDateProperty) && scheduleDateProperty.ValueKind == JsonValueKind.String)
            {
                if (DateTime.TryParse(scheduleDateProperty.GetString(), out var scheduleDate))
                {
                    scheduleToUpdate.ScheduleDate = scheduleDate;
                }
            }

            if (body.TryGetProperty("clientId", out var clientIdProperty) && clientIdProperty.ValueKind == JsonValueKind.Number)
            {
                scheduleToUpdate.ClientId = clientIdProperty.GetInt32();
            }

            if (body.TryGetProperty("clientName", out var clientNameProperty) && clientNameProperty.ValueKind == JsonValueKind.String)
            {
                scheduleToUpdate.ClientName = clientNameProperty.GetString();
            }


            if (body.TryGetProperty("scheduleDesc", out var scheduleDescProperty) && scheduleDescProperty.ValueKind == JsonValueKind.String)
            {
                scheduleToUpdate.ScheduleDesc = scheduleDescProperty.GetString();
            }

            if (body.TryGetProperty("serviceId", out var serviceIdProperty) && serviceIdProperty.ValueKind == JsonValueKind.Number)
            {
                scheduleToUpdate.ServiceId = serviceIdProperty.GetInt32();
            }

            if (body.TryGetProperty("professionalId", out var professionalIdProperty) && professionalIdProperty.ValueKind == JsonValueKind.Number)
            {
                scheduleToUpdate.ProfessionalId = professionalIdProperty.GetInt32();
            }

            // 🔹 Atualizando a presença (Attended) se estiver presente no JSON
            if (body.TryGetProperty("attended", out var attendedProperty) && attendedProperty.ValueKind == JsonValueKind.True || attendedProperty.ValueKind == JsonValueKind.False)
            {
                scheduleToUpdate.Attended = attendedProperty.GetBoolean();
            }

            await _context.SaveChangesAsync();
            return Ok(scheduleToUpdate);
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteSchedule(int id)
        {
            var schedule = _context.Schedule.FirstOrDefault(schedule => schedule.ScheduleId == id);
            if (schedule == null)
            {
                return NotFound();
            }
            _context.Schedule.Remove(schedule);
            await _context.SaveChangesAsync();
            return Ok();
        }
        
        [HttpGet("by-date-professional")]
            public async Task<IActionResult> GetSchedulesByDateAndProfessional([FromQuery] DateTime date, [FromQuery] int professionalId)
            {
                var startOfDay = date.Date;
                var endOfDay = date.Date.AddDays(1).AddTicks(-1);

                var schedules = await _context.Schedule
                    .Where(s => s.ProfessionalId == professionalId &&
                                s.ScheduleDate >= startOfDay &&
                                s.ScheduleDate <= endOfDay)
                    .ToListAsync();

                return Ok(schedules);
            }

    }
}