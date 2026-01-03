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

                        resultVM = _repo.Update(model);

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

        [HttpGet]
        public ActionResult Edit(string id)
        {
            try
            {
                _repo = new BudgetRepo();

                BudgetHeaderVM vm = new BudgetHeaderVM();
                CommonVM param = new CommonVM();
                param.Id = id;
                ResultVM result = _repo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<BudgetHeaderVM>>(result.DataVM.ToString()).FirstOrDefault();
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

        [HttpGet]
        public ActionResult ListEdit(string id)
        {
            try
            {
                _repo = new BudgetRepo();

                BudgetHeaderVM vm = new BudgetHeaderVM();
                CommonVM param = new CommonVM();
                param.Id = id;
                ResultVM result = _repo.ListEdit(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<BudgetHeaderVM>>(result.DataVM.ToString()).FirstOrDefault();
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

        //[HttpPost]
        //public JsonResult BudgetList(int yearId)
        //{
        //    ResultVM result = new ResultVM { Status = MessageModel.Fail, Message = "Error", ExMessage = null, Id = "0", DataVM = null };
        //    _repo = new BudgetRepo();

        //    try
        //    {
        //        var currentBranchId = 0;
        //        if (Session["CurrentBranch"] != null)
        //            int.TryParse(Session["CurrentBranch"].ToString(), out currentBranchId);

        //        BudgetHeaderVM productBudgetVM = new BudgetHeaderVM();

        //        productBudgetVM.FiscalYearId = yearId;
        //        productBudgetVM.BranchId = currentBranchId;

        //        //productBudgetVM.UserId = Session["UserId"].ToString();

        //        result = _repo.ProductBudgetList(productBudgetVM);

        //        if (result.Status == MessageModel.Success && result.DataVM != null)
        //        {
        //            var gridData = JsonConvert.DeserializeObject<GridEntity<BudgetHeaderVM>>(result.DataVM.ToString());

        //            return Json(new
        //            {
        //                Items = gridData.Items,
        //                TotalCount = gridData.TotalCount
        //            }, JsonRequestBehavior.AllowGet);
        //        }

        //        return Json(new { Error = true, Message = "No data found." }, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        //[HttpPost]
        //public JsonResult BudgeDistincttList(int yearId, String BudgetType)
        //{
        //    ResultVM result = new ResultVM { Status = MessageModel.Fail, Message = "Error", ExMessage = null, Id = "0", DataVM = null };
        //    _repo = new BudgetRepo();

        //    try
        //    {
        //        var currentBranchId = 0;
        //        if (Session["CurrentBranch"] != null)
        //            int.TryParse(Session["CurrentBranch"].ToString(), out currentBranchId);

        //        BudgetHeaderVM productBudgetVM = new BudgetHeaderVM();

        //        productBudgetVM.FiscalYearId = yearId;
        //        productBudgetVM.BranchId = currentBranchId;

        //        //productBudgetVM.UserId = Session["UserId"].ToString();

        //        result = _repo.BudgeDistincttList(productBudgetVM);

        //        if (result.Status == MessageModel.Success && result.DataVM != null)
        //        {
        //            var gridData = JsonConvert.DeserializeObject<GridEntity<BudgetHeaderVM>>(result.DataVM.ToString());

        //            return Json(new
        //            {
        //                Items = gridData.Items,
        //                TotalCount = gridData.TotalCount
        //            }, JsonRequestBehavior.AllowGet);
        //        }

        //        return Json(new { Error = true, Message = "No data found." }, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        [HttpPost]
        public JsonResult GetGridData(GridOptions options, string budgetType = "")
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new BudgetRepo();

            try
            {

                //options.vm.BranchId = branchId == "0" ? "" : branchId;
                //options.vm.IsPost = isPost;
                //options.vm.FromDate = fromDate;
                //options.vm.ToDate = toDate;
                //options.vm.CompanyId = Session["CompanyId"] != null ? Session["CompanyId"].ToString() : "";
                options.vm.BudgetType = budgetType;

                result = _repo.GetGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
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

        [HttpGet]
        public JsonResult GetDetailDataById(GridOptions options, int masterId)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new BudgetRepo();

            try
            {
                result = _repo.GetDetailDataById(options, masterId);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<BudgetDetailVM>>(result.DataVM.ToString());

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

        public ActionResult MultiplePost(CommonVM param)
        {
            ResultModel<BudgetHeaderVM> result = new ResultModel<BudgetHeaderVM>();

            try
            {
                _repo = new BudgetRepo();


                param.ModifyBy = Session["UserId"].ToString();
                param.ModifyFrom = Ordinary.GetLocalIpAddress();

                ResultVM resultData = _repo.MultiplePost(param);

                Session["result"] = resultData.Status + "~" + resultData.Message;

                if (resultData.Status == "Success")
                {
                    result = new ResultModel<BudgetHeaderVM>()
                    {
                        Success = true,
                        Status = Status.Success,
                        Message = resultData.Message,
                        Data = null
                    };
                }
                else
                {
                    result = new ResultModel<BudgetHeaderVM>()
                    {
                        Success = false,
                        Status = Status.Fail,
                        Message = resultData.Message,
                        Data = null
                    };
                }
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index");
            }

            return Json(result);
        }




    }
}