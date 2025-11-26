using Microsoft.AspNet.Identity.EntityFramework;
using ShampanBFRS.Models.AccountVMs;
using ShampanBFRS.Models.SetUpVMs;
using System;
using System.Configuration;
using System.Data.Entity;

namespace ShampanBFRSUI.Persistence
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext() : base("name=AuthContext")
        {
            Database.SetInitializer<ApplicationDbContext>(null);
        }

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<ApplicationDbContext>(null);
            base.OnModelCreating(modelBuilder);
        }
    }

    public class DatabaseHelper
    {
        public static string GetConnectionString()
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
                SessionClass.ConnectionString = connectionString;
                return connectionString;
            }
            catch (Exception ex)
            {
                throw new Exception("Error fetching connection string", ex);
            }
        }

    }

}
