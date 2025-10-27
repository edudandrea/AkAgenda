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
    public class AnamnesesController : ControllerBase
    {
        private readonly DataContext _context;
        public AnamnesesController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetAnamneses()
        {
            var anamnese = _context.Anamnese.Where(c => !string.IsNullOrEmpty(c.AnamneseName)).ToList();
            if(anamnese.Count == 0)            
            {
                return NotFound("Nenhuma Anamnese encontrado");
            }
            
            return Ok(anamnese);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public IActionResult GetAnamneseById(int id)
        {
            var anamnese = _context.Anamnese.FirstOrDefault(anamnese => anamnese.AnamneseId == id);
            if(anamnese == null)
            {
                return NotFound();
            }
            
            
            return Ok(anamnese);
        }


        [HttpDelete("{id}")]
       
        public async Task<IActionResult> DeleteAnamneseById(int id)
        {
            var anamnese = _context.Anamnese.FirstOrDefault(anamnese => anamnese.AnamneseId == id);
            if(anamnese == null)
            {
                return NotFound();
            }
            _context.Anamnese.Remove(anamnese);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAnamnese([FromBody]Anamneses anamnese)
        {
            var anamneseToUpdate = _context.Anamnese.FirstOrDefault(anamneses => anamneses.AnamneseId == anamnese.AnamneseId);
            if(anamneseToUpdate == null)
            {
                return NotFound();
            }
                anamneseToUpdate.AnamneseName = anamnese.AnamneseName;
                anamneseToUpdate.AnamneseDesc = anamnese.AnamneseDesc;
                
                await _context.SaveChangesAsync();
                return NoContent();
        }


        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> CreateAnamneses([FromBody] Anamneses anamnese)
        {
            if (anamnese == null)
            {
                return BadRequest();
            }

            _context.Anamnese.Add(anamnese);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAnamneses), new { id = anamnese.AnamneseId }, anamnese);
        }           
    }
}