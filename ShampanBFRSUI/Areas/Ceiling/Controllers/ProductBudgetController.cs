using ShampanBFRS.Models.Ceiling;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ShampanBFRSUI.Areas.Ceiling.Controllers
{
    public class ProductBudgetController : Controller
    {
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
            vm.BudgetSetNo = 1;
            vm.BudgetType = BudgetType;

            return View("Create", vm);
        }



    }
}