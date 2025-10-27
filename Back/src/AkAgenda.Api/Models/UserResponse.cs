using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AkAgenda.Api.Models
{
    public class UserResponse
    {
        public Users? Users { get; set; }
        public string? Token { get; set; }
    }
}