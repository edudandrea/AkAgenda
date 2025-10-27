using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace AkAgenda.Api.Models
{
    public class Professional
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ProfessionalId { get; set; }

        [Required(ErrorMessage = "O campo nome é obrigatório")]
        [StringLength(50, MinimumLength = 4, ErrorMessage = "O nome deve ter entre 4 e 50 caracteres")]
        public string? ProfessionalName { get; set; }

        [Required(ErrorMessage = "O campo cargo é obrigatório")]
        public string? Position { get; set; }

        [Required(ErrorMessage = "O campo telefone é obrigatório")]
        [StringLength(11, MinimumLength = 11, ErrorMessage = "O telefone deve ter 11 caracteres")]
        public string? PhoneNumber { get; set; }
        
        [EmailAddress(ErrorMessage = "O email é inválido")]
        public string? Email { get; set; }

        public string? PhotoPath { get; set; }
    }
}