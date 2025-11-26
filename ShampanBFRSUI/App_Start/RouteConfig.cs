using System.Web.Mvc;
using System.Web.Routing;

namespace ShampanBFRSUI
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Login", action = "Index", id = UrlParameter.Optional },
                 namespaces: new[] { "ShampanBFRSUI.Controllers" } // 👈 specify namespace here
            );
        }
    }
}
