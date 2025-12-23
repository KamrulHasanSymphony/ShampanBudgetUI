using System.Web.Mvc;

namespace ShampanBFRSUI.Areas.SalaryAllowance
{
    public class SalaryAllowanceAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "SalaryAllowance";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "SalaryAllowance_default_area",
                "SalaryAllowance/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}