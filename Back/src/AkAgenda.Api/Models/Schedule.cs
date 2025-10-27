using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace AkAgenda.Api.Models
{
    public class Schedule
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ScheduleId { get; set; }    

        [Required]
        public int ClientId { get; set; } 

        [Required]
         public int ServiceId { get; set; }
        

        [Required (ErrorMessage = "O campo 'Cliente' é obrigatório.")]
        public string? ClientName { get; set; }

        [Required (ErrorMessage = "O campo 'Data' é obrigatório.")]
        public DateTime ScheduleDate { get; set; }

        [Required (ErrorMessage = "O campo 'Descrição' é obrigatório.")]
        public string? ScheduleDesc { get; set; }

        [Required (ErrorMessage = "O campo 'Profissional' é obrigatório.")]
        public int ProfessionalId { get; set; }

        public bool? Attended { get; set; }

        public int UserId { get; set; }
    }
}