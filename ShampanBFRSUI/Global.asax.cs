using Microsoft.AspNet.Identity;
using ShampanBFRS.Models.CommonVMs;
using System;
using System.Security.Claims;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Web.Security;

namespace ShampanBFRSUI
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

        protected void Application_PostAuthenticateRequest(Object sender, EventArgs e)
        {
            var authCookie = HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];
            if (authCookie != null)
            {
                var ticket = FormsAuthentication.Decrypt(authCookie.Value);
                if (ticket != null)
                {
                    var identity = new ClaimsIdentity(DefaultAuthenticationTypes.ApplicationCookie);
                    var userData = ticket.UserData.Split('|');

                    identity.AddClaim(new Claim(ClaimNames.CurrentBranch, userData[0]));
                    identity.AddClaim(new Claim(ClaimNames.CurrentBranchCode, userData[1]));
                    identity.AddClaim(new Claim(ClaimNames.CurrentBranchName, userData[2]));
                    identity.AddClaim(new Claim(ClaimTypes.Name, ticket.Name));

                    HttpContext.Current.User = new ClaimsPrincipal(identity);
                }
            }
        }


    }
}
