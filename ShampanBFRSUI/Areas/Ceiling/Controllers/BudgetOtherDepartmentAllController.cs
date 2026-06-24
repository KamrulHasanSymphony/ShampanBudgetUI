using Newtonsoft.Json;
using ShampanBFRS.Models.Ceiling;
using ShampanBFRS.Models.CommonVMs;
using ShampanBFRS.Models.Helper;
using ShampanBFRS.Models.KendoCommon;
using ShampanBFRS.Models.SalaryAllowance;
using ShampanBFRS.Models.SetUpVMs;
using ShampanBFRS.Repo.Ceiling;
using ShampanBFRS.Repo.SalaryAllowance;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Services.Description;

namespace ShampanBFRSUI.Areas.Ceiling.Controllers
{
    public class BudgetOtherDepartmentAllController : Controller
    {
        BudgetOtherDepartmentRepo _repo = new BudgetOtherDepartmentRepo();

        // GET: Ceiling/ProductBudget
        public ActionResult Index(string TransactionType = "", string MenuType = "", string BudgetType = "")
        {
            BudgetOtherDepartmentHeaderVM vm = new BudgetOtherDepartmentHeaderVM();
            vm.TransactionType = TransactionType;
            vm.MenuType = MenuType;
            vm.BudgetSetNo = 1;
            vm.BudgetType = BudgetType;
            vm.TransactionDate = DateTime.Now.ToString("yyyy-MM-dd");
            var currentBranchId = 0;
            if (Session["CurrentBranch"] != null)
                int.TryParse(Session["CurrentBranch"].ToString(), out currentBranchId);

            vm.BranchId = currentBranchId;

            return View(vm);
        }

        public ActionResult Create(string TransactionType = "", string MenuType = "",string BudgetType = "")
        {
            BudgetOtherDepartmentHeaderVM vm = new BudgetOtherDepartmentHeaderVM();
            vm.Operation = "add";
            vm.TransactionType = TransactionType;
            vm.BudgetSetNo = 1;
            vm.BudgetType = BudgetType;
            vm.TransactionDate = DateTime.Now.ToString("yyyy-MM-dd");
            vm.MenuType = MenuType;

            return View("Create", vm);
        }

        [HttpGet]
        public ActionResult Edit(string fiscalYearId,string budgetType)
        {
            try
            {
                _repo = new BudgetOtherDepartmentRepo();

                BudgetOtherDepartmentHeaderVM vm = new BudgetOtherDepartmentHeaderVM();
                CommonVM param = new CommonVM();             
                param.FiscalYearId = fiscalYearId;
                param.BudgetType = budgetType;

                ResultVM result = _repo.BudgetListAll(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<BudgetOtherDepartmentHeaderVM>>(result.DataVM.ToString()).FirstOrDefault();
                }
                else
                {
                    vm = null;
                }


                vm.Operation = "update";

                return View("Create", vm);
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index");
            }
        }
        
        [HttpPost]
        public JsonResult GetBudgetDataForDetailsNew(GridOptions options, string yearId, string BudgetType)
        {
            ResultVM result = new ResultVM { Status = MessageModel.Fail, Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new BudgetOtherDepartmentRepo();

            try
            {
                var currentBranchId = 0;
                if (Session["CurrentBranch"] != null)
                    int.TryParse(Session["CurrentBranch"].ToString(), out currentBranchId);

                BudgetOtherDepartmentDetailVM budgetVM = new BudgetOtherDepartmentDetailVM();

                options.vm.FiscalYearId = yearId;
                options.vm.BranchId = currentBranchId.ToString();
                options.vm.BudgetType = BudgetType;

                options.vm.UserId = Session["UserId"].ToString();

                result = _repo.GetBudgetDataForDetailsNew(options);

                if (result.Status == MessageModel.Success && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<BudgetOtherDepartmentDetailVM>>(result.DataVM.ToString());

                    return Json(new
                    {
                        Items = gridData.Items,
                        TotalCount = gridData.TotalCount
                    }, JsonRequestBehavior.AllowGet);
                }

                    //var gridData = JsonConvert.DeserializeObject<GridEntity<BudgetHeaderVM>>(result.DataVM.ToString());

                    //return Json(new
                    //{
                    //    Items = gridData.Items,
                    //    TotalCount = gridData.TotalCount
                    //}, JsonRequestBehavior.AllowGet);
                

                return Json(new { Error = true, Message = "No data found." }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult GetGridDataBudgetAll(GridOptions options, string TransactionType, string MenuType, string budgetType = "")
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new BudgetOtherDepartmentRepo();

            try
            {

                options.vm.UserId = Session["UserId"].ToString();
                options.vm.TransactionType = TransactionType;
                options.vm.BudgetType = budgetType;

                if (!string.IsNullOrWhiteSpace(MenuType) && MenuType.ToLower() == "all")
                {
                    options.vm.UserId = "";
                }

                result = _repo.GetGridDataBudgetAll(options);

                if (result.Status == MessageModel.Success && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<BudgetOtherDepartmentHeaderVM>>(result.DataVM.ToString());

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

        [HttpGet]
        public JsonResult GetDetailDataById(GridOptions options, int masterId)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new BudgetOtherDepartmentRepo();

            try
            {
                result = _repo.GetDetailDataById(options, masterId);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<BudgetOtherDepartmentDetailVM>>(result.DataVM.ToString());

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

        [HttpGet]
        public JsonResult GetDetailDataBudgetAllById(GridOptions options, int masterId)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new BudgetOtherDepartmentRepo();

            try
            {
                result = _repo.GetDetailDataById(options, masterId);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<BudgetOtherDepartmentDetailVM>>(result.DataVM.ToString());

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