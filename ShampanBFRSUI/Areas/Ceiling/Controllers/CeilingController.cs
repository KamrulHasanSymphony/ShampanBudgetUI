using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OfficeOpenXml;
using ShampanBFRS.Models.Ceiling;
using ShampanBFRS.Models.CommonVMs;
using ShampanBFRS.Models.Helper;
using ShampanBFRS.Models.KendoCommon;
using ShampanBFRS.Models.SetUpVMs;
using ShampanBFRS.Repo.Ceiling;
using ShampanBFRS.Repo.CommonRepo;
using ShampanBFRS.Repo.SetUpRepo;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web.Mvc;

namespace ShampanBFRSUI.Areas.Ceiling.Controllers
{
    public class CeilingController : Controller
    {
        CeilingRepo _repo = new CeilingRepo();
        CommonRepo _commonRepo = new CommonRepo();

        // GET: Ceiling/Ceiling
        public ActionResult Index(string TransactionType = "", string MenuType = "", string BudgetType = "")
        {
            CeilingVM ceilingVM = new CeilingVM();
            ceilingVM.TransactionType = TransactionType;
            ceilingVM.MenuType = MenuType;
            ceilingVM.BudgetType = BudgetType;
            ceilingVM.BudgetSetNo = 1;
            ceilingVM.TransactionDate = DateTime.Now.ToString("yyyy-MM-dd");

            var currentBranchId = 0;
            if (Session["CurrentBranch"] != null)
                int.TryParse(Session["CurrentBranch"].ToString(), out currentBranchId);

            ceilingVM.BranchId = currentBranchId;

            return View(ceilingVM);
        }

        public ActionResult Create(string TransactionType = "", string MenuType = "", string BudgetType = "")
        {
            CeilingVM vm = new CeilingVM();
            vm.Operation = "add";
            vm.IsActive = true;
            vm.TransactionType = TransactionType;
            vm.BudgetSetNo = 1;
            vm.TransactionDate = DateTime.Now.ToString("yyyy-MM-dd");
            vm.MenuType = MenuType;
            vm.BudgetType = BudgetType;

            return View("Create", vm);
        }

