using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace AkAgenda.Api.Models
{
    public class Services
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ServiceId { get; set; }
        [Required(ErrorMessage = "O campo nome do serviço é obrigatório")]
        public string? ServiceName { get; set; }
        
        [Required(ErrorMessage = "O campo tempo de serviço é obrigatório")]
        public string? ServiceTime { get; set; }
        
        [Required(ErrorMessage = "O campo preço é obrigatório")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "O campo descrição é obrigatório")]
        public string? ServiceDesc { get; set; }

        public int UserId { get; set; }
        
    }
}