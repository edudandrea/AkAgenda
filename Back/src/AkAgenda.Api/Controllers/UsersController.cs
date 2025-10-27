using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AkAgenda.Api.Data;
using AkAgenda.Api.Models;
using AkAgenda.Api.Srv;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AkAgenda.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
     
    public class UsersController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly TokenServices _tokenService;
        public UsersController(DataContext context, TokenServices tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }


        [HttpGet]
        public IActionResult GetUser()
        {
            try
            {
                var users = _context.User.ToList();
                if (users.Count == 0)
                {
                    return NotFound("Nenhum usuário encontrado");
                }

                return Ok(users);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{userId}")] // Buscando o usuário por userId
        public async Task<IActionResult> GetUserById(int userId)
        {
            var user = await _context.User.FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null)
            {
                return NotFound("Usuário não encontrado.");
            }

            return Ok(user);
        }

        [HttpGet("username")]
        public IActionResult GetUserByUsername(string userName)
        {
            var user = _context.User.FirstOrDefault(users => users.Login == userName);
            if(user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }


        [HttpPost("login")]
        [AllowAnonymous]
        public IActionResult Login([FromBody] UserLogin userLogin)
        {
            try
            {
                if (userLogin == null)
                    return BadRequest("Corpo da requisição inválido");

                var user = _context.User.FirstOrDefault(c => c.Login == userLogin.Login);
                if (user == null)
                    return NotFound("Usuário não encontrado");

                if (string.IsNullOrEmpty(user.Password))
                    return StatusCode(500, "Senha armazenada está vazia ou nula");

                var hasher = new PasswordHasher<Users>();
                var result = hasher.VerifyHashedPassword(user, user.Password, userLogin.Password);
                if (result == PasswordVerificationResult.Failed)
                    return BadRequest("Senha inválida");

                if (user.Function == null)
                    return StatusCode(500, "Função (role) do usuário está nula");

                var claims = new[]
                {
                    new Claim(ClaimTypes.Name, user.Login),
                    new Claim(ClaimTypes.Role, user.Function.ToString())
                };

                var token = _tokenService.CreateToken(user, claims);

                user.Password = "";

                var response = new UserResponse
                {
                    Users = user,
                    Token = token
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> CreateUser([FromBody] Users users)
        {
            var userExist = await _context.User.FirstOrDefaultAsync(c => c.Login == users.Login);
            if (userExist != null)
            {
                return BadRequest("Usuário já existe.");
            }

            var hasher = new PasswordHasher<Users>();
            var hashedPassword = hasher.HashPassword(users, users.Password);

            var user = new Users
            {
                Login = users.Login,
                UserName = users.UserName,
                Password = hashedPassword,  // Armazena o hash da senha
                Function = users.Function ?? "user",  // Caso não tenha função, atribui "user"
            };
            
            await _context.User.AddAsync(user);
            await _context.SaveChangesAsync();

            // Garantir que o usuário foi salvo antes de gerar o token
            var userFromDb = await _context.User.FirstOrDefaultAsync(c => c.Login == users.Login);
            if (userFromDb == null)
            {
                return StatusCode(500, "Erro ao salvar o usuário no banco de dados.");
            }

            var token = _tokenService.CreateToken(user, new[]
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Role, user.Function)  // Inclui a role no token
            });

            user.Password = "";  // Não envia a senha no retorno

            var result = new UserResponse
            {
                Users = user,
                Token = token
            };

            return Ok(result);
        }



        [HttpPut("{userId}")]
        public async Task<IActionResult> UpdateUser(int userId, [FromBody] Users users)
        {
            // Buscar o usuário pelo ID
            var existingUser = await _context.User.FirstOrDefaultAsync(u => u.UserId == userId);
            if (existingUser == null)
            {
                return NotFound("Usuário não encontrado.");
            }

            // Manter o login do usuário, pois ele não pode ser alterado
            users.Login = existingUser.Login;

            // Se a senha for fornecida, recrie a senha criptografada
            if (!string.IsNullOrEmpty(users.Password))
            {
                var hasher = new PasswordHasher<Users>();
                users.Password = hasher.HashPassword(users, users.Password); // Criptografar a senha
            }

            // Atualiza os dados do usuário
            existingUser.UserName = users.UserName ?? existingUser.UserName;
            existingUser.Password = users.Password ?? existingUser.Password;
            existingUser.Function = users.Function ?? existingUser.Function;

            // Atualiza o usuário no banco de dados
            _context.User.Update(existingUser);
            await _context.SaveChangesAsync();

            // Gerar um novo token JWT usando o TokenServices
            var claims = new[] // Caso tenha claims extras, adicione-as aqui
            {
                new Claim(ClaimTypes.Name, existingUser.UserName),
                new Claim(ClaimTypes.Role, existingUser.Function),
            };

            var token = _tokenService.CreateToken(existingUser, claims); // Gerando o token

            // Retorna o usuário atualizado e o novo token
            var result = new UserResponse
            {
                Users = existingUser,
                Token = token
            };

            return Ok(result);
        }


        [HttpDelete("{userId}")]
        [Authorize(Roles = "admin")]
        
        public async Task<IActionResult> DeleteUser(int userId)
        {
            var user = _context.User.FirstOrDefault(user => user.UserId == userId);
            if(user == null)
            {
                return NotFound();
            }
            _context.User.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}