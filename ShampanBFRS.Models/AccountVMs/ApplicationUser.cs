using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ShampanBFRS.Models.AccountVMs
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; }
        public string NormalizedName { get; set; }
        public string NormalizedUserName { get; set; }
        public DateTime? LockoutEnd { get; set; }
        public string NormalizedEmail { get; set; }
        public string ConcurrencyStamp { get; set; }        

        [StringLength(256)]
        public string NormalizedPassword { get; set; }
        public bool IsHeadOffice { get; set; }

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);

            // Add custom user claims here
            return userIdentity;
        }

    }
}
