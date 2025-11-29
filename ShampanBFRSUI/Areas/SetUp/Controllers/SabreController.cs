using Newtonsoft.Json;
using ShampanBFRS.Models;
using ShampanBFRS.Models.CommonVMs;
using ShampanBFRS.Models.Helper;
using ShampanBFRS.Models.KendoCommon;
using ShampanBFRS.Models.SetUpVMs;
using ShampanBFRS.Repo.CommonRepo;
using ShampanBFRS.Repo.SetUpRepo;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace ShampanBFRSUI.Areas.SetUp.Controllers
{
    [Authorize]
    [RouteArea("SetUp")]
    public class SabreController : Controller
    {
        SabreRepo _repo = new SabreRepo();
        CommonRepo _commonRepo = new CommonRepo();

        // GET: INS/Sabre
        public ActionResult Index()
        {
            SabresVM vm = new SabresVM();
            return View(vm);
        }

        // GET: INS/Sabre/Create
        public ActionResult Create()
        {
            SabresVM vm = new SabresVM();
            vm.Operation = "add";
            vm.IsActive = true;

            return View("Create", vm);
        }

        [HttpPost]
        public ActionResult CreateEdit(SabresVM model, HttpPostedFileBase file)
        {
            ResultModel<SabresVM> result = new ResultModel<SabresVM>();
            ResultVM resultVM = new ResultVM
            {
                Status = "Fail",
                Message = "Error",
                ExMessage = null,
                Id = "0",
                DataVM = null
            };

            _repo = new SabreRepo();

            try
            {
                var operation = (model?.Operation ?? string.Empty).ToLowerInvariant();

                if (operation == "add")
                {
                    // Session guards
                    var userId = Session?["UserId"]?.ToString();
                    if (string.IsNullOrWhiteSpace(userId))
                        return Json(new { Success = false, Status = "Fail", Message = "Session expired. Please log in again." });

                    model.CreatedBy = userId;
                    model.CreatedFrom = Ordinary.GetLocalIpAddress() ?? string.Empty;

                    
                    resultVM = _repo.Insert(model);

                    if (string.Equals(resultVM.Status, ResultStatus.Success.ToString(), StringComparison.OrdinalIgnoreCase))
                    {
                        if (resultVM.DataVM != null)
                        {
                            model = JsonConvert.DeserializeObject<SabresVM>(resultVM.DataVM.ToString());
                        }
                        model.Operation = "add";
                        Session["result"] = resultVM.Status + "~" + resultVM.Message;

                        result = new ResultModel<SabresVM>
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
                        Session["result"] = "Fail" + "~" + (resultVM.Message ?? "Unknown error");
                        result = new ResultModel<SabresVM>
                        {
                            Status = Status.Fail,
                            Message = resultVM.Message,
                            Data = model
                        };
                        return Json(result);
                    }
                }
                else if (operation == "update")
                {
                    var userId = Session?["UserId"]?.ToString();
                    if (string.IsNullOrWhiteSpace(userId))
                        return Json(new { Success = false, Status = "Fail", Message = "Session expired. Please log in again." });

                    model.LastUpdateBy = userId;
                    model.LastUpdateAt = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    model.LastUpdateFrom = Ordinary.GetLocalIpAddress() ?? string.Empty;
                

                    resultVM = _repo.Update(model);

                    if (string.Equals(resultVM.Status, ResultStatus.Success.ToString(), StringComparison.OrdinalIgnoreCase))
                    {
                        Session["result"] = resultVM.Status + "~" + resultVM.Message;
                        result = new ResultModel<SabresVM>
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
                        Session["result"] = "Fail" + "~" + (resultVM.Message ?? "Unknown error");
                        result = new ResultModel<SabresVM>
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

        // GET: INS/Sabre/Edit/5
        [HttpGet]
        public ActionResult Edit(string id)
        {
            try
            {
                _repo = new SabreRepo();

                SabresVM vm = new SabresVM();
                CommonVM param = new CommonVM();
                param.Id = id;
                ResultVM result = _repo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<SabresVM>>(result.DataVM.ToString()).FirstOrDefault();
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

        // Delete method for Sabre
        [HttpPost]
        public ActionResult Delete(SabresVM vm)
        {
            ResultModel<SabresVM> result = new ResultModel<SabresVM>();

            try
            {
                _repo = new SabreRepo();

                CommonVM param = new CommonVM();

                //param.IDs = vm.IDs;
                param.ModifyBy = Session["UserId"].ToString();
                param.ModifyFrom = Ordinary.GetLocalIpAddress();

                ResultVM resultData = _repo.Delete(param);

                Session["result"] = resultData.Status + "~" + resultData.Message;

                result = new ResultModel<SabresVM>()
                {
                    Success = true,
                    Status = Status.Success,
                    Message = resultData.Message,
                    Data = null
                };

                return Json(result);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index");
            }
        }

        // GetGridData method for Sabre
        [HttpPost]
        public JsonResult GetGridData(GridOptions options)
        {
            ResultVM result = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new SabreRepo();

            try
            {

                result = _repo.GetGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<SabresVM>>(result.DataVM.ToString());

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

        // ReportPreview method for Sabre
        [HttpPost]
        public async Task<ActionResult> ReportPreview(CommonVM param)
        {
            try
            {
                _repo = new SabreRepo();
                param.CompanyId = Session["CompanyId"] != null ? Session["CompanyId"].ToString() : "";
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

                    Response.Headers.Add("Content-Disposition", "inline; filename=SabreReport_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".pdf");

                    return File(fileBytes, "application/pdf");
                }
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                TempData["Message"] = e.Message.ToString();
                return RedirectToAction("Index", "Sabre", new { area = "INS", message = TempData["Message"] });
            }
        }
    }
}