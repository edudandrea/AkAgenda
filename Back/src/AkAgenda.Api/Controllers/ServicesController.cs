using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AkAgenda.Api.Data;
using AkAgenda.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AkAgenda.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ServicesController : ControllerBase
    {
        private readonly DataContext _context;
        public ServicesController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetServices()
        {
            var services = _context.Service.Where(c => !string.IsNullOrEmpty(c.ServiceName)).ToList();
            if(services.Count == 0)            
            {
                return NotFound("Nenhuma Serviço encontrado");
            }
            
            return Ok(services);
        }    

        [HttpGet("{id}")]
        [AllowAnonymous]

        public IActionResult GetServicesByid(int id)
        {
            var service = _context.Service.FirstOrDefault(services => services.ServiceId == id);
            if(service == null)
            {
                return NotFound();
            }
            return Ok(service);
        }

        [HttpGet("name")]
        [AllowAnonymous]
        public IActionResult GetServiceByName(string name)
        {
            var service = _context.Service.FirstOrDefault(services => services.ServiceName == name);
            if(service == null)
            {
                return NotFound();
            }
            return Ok(service);
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> CreateService([FromBody] Services service)
        {
            _context.Service.Add(service);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetServicesByid), new { id = service.ServiceId }, service);

        }

        [HttpPut("{id}")]
        [AllowAnonymous]      
        
        public async Task<IActionResult> UpdateService([FromBody] Services service)
        {
            var serviceToUp = _context.Service.FirstOrDefault(service => service.ServiceId == service.ServiceId);
            if (serviceToUp == null)
            {
                return NotFound();
            }

            serviceToUp.ServiceName = service.ServiceName;
            serviceToUp.ServiceTime = service.ServiceTime;
            serviceToUp.Price = service.Price;
            serviceToUp.ServiceDesc = service.ServiceDesc;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [AllowAnonymous]
        
        public async Task<IActionResult> DeleteService(int id)
        {
            var service = _context.Service.FirstOrDefault(services => services.ServiceId == id);
            if (service == null)
            {
                return NotFound();
            }
            _context.Service.Remove(service);
            await _context.SaveChangesAsync();
            return NoContent();
        }

    }
}