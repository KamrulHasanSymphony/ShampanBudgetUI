using System.Web.Mvc;

namespace ShampanBFRSUI.Areas.SetUp
{
    public class SetUpAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "SetUp";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "SetUp_area_default",
                "SetUp/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}