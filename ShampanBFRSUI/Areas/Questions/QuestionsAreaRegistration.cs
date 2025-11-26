using System.Web.Mvc;

namespace ShampanBFRSUI.Areas.Questions
{
    public class QuestionsAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "Questions";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "Questions_area_default",
                "Questions/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}