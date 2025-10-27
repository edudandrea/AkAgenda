using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AkAgenda.Api.Models;
using Microsoft.EntityFrameworkCore;


namespace AkAgenda.Api.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options){}
        public DbSet<Users> User { get; set; }
        public DbSet<Clients> Client { get; set; }
        public DbSet<Anamneses> Anamnese { get; set; }  
        public DbSet<Services> Service { get; set; }
        public DbSet<Schedule> Schedule { get; set; }
        public DbSet<Professional> Professionals { get; set; }
        
    }
}