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
    public class ClientsController : ControllerBase
    {
        private readonly DataContext _context;
        public ClientsController(DataContext context)
        {
            _context = context;
        }    

        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetClients()
        {
            var client = _context.Client.Where(c => !string.IsNullOrEmpty(c.ClientName)).ToList();
            if(client.Count == 0)            
            {
                return NotFound("Nenhum cliente encontrado");
            }
            
            return Ok(client);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public IActionResult GetClientsById(int id)
        {
            var client = _context.Client.FirstOrDefault(client => client.ClientId == id);
            if(client == null)
            {
                return NotFound();
            }
            
            
            return Ok(client);
        }

        [HttpGet("name")]
        [AllowAnonymous]
        public IActionResult GetClientByName(string name)
        {
            var client = _context.Client.FirstOrDefault(clients => clients.ClientName == name);
            if(client == null)
            {
                return NotFound();
            }
            return Ok(client);
        }

        [HttpGet("phone")]
        [AllowAnonymous]
        public IActionResult GetClientByPhone(string phone)
        {
            var client = _context.Client.FirstOrDefault(clients => clients.PhoneNumber == phone);
            if(client == null)
            {
                return NotFound();
            }
            return Ok(client);
            
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> CreateClient([FromBody]Clients client)
        {
            if(client == null)
            {
                return BadRequest();
            }            
                var anamneseExist = _context.Anamnese.FirstOrDefault(anamnse => anamnse.AnamneseId == client.AnamneseId);
                if(anamneseExist == null)
                {
                    return BadRequest("Anamnse não encontrada");
                }
            
            _context.Client.Add(client);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetClients), new {id = client.ClientId}, client);
        }

        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> UpdateClient([FromBody]Clients client)
        {
            var clientToUpdate = _context.Client.FirstOrDefault(clients => clients.ClientId == client.ClientId);
            if(clientToUpdate == null)
            {
                return NotFound();
            }

                clientToUpdate.ClientName = client.ClientName;
                clientToUpdate.Address = client.Address;
                clientToUpdate.City = client.City;
                clientToUpdate.State = client.State;
                clientToUpdate.PhoneNumber = client.PhoneNumber;
                clientToUpdate.Profession = client.Profession;
                clientToUpdate.ClientEmail = client.ClientEmail;
                clientToUpdate.Instagram = client.Instagram;
                clientToUpdate.Facebook = client.Facebook;
                clientToUpdate.AnamneseId = client.AnamneseId;    
                await _context.SaveChangesAsync();
                return NoContent();
        }

        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteClientById(int id)
        {
            var client = _context.Client.FirstOrDefault(clients => clients.ClientId == id);
            if(client == null)
            {
                return NotFound();
            }
            _context.Client.Remove(client);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