        public ActionResult CreateEdit(CeilingVM model)
        {
            ResultModel<CeilingVM> result = new ResultModel<CeilingVM>();
            ResultVM resultVM = new ResultVM { Status = MessageModel.Fail, Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new CeilingRepo();

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
                        model.IsArchive = false;

                        resultVM = _repo.Insert(model, model.CreatedBy);

                        if (resultVM.Status == ResultStatus.Success.ToString())
                        {
                            model = JsonConvert.DeserializeObject<CeilingVM>(resultVM.DataVM.ToString());
                            //model.Operation = "Update";
                            Session["result"] = resultVM.Status + "~" + resultVM.Message;
                            result = new ResultModel<CeilingVM>()
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

                            result = new ResultModel<CeilingVM>()
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
                            result = new ResultModel<CeilingVM>()
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

                            result = new ResultModel<CeilingVM>()
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
                result = new ResultModel<CeilingVM>()
                {
                    Success = false,
                    Status = Status.Fail,
                    Message = "Model State Error!",
                    Data = model
                };
                return Json(result);
            }
        }

        public ActionResult Edit(string id, string MenuType = "")
        {
            try
            {
                _repo = new CeilingRepo();

                CeilingVM vm = new CeilingVM();
                CommonVM param = new CommonVM();
                param.Id = id;

                ResultVM result = _repo.CeilingList(param);

                if (result.Status == MessageModel.Success && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<CeilingVM>>(result.DataVM.ToString()).FirstOrDefault();
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
                Session["result"] = MessageModel.Fail + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index");
            }
        }


        [HttpPost]
        public JsonResult GetGridData(GridOptions options, string TransactionType, string MenuType, string BudgetType = "")
        {
            ResultVM result = new ResultVM { Status = MessageModel.Fail, Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new CeilingRepo();

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
                    var gridData = JsonConvert.DeserializeObject<GridEntity<CeilingVM>>(result.DataVM.ToString());

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
        public JsonResult GetAllSabreDataForDetails(GridOptions options, string yearId, string budgetSetNo, string budgetType)
        {
            ResultVM result = new ResultVM { Status = MessageModel.Fail, Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new CeilingRepo();

            try
            {
                var currentBranchId = 0;
                if (Session["CurrentBranch"] != null)
                    int.TryParse(Session["CurrentBranch"].ToString(), out currentBranchId);

                options.vm.YearId = yearId;
                options.vm.BudgetSetNo = budgetSetNo;
                options.vm.BudgetType = budgetType;
                options.vm.BranchId = currentBranchId.ToString();

                options.vm.UserId = Session["UserId"].ToString();

                result = _repo.GetAllSabreDataForDetails(options);

                if (result.Status == MessageModel.Success && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<CeilingDetailVM>>(result.DataVM.ToString());

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
        public JsonResult GridDataReportType(GridOptions options, string yearId, string ReportType)
        {
            ResultVM result = new ResultVM { Status = MessageModel.Fail, Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new CeilingRepo();

            try
            {
                var currentBranchId = 0;
                if (Session["CurrentBranch"] != null)
                    int.TryParse(Session["CurrentBranch"].ToString(), out currentBranchId);

                options.vm.YearId = yearId;
                options.vm.BudgetType = ReportType;
                options.vm.BranchId = currentBranchId.ToString();

                options.vm.UserId = Session["UserId"].ToString();

                result = _repo.GridDataReportType(options);

                //var json = Newtonsoft.Json.JsonConvert.SerializeObject(result.DataVM);
                //var list = Newtonsoft.Json.JsonConvert.DeserializeObject<List<Dictionary<string, object>>>(json);

                if (result.Status == MessageModel.Success && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<CeilingDetailVM>>(result.DataVM.ToString());

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
        public JsonResult GetCeilingDetailDataById(GridOptions options, int masterId)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new CeilingRepo();

            try
            {
                result = _repo.GetCeilingDetailDataById(options, masterId);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<CeilingDetailVM>>(result.DataVM.ToString());

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

        public ActionResult BudgetTransfer(string TransactionType = "", string MenuType = "", string BudgetType = "")
        {
            CeilingVM vm = new CeilingVM();
            vm.Operation = "add";
            vm.IsActive = true;
            vm.TransactionType = TransactionType;
            vm.BudgetSetNo = 1;
            vm.TransactionDate = DateTime.Now.ToString("yyyy-MM-dd");
            vm.MenuType = MenuType;
            vm.BudgetType = BudgetType;

            return View("BudgetTransfer", vm);
        }


        public ActionResult BudgetTransferInsert(CeilingVM model)
        {
            ResultModel<CeilingVM> result = new ResultModel<CeilingVM>();
            ResultVM resultVM = new ResultVM { Status = MessageModel.Fail, Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new CeilingRepo();

            if (ModelState.IsValid)
            {
                try
                {
                    var currentBranchId = 0;
                    if (Session["CurrentBranch"] != null)
                        int.TryParse(Session["CurrentBranch"].ToString(), out currentBranchId);

                    model.BranchId = currentBranchId;
                    model.CompanyId = 9;

                    model.CreatedBy = Session["UserId"].ToString();
                    model.CreatedOn = DateTime.Now.ToString();
                    model.CreatedFrom = Ordinary.GetLocalIpAddress();
                    model.IsActive = true;
                    model.IsArchive = false;
                    model.ToGLFiscalYearId = model.GLFiscalYearId;

                    resultVM = _repo.BudgetTransfer(model);

                    if (resultVM.Status == ResultStatus.Success.ToString())
                    {
                        model = JsonConvert.DeserializeObject<CeilingVM>(resultVM.DataVM.ToString());
                        //model.Operation = "Update";
                        Session["result"] = resultVM.Status + "~" + resultVM.Message;
                        result = new ResultModel<CeilingVM>()
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

                        result = new ResultModel<CeilingVM>()
                        {
                            Status = Status.Fail,
                            Message = resultVM.Message,
                            Data = model
                        };
                        return Json(result);
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
                result = new ResultModel<CeilingVM>()
                {
                    Success = false,
                    Status = Status.Fail,
                    Message = "Model State Error!",
                    Data = model
                };
                return Json(result);
            }
        }

        [HttpPost]

        public ActionResult MultiplePost(CommonVM param)
        {
            ResultModel<CeilingVM> result = new ResultModel<CeilingVM>();

            try
            {
                _repo = new CeilingRepo();


                param.ModifyBy = Session["UserId"].ToString();
                param.ModifyFrom = Ordinary.GetLocalIpAddress();

                ResultVM resultData = _repo.MultiplePost(param);

                Session["result"] = resultData.Status + "~" + resultData.Message;

                if (resultData.Status == "Success")
                {
                    result = new ResultModel<CeilingVM>()
                    {
                        Success = true,
                        Status = Status.Success,
                        Message = resultData.Message,
                        Data = null
                    };
                }
                else
                {
                    result = new ResultModel<CeilingVM>()
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