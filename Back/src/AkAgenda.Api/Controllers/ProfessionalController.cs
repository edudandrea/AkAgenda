using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using AkAgenda.Api.Data;
using AkAgenda.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace AkAgenda.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProfessionalController : ControllerBase
    {
        private readonly DataContext _context;

        public ProfessionalController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetProfessional()
        {
            var professional = _context.Professionals.Where(c => !string.IsNullOrEmpty(c.ProfessionalName)).ToList();
            if(professional.Count == 0)            
            {
                return NotFound("Nenhum Profissional encontrado");
            }
            
            return Ok(professional);
        } 

        [HttpGet("{id}")]
        [AllowAnonymous]
        public IActionResult GetProfessionalById(int id)
        {
            var professional = _context.Professionals.FirstOrDefault(professional => professional.ProfessionalId == id);
            if(professional == null)
            {
                return NotFound();
            }
            
            
            return Ok(professional);
        }   

        [HttpGet("name")]
        [AllowAnonymous]
        public IActionResult GetProfessionalByName(string name)
        {
            var professional = _context.Professionals.FirstOrDefault(professional => professional.ProfessionalName == name);
            if(professional == null)
            {
                return NotFound();
            }
            return Ok(professional);
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> CreateProfessional([FromForm] Professional professional, [FromForm] IFormFile? photo)
        {
            if (professional == null)
            {
                return BadRequest("Profissional não pode ser nulo.");
            }

            // Processando a foto, se existir
            if (photo != null && photo.Length > 0)
            {
                var uploadDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

                if (!Directory.Exists(uploadDirectory))
                {
                    Directory.CreateDirectory(uploadDirectory);
                }

                var filePath = Path.Combine(uploadDirectory, photo.FileName);

                // Salvando o arquivo no servidor
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await photo.CopyToAsync(fileStream);
                }

                // Atribuindo o caminho da foto ao profissional
                professional.PhotoPath = "/uploads/" + photo.FileName;
            }

            // O banco de dados gerará automaticamente o ProfessionalId
            _context.Professionals.Add(professional);
            await _context.SaveChangesAsync();

            // Retornando o profissional recém-criado, incluindo o ID gerado
            return CreatedAtAction(nameof(GetProfessional), new { id = professional.ProfessionalId }, professional);
        }


        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateProfessional(int id, [FromForm] Professional professional, IFormFile? photo)
        {

           
            // Verifica se o profissional existe
            var existingProfessional = await _context.Professionals.FindAsync(id);
            if (existingProfessional == null)
            {
                return NotFound("Profissional não encontrado.");
            }

            // Atualiza os dados do profissional
            existingProfessional.ProfessionalName = professional.ProfessionalName;
            existingProfessional.Position = professional.Position;
            existingProfessional.PhoneNumber = professional.PhoneNumber;
            existingProfessional.Email = professional.Email;

            // Verifica se um novo arquivo foi enviado
            if (photo != null && photo.Length > 0)
            {
                // Define o diretório para upload das imagens
                var uploadDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

                // Cria o diretório se ele não existir
                if (!Directory.Exists(uploadDirectory))
                {
                    Directory.CreateDirectory(uploadDirectory);
                }

                // Define o caminho completo do arquivo
                var filePath = Path.Combine(uploadDirectory, photo.FileName);

                // Salva o novo arquivo de imagem
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await photo.CopyToAsync(fileStream);
                }

                // Atualiza o caminho da imagem no banco de dados
                existingProfessional.PhotoPath = "/uploads/" + photo.FileName;
            }

            // Atualiza o profissional no banco de dados
            _context.Professionals.Update(existingProfessional);
            await _context.SaveChangesAsync();

            return Ok(existingProfessional);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteProfessionalById(int id)
        {
            var professional = _context.Professionals.FirstOrDefault(professional => professional.ProfessionalId == id);
            if(professional == null)
            {
                return NotFound();
            }
            _context.Professionals.Remove(professional);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        
    }
}