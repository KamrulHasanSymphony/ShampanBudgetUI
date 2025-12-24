using Newtonsoft.Json;
using ShampanBFRS.Models.CommonVMs;
using ShampanBFRS.Models.Helper;
using ShampanBFRS.Models.KendoCommon;
using ShampanBFRS.Models.SalaryAllowance;
using ShampanBFRS.Models.Sale;
using ShampanBFRS.Models.SetUpVMs;
using ShampanBFRS.Repo.CommonRepo;
using ShampanBFRS.Repo.SalaryAllowance;
using ShampanBFRS.Repo.Sale;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace ShampanBFRSUI.Areas.Sale.Controllers
{
    public class SaleController : Controller
    {

        SaleRepo _repo = new SaleRepo();
        CommonRepo _commonRepo = new CommonRepo();


        // GET: Sale/Sale
        public ActionResult Index(string BudgetType = "")
        {
            SaleHeaderVM vm = new SaleHeaderVM();
            vm.BudgetType = BudgetType;
            return View(vm);
        }

        public ActionResult DetailsIndex()
        {

            var vm = new SaleDetailVM();
            return View(vm);
        }
        public ActionResult Create(string BudgetType = "")
        {
            SaleHeaderVM vm = new SaleHeaderVM();
            vm.Operation = "add";
            vm.BudgetType = BudgetType;

            return View("Create", vm);
        }

        [HttpPost]
        public ActionResult CreateEdit(SaleHeaderVM model)
        {
            ResultModel<SaleHeaderVM> result = new ResultModel<SaleHeaderVM>();
            ResultVM resultVM = new ResultVM { Status = MessageModel.Fail, Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new SaleRepo();
            var currentBranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
            model.BranchId = Convert.ToInt32(currentBranchId);

            try
            {
                if (model.Operation.ToLower() == "add")
                {
                    model.CreatedBy = Session["UserId"].ToString();
                    model.CreatedOn = DateTime.Now.ToString();
                    model.CreatedFrom = Ordinary.GetLocalIpAddress();

                    resultVM = _repo.Insert(model);

                    if (resultVM.Status == ResultStatus.Success.ToString())
                    {
                        model = JsonConvert.DeserializeObject<SaleHeaderVM>(resultVM.DataVM.ToString());
                        model.Operation = "add";
                        Session["result"] = resultVM.Status + "~" + resultVM.Message;
                        result = new ResultModel<SaleHeaderVM>()
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

                        result = new ResultModel<SaleHeaderVM>()
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

                    resultVM = _repo.Update(model);

                    if (resultVM.Status == ResultStatus.Success.ToString())
                    {
                        Session["result"] = resultVM.Status + "~" + resultVM.Message;
                        result = new ResultModel<SaleHeaderVM>()
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

                        result = new ResultModel<SaleHeaderVM>()
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
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return View("Create", model);
            }

        }

        [HttpGet]
        public ActionResult Edit(string id)
        {
            try
            {
                _repo = new SaleRepo();

                SaleHeaderVM vm = new SaleHeaderVM();
                CommonVM param = new CommonVM();
                param.Id = id;
                ResultVM result = _repo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<SaleHeaderVM>>(result.DataVM.ToString()).FirstOrDefault();
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
        public ActionResult GetFeedPurchaseData(string id)
        {
            try
            {
                _repo = new SaleRepo();

                SaleHeaderVM vm = new SaleHeaderVM();
                CommonVM param = new CommonVM();
                param.Id = id;
                ResultVM result = _repo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<SaleHeaderVM>>(result.DataVM.ToString()).FirstOrDefault();
                }
                else
                {
                    vm = null;
                }

                vm.Operation = "update";

                return Json(vm, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index");
            }
        }

        public ActionResult NextPrevious(int id, string status)
        {
            _commonRepo = new CommonRepo();
            try
            {
                CommonVM vm = new CommonVM();
                vm.Id = id.ToString();
                vm.Status = status;
                vm.Type = "transactional";
                vm.TableName = "SaleHeaders";

                ResultVM result = _commonRepo.NextPrevious(vm);

                if (result.Id != "0")
                {
                    string url = Url.Action("Edit", "SaleHeaders", new { area = "FM", id = result.Id });
                    return Redirect(url);
                }
                else
                {
                    string url = Url.Action("Edit", "SaleHeaders", new { area = "FM", id = id });
                    return Redirect(url);
                }
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index");
            }
        }

        [HttpGet]
        public JsonResult GetSaleHeaderDetailDataById(GridOptions options, int masterId)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new SaleRepo();

            try
            {
                result = _repo.GetSaleHeaderDetailDataById(options, masterId);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<SaleDetailVM>>(result.DataVM.ToString());

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
        public ActionResult MultiplePost(CommonVM vm)
        {
            ResultModel<SaleHeaderVM> result = new ResultModel<SaleHeaderVM>();

            try
            {
                _repo = new SaleRepo();

                vm.ModifyBy = Session["UserId"].ToString();
                vm.ModifyFrom = Ordinary.GetLocalIpAddress();

                ResultVM resultData = _repo.MultiplePost(vm);

                Session["result"] = resultData.Status + "~" + resultData.Message;

                if (resultData.Status == "Success")
                {
                    result = new ResultModel<SaleHeaderVM>()
                    {
                        Success = true,
                        Status = Status.Success,
                        Message = resultData.Message,
                        Data = null
                    };
                }
                else
                {
                    result = new ResultModel<SaleHeaderVM>()
                    {
                        Success = false,
                        Status = Status.Fail,
                        Message = resultData.Message,
                        Data = null
                    };
                }

                return Json(result);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index");
            }
        }

        [HttpPost]
        public JsonResult GetGridData(GridOptions options, string budgetType = "")
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new SaleRepo();

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
                    var gridData = JsonConvert.DeserializeObject<GridEntity<SaleHeaderVM>>(result.DataVM.ToString());

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
        public JsonResult GetDetailsGridData(GridOptions options, string branchId, string isPost, string fromDate, string toDate)
        {
            ResultVM result = new ResultVM { Status = MessageModel.Fail, Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new SaleRepo();

            try
            {
                options.vm.BranchId = branchId == "0" ? "" : branchId;
                options.vm.IsPost = isPost;
                options.vm.FromDate = fromDate;
                options.vm.ToDate = toDate;

                result = _repo.GetDetailsGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<SaleDetailVM>>(result.DataVM.ToString());

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
        public async Task<ActionResult> ReportPreview(CommonVM param)
        {
            try
            {
                _repo = new SaleRepo();
                var resultStream = _repo.ReportPreview(param);

                if (resultStream == null)
                {
                    throw new Exception("Failed to generate report: No data received.");
                }

                using (var memoryStream = new MemoryStream())
                {
                    await resultStream.CopyToAsync(memoryStream);
                    byte[] fileBytes = memoryStream.ToArray();

                    if (fileBytes.Length < 1000)
                    {
                        string errorContent = Encoding.UTF8.GetString(fileBytes);
                        throw new Exception("Failed to generate report!");
                    }

                    Response.Headers.Add("Content-Disposition", "inline; filename=FeedPurchase_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".pdf");

                    return File(fileBytes, "application/pdf");
                }
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                TempData["Message"] = e.Message.ToString();
                return RedirectToAction("Index", "ChargeHeaders", new { area = " ", message = TempData["Message"] });
            }
        }

        [HttpGet]
        public JsonResult GetDetailDataById(GridOptions options, int masterId)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new SaleRepo();

            try
            {
                result = _repo.GetDetailDataById(options, masterId);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<SaleDetailVM>>(result.DataVM.ToString());

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