using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace AkAgenda.Api.Models
{
    public class Clients
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ClientId { get; set; }
        [Required(ErrorMessage = "O campo nome do cliente é obrigatório")]
        [StringLength(50, MinimumLength = 4, ErrorMessage = "O nome do cliente deve ter entre 4 e 50 caracteres")]
        public string? ClientName { get; set; }
        [Required(ErrorMessage = "O campo endereço é obrigatório")]        
        public string? Address { get; set; }

        [Required(ErrorMessage = "O campo cidade é obrigatório")]
        [StringLength(20, MinimumLength = 4, ErrorMessage = "O nome da cidade deve ter entre 4 e 20 caracteres")]
        public string? City { get; set; }

        [Required(ErrorMessage = "O campo estado é obrigatório")]
        [StringLength(2, MinimumLength = 2, ErrorMessage = "O estado deve ter 2 caracteres")]
        public string? State { get; set; }

        [Required(ErrorMessage = "O campo telefone é obrigatório")]
        [StringLength(11, MinimumLength = 11, ErrorMessage = "O telefone deve ter 11 caracteres")]
        public string? PhoneNumber { get; set; }

        [EmailAddress(ErrorMessage = "O email é inválido")]
        public string? ClientEmail { get; set; }

        public string? Instagram { get; set; }

        public string? Facebook { get; set; }

        public string? Profession { get; set; }

        public int AnamneseId { get; set; }

        public int UserId { get; set; }
    }
}