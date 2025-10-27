using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace AkAgenda.Api.Models
{
    public class Users
    {
        [Key]
        public int UserId { get; set; }

        [Required(ErrorMessage = "O campo Login é obrigatório")]
        [StringLength(20, MinimumLength =4, ErrorMessage = "O login deve ter entre 4 e 20 caracteres")]
        public string? Login { get; set; }
        
        [StringLength(40, MinimumLength =4, ErrorMessage = "O nome de usuário deve ter entre 4 e 10 caracteres")]    
        public string UserName { get; set; }

        [Required(ErrorMessage = "O campo senha é obrigatório")]
        [StringLength(10, MinimumLength =6, ErrorMessage = "A senha deve ter entre 6 e 10 caracteres")]
        public string? Password { get; set; }

        [Required(ErrorMessage = "O campo função é obrigatório")]
        [StringLength(20, MinimumLength =4, ErrorMessage = "A função deve ter entre 4 e 20 caracteres")]
        public string Function { get; set; }
        
    }
}