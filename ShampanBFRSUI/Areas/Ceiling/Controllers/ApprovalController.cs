using Newtonsoft.Json;
using ShampanBFRS.Models.Ceiling;
using ShampanBFRS.Models.CommonVMs;
using ShampanBFRS.Models.Helper;
using ShampanBFRS.Models.KendoCommon;
using ShampanBFRS.Models.SetUpVMs;
using ShampanBFRS.Repo.Ceiling;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace ShampanBFRSUI.Areas.Ceiling.Controllers
{
    public class ApprovalController : Controller
    {
        ApprovalRepo _repo = new ApprovalRepo();

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

        public ActionResult Create(string TransactionType = "", string MenuType = "", string BudgetType = "")
        {
            BudgetOtherDepartmentHeaderVM vm = new BudgetOtherDepartmentHeaderVM();
            vm.Operation = "add";
            vm.TransactionType = TransactionType;
            vm.BudgetSetNo = 1;
            vm.BudgetType = BudgetType;
            vm.TransactionDate = DateTime.Now.ToString("yyyy-MM-dd");
            vm.MenuType = MenuType;
            vm.FiscalYearId = Convert.ToInt32(Session["DashboardFiscalYearId"] ?? 0);

            return View("Create", vm);
        }

        [HttpPost]
        public ActionResult CreateEdit(BudgetOtherDepartmentHeaderVM model)
        {
            ResultModel<BudgetOtherDepartmentHeaderVM> result = new ResultModel<BudgetOtherDepartmentHeaderVM>();
            ResultVM resultVM = new ResultVM
            {
                Status = MessageModel.Fail,
                Message = "Error",
                ExMessage = null,
                Id = "0",
                DataVM = null
            };

            _repo = new ApprovalRepo();

            if (ModelState.IsValid)
            {
                try
                {

                    if (model.IsApprove == true)
                        {
                        model.LastUpdateBy = Session["UserId"].ToString();
                        model.LastUpdateAt = DateTime.Now.ToString();
                        model.LastUpdateFrom = Ordinary.GetLocalIpAddress();

                        resultVM = _repo.Approve(model);

                        if (resultVM.Status == ResultStatus.Success.ToString())
                        {
                            Session["result"] = resultVM.Status + "~" + resultVM.Message;

                            result = new ResultModel<BudgetOtherDepartmentHeaderVM>()
                            {
                                Success = true,
                                Status = Status.Success,
                                Message = resultVM.Message,
                                Data = model
                            };

                            return Json(result);
                        }
                        else
                        {
                            Session["result"] = "Fail" + "~" + resultVM.Message;

                            result = new ResultModel<BudgetOtherDepartmentHeaderVM>()
                            {
                                Success = false,
                                Status = Status.Fail,
                                Message = resultVM.Message,
                                Data = model
                            };

                            return Json(result);
                        }
                    }

                    else if (model.IsApprove == false)
                    {
                        model.LastUpdateBy = Session["UserId"].ToString();
                        model.LastUpdateAt = DateTime.Now.ToString();
                        model.LastUpdateFrom = Ordinary.GetLocalIpAddress();

                        resultVM = _repo.Reject(model);

                        if (resultVM.Status == ResultStatus.Success.ToString())
                        {
                            Session["result"] = resultVM.Status + "~" + resultVM.Message;

                            result = new ResultModel<BudgetOtherDepartmentHeaderVM>()
                            {
                                Success = true,
                                Status = Status.Success,
                                Message = resultVM.Message,
                                Data = model
                            };

                            return Json(result);
                        }
                        else
                        {
                            Session["result"] = "Fail" + "~" + resultVM.Message;

                            result = new ResultModel<BudgetOtherDepartmentHeaderVM>()
                            {
                                Success = false,
                                Status = Status.Fail,
                                Message = resultVM.Message,
                                Data = model
                            };

                            return Json(result);
                        }
                    }
                    else
                    {
                        return RedirectToAction("Index");
                    }
                }
                catch (Exception e)
                {
                    Session["result"] = "Fail" + "~" + e.Message;
                    Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                    return View("Create", model);
                }
            }
            else
            {
                result = new ResultModel<BudgetOtherDepartmentHeaderVM>()
                {
                    Success = false,
                    Status = Status.Fail,
                    Message = "Model State Error!",
                    Data = model
                };

                return Json(result);
            }
        }


        [HttpGet]
        public ActionResult Edit(string id, string MenuType = "")
        {
            try
            {
                _repo = new ApprovalRepo();

                BudgetOtherDepartmentHeaderVM vm = new BudgetOtherDepartmentHeaderVM();
                CommonVM param = new CommonVM();
                param.Id = id;
                ResultVM result = _repo.List(param);

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
        public JsonResult GetGridData(GridOptions options, string TransactionType, string MenuType, string budgetType = "")
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new ApprovalRepo();

            try
            {

                options.vm.UserId = Session["UserId"].ToString();
                options.vm.TransactionType = TransactionType;
                options.vm.BudgetType = budgetType;

                options.vm.IsPost = "Y";

                if (!string.IsNullOrWhiteSpace(MenuType) && MenuType.ToLower() == "all")
                {
                    options.vm.UserId = "";
                }

                result = _repo.GetGridData(options);

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

    }
}