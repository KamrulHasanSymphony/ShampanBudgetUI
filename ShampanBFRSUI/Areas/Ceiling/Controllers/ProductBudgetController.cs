using Newtonsoft.Json;
using ShampanBFRS.Models.Ceiling;
using ShampanBFRS.Models.CommonVMs;
using ShampanBFRS.Models.KendoCommon;
using ShampanBFRS.Repo.Ceiling;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ShampanBFRSUI.Areas.Ceiling.Controllers
{
    public class ProductBudgetController : Controller
    {
        ProductBudgetRepo _repo = new ProductBudgetRepo();

        // GET: Ceiling/ProductBudget
        public ActionResult Index(string TransactionType = "", string BudgetType = "")
        {
            return View();
        }

        public ActionResult Create(string TransactionType = "", string BudgetType = "")
        {
            ProductBudgetVM vm = new ProductBudgetVM();
            vm.Operation = "add";
            vm.TransactionType = TransactionType;
            vm.BudgetSetNo = "1";
            vm.BudgetType = BudgetType;

            return View("Create", vm);
        }

        [HttpPost]
        public JsonResult GetProductBudgetDataForDetailsLoad(string yearId, string budgetSetNo, string budgetType)
        {
            ResultVM result = new ResultVM { Status = MessageModel.Fail, Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new ProductBudgetRepo();

            try
            {
                var currentBranchId = 0;
                if (Session["CurrentBranch"] != null)
                    int.TryParse(Session["CurrentBranch"].ToString(), out currentBranchId);

                ProductBudgetVM productBudgetVM = new ProductBudgetVM();

                productBudgetVM.GLFiscalYearId = Convert.ToInt32(yearId);
                productBudgetVM.BudgetSetNo = budgetSetNo;
                productBudgetVM.BudgetType = budgetType;
                productBudgetVM.BranchId = currentBranchId;

                productBudgetVM.UserId = Session["UserId"].ToString();

                result = _repo.GetProductBudgetDataForDetailsLoad(productBudgetVM);

                if (result.Status == MessageModel.Success && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<ProductBudgetVM>>(result.DataVM.ToString());

                    return Json(new
                    {
                        Items = gridData.Items,
                        TotalCount = gridData.TotalCount
                    }, JsonRequestBehavior.AllowGet);
                }

                return Json(new { Error = true, Message = "No data found." }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }


    }
}