using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace AkAgenda.Api.Models
{
    public class Anamneses
    {
        [Key]
        public int AnamneseId { get; set; }
        
        [Required(ErrorMessage = "O campo Nome é obrigatório")]
        [StringLength(20, MinimumLength = 4, ErrorMessage = "O nome deve ter entre 4 e 20 caracteres")]
        public string? AnamneseName { get; set; }
        
        [Required(ErrorMessage = "O campo Descrição é obrigatório")]
        [StringLength(100, MinimumLength = 4, ErrorMessage = "A descrição deve ter entre 4 e 100 caracteres")]
        public string? AnamneseDesc { get; set; }
    }
}