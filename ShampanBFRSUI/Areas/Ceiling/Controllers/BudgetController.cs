using Newtonsoft.Json;
using ShampanBFRS.Models.Ceiling;
using ShampanBFRS.Models.CommonVMs;
using ShampanBFRS.Models.Helper;
using ShampanBFRS.Models.KendoCommon;
using ShampanBFRS.Repo.Ceiling;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ShampanBFRSUI.Areas.Ceiling.Controllers
{
    public class BudgetController : Controller
    {
        BudgetRepo _repo = new BudgetRepo();

        // GET: Ceiling/ProductBudget
        public ActionResult Index(string TransactionType = "", string BudgetType = "")
        {
            BudgetHeaderVM vm = new BudgetHeaderVM();
            vm.TransactionType = TransactionType;
            vm.BudgetSetNo = 1;
            vm.BudgetType = BudgetType;
            var currentBranchId = 0;
            if (Session["CurrentBranch"] != null)
                int.TryParse(Session["CurrentBranch"].ToString(), out currentBranchId);

            vm.BranchId = currentBranchId;

            return View(vm);
        }

        public ActionResult Create(string TransactionType = "", string BudgetType = "")
        {
            BudgetHeaderVM vm = new BudgetHeaderVM();
            vm.Operation = "add";
            vm.TransactionType = TransactionType;
            vm.BudgetSetNo = 1;
            vm.BudgetType = BudgetType;

            return View("Create", vm);
        }

        public ActionResult CreateEdit(BudgetHeaderVM model)
        {
            ResultModel<BudgetHeaderVM> result = new ResultModel<BudgetHeaderVM>();
            ResultVM resultVM = new ResultVM { Status = MessageModel.Fail, Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new BudgetRepo();

            if (ModelState.IsValid)
            {
                try
                {
                    var currentBranchId = 0;
                    if (Session["CurrentBranch"] != null)
                        int.TryParse(Session["CurrentBranch"].ToString(), out currentBranchId);

                    model.BranchId = currentBranchId;
                    model.CompanyId = 9;

                    if (model.Operation.ToLower() == "add")
                    {
                        model.CreatedBy = Session["UserId"].ToString();
                        model.CreatedOn = DateTime.Now.ToString();
                        model.CreatedFrom = Ordinary.GetLocalIpAddress();
                        model.IsActive = true;

                        resultVM = _repo.Insert(model, model.CreatedBy);

                        if (resultVM.Status == ResultStatus.Success.ToString())
                        {
                            model = JsonConvert.DeserializeObject<BudgetHeaderVM>(resultVM.DataVM.ToString());
                            //model.Operation = "Update";
                            Session["result"] = resultVM.Status + "~" + resultVM.Message;
                            result = new ResultModel<BudgetHeaderVM>()
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

                            result = new ResultModel<BudgetHeaderVM>()
                            {
                                Status = Status.Fail,
                                Message = resultVM.Message,
                                Data = model
                            };
                            return Json(result);
                        }

                    }
                    else if (model.Operation.ToLower() == "update")
                    {
                        model.LastModifiedBy = Session["UserId"].ToString();
                        model.LastModifiedOn = DateTime.Now.ToString();
                        model.LastUpdateFrom = Ordinary.GetLocalIpAddress();

                        //resultVM = _repo.Update(model);

                        if (resultVM.Status == ResultStatus.Success.ToString())
                        {
                            Session["result"] = resultVM.Status + "~" + resultVM.Message;
                            result = new ResultModel<BudgetHeaderVM>()
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
                            Session["result"] = MessageModel.Fail + "~" + resultVM.Message;

                            result = new ResultModel<BudgetHeaderVM>()
                            {
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
                    Session["result"] = MessageModel.Fail + "~" + e.Message;
                    Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                    return View("Create", model);
                }
            }
            else
            {
                result = new ResultModel<BudgetHeaderVM>()
                {
                    Success = false,
                    Status = Status.Fail,
                    Message = "Model State Error!",
                    Data = model
                };
                return Json(result);
            }
        }

        public ActionResult Edit(int yearId, string chargeGroup, string budgetType, int branchId)
        {
            try
            {
                _repo = new BudgetRepo();

                BudgetHeaderVM vm = new BudgetHeaderVM();

                var currentBranchId = 0;
                if (Session["CurrentBranch"] != null)
                    int.TryParse(Session["CurrentBranch"].ToString(), out currentBranchId);

                vm.FiscalYearId = Convert.ToInt32(yearId);
                vm.BudgetType = budgetType;
                vm.BranchId = currentBranchId;

                //ResultVM result = _repo.ProductBudgeDistincttList(vm);

                //if (result.Status == MessageModel.Success && result.DataVM != null)
                //{
                //    var list = JsonConvert.DeserializeObject<List<ProductBudgetMasterVM>>(result.DataVM.ToString());

                //    if (list != null && list.Any())
                //    {
                //        vm = list.First();
                //    }
                //}

                vm.Operation = "update";

                return View("Create", vm);
            }
            catch (Exception e)
            {
                Session["result"] = MessageModel.Fail + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index");
            }
        }

        [HttpPost]
        public JsonResult GetBudgetDataForDetailsNew(GridOptions options, string yearId, string BudgetType)
        {
            ResultVM result = new ResultVM { Status = MessageModel.Fail, Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new BudgetRepo();

            try
            {
                var currentBranchId = 0;
                if (Session["CurrentBranch"] != null)
                    int.TryParse(Session["CurrentBranch"].ToString(), out currentBranchId);

                BudgetHeaderVM budgetVM = new BudgetHeaderVM();

                options.vm.FiscalYearId = yearId;
                options.vm.BranchId = currentBranchId.ToString();
                options.vm.BudgetType = BudgetType;

                options.vm.UserId = Session["UserId"].ToString();

                result = _repo.GetBudgetDataForDetailsNew(options);

                if (result.Status == MessageModel.Success && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<BudgetHeaderVM>>(result.DataVM.ToString());

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
        public JsonResult BudgetList(int yearId)
        {
            ResultVM result = new ResultVM { Status = MessageModel.Fail, Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new BudgetRepo();

            try
            {
                var currentBranchId = 0;
                if (Session["CurrentBranch"] != null)
                    int.TryParse(Session["CurrentBranch"].ToString(), out currentBranchId);

                BudgetHeaderVM productBudgetVM = new BudgetHeaderVM();

                productBudgetVM.FiscalYearId = yearId;
                productBudgetVM.BranchId = currentBranchId;

                //productBudgetVM.UserId = Session["UserId"].ToString();

                result = _repo.ProductBudgetList(productBudgetVM);

                if (result.Status == MessageModel.Success && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<BudgetHeaderVM>>(result.DataVM.ToString());

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

        [HttpPost]
        public JsonResult BudgeDistincttList(int yearId, String BudgetType)
        {
            ResultVM result = new ResultVM { Status = MessageModel.Fail, Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new BudgetRepo();

            try
            {
                var currentBranchId = 0;
                if (Session["CurrentBranch"] != null)
                    int.TryParse(Session["CurrentBranch"].ToString(), out currentBranchId);

                BudgetHeaderVM productBudgetVM = new BudgetHeaderVM();

                productBudgetVM.FiscalYearId = yearId;
                productBudgetVM.BranchId = currentBranchId;

                //productBudgetVM.UserId = Session["UserId"].ToString();

                result = _repo.BudgeDistincttList(productBudgetVM);

                if (result.Status == MessageModel.Success && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<BudgetHeaderVM>>(result.DataVM.ToString());

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

        [HttpPost]
        public JsonResult GetGridData(GridOptions options, string TransactionType, string MenuType, string BudgetType = "")
        {
            ResultVM result = new ResultVM { Status = MessageModel.Fail, Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new BudgetRepo();

            try
            {
                options.vm.UserId = Session["UserId"].ToString();
                options.vm.TransactionType = TransactionType;
                options.vm.BudgetType = BudgetType;

                if (!string.IsNullOrWhiteSpace(MenuType) && MenuType.ToLower() == "all")
                {
                    options.vm.UserId = "";
                }

                result = _repo.GetGridData(options);

                if (result.Status == MessageModel.Success && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<BudgetHeaderVM>>(result.DataVM.ToString());

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