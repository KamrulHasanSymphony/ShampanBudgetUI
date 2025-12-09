using Newtonsoft.Json;
using ShampanBFRS.Models;
using ShampanBFRS.Models.CommonVMs;
using ShampanBFRS.Models.Helper;
using ShampanBFRS.Models.KendoCommon;
using ShampanBFRS.Models.SetUpVMs;
using ShampanBFRS.Repo.SetUpRepo;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web.Mvc;

namespace ShampanBFRSUI.Areas.SetUp.Controllers
{
    [Authorize]
    [RouteArea("SetUp")]
    public class FiscalYearController : Controller
    {
        FiscalYearsRepo _repo = new FiscalYearsRepo();
        public string YearEnd { get; set; }

        // GET: SetUp/FiscalYear
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Create()
        {
            CompanyProfileRepo _repo = new CompanyProfileRepo();
            CommonVM param = new CommonVM();
            FiscalYearsRepo _fiscalRepo = new FiscalYearsRepo();
            FiscalYearVM vm = new FiscalYearVM();
            List<FiscalYearVM> fiscalYearLists = new List<FiscalYearVM>();
            string yearStartDate = "";
            int year;

            ResultVM result = _repo.NewFiscalYear(param);

            List<FiscalYearDetailVM> detailVMs = new List<FiscalYearDetailVM>();
            //FiscalYearDetailVM dvm;
            //vm.fiscalYearDetails = detailVMs;
            //vm = DesignFiscalYear(vm);
            vm.Operation = "add";
            if (result.Status == "Success" && result.DataVM != null)
            {
                vm = JsonConvert.DeserializeObject<FiscalYearVM>(result.DataVM.ToString());
                vm.Operation = "add";
                // vm = JsonConvert.DeserializeObject<List<FiscalYearVM>>(result.DataVM.ToString()).FirstOrDefault();
            }
            else
            {
                vm = null;
            }

            return View("Create", vm);
            //yearStartDate = new DateTime(DateTime.Now.Year, 7, 1).ToString("yyyy-MM-dd");
            //vm.YearStart = yearStartDate;
            //year = DateTime.ParseExact(yearStartDate, "yyyy-MM-dd", null).Year;
            //vm.Year = year;
            //List<FiscalYearDetailVM> detailVMs = new List<FiscalYearDetailVM>();
            //FiscalYearDetailVM dvm;
            //vm.fiscalYearDetails = detailVMs;
            //vm = DesignFiscalYear(vm);
            //vm.Operation = "add";
            //return View("Create", vm);
        }
        private FiscalYearVM DesignFiscalYear(FiscalYearVM model)
        {
            try
            {
                // Attempt to parse the input date string using the correct format
                DateTime start_date;
                bool parsed = DateTime.TryParseExact(model.YearStart, new[] { "yyyy/MM/dd", "yyyy-MM-dd" }, null, System.Globalization.DateTimeStyles.None, out start_date);

                if (!parsed)
                {
                    throw new FormatException($"Invalid date format for YearStart: {model.YearStart}");
                }

                model.YearEnd = start_date.AddYears(1).AddDays(-1).ToString("yyyy/MM/dd");
                model.Year = start_date.AddYears(1).AddDays(-1).Year;

                var fvms = Enumerable.Range(0, 12)
                                     .Select(i => new FiscalYearDetailVM
                                     {
                                         MonthName = start_date.AddMonths(i).ToString("MMM-yy"),
                                         MonthStart = start_date.AddMonths(i).ToString("yyyy/MM/dd"),
                                         MonthEnd = start_date.AddMonths(i + 1).AddDays(-1).ToString("yyyy/MM/dd"),
                                         MonthId = Convert.ToInt32(start_date.AddMonths(i).ToString("yyyyMM"))
                                     })
                                     .ToList();

                model.fiscalYearDetails = fvms;
                return model;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpGet]
        public ActionResult FiscalYearSet(FiscalYearVM model)
        {
            try
            {

                DateTime start_date = DateTime.ParseExact(model.YearStart, "yyyy-MM-dd", null);
                model.YearEnd = start_date.AddYears(1).AddDays(-1).ToString("yyyy-MM-dd");
                model.Year = start_date.AddYears(1).AddDays(-1).Year;

                var fvms = Enumerable.Range(0, 12)
                                     .Select(i => new FiscalYearDetailVM
                                     {
                                         MonthName = start_date.AddMonths(i).ToString("MMM-yy"),
                                         MonthStart = start_date.AddMonths(i).ToString("dd-MMM-yyyy"),
                                         MonthEnd = start_date.AddMonths(i + 1).AddDays(-1).ToString("dd-MMM-yyyy"),
                                         MonthId = Convert.ToInt32(start_date.AddMonths(i).ToString("yyyyMM"))
                                     })
                                     .ToList();

                model.fiscalYearDetails = fvms;
                model.Operation = "add";
                return PartialView("_period", model.fiscalYearDetails);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost]
        public ActionResult CreateEdit(FiscalYearVM model)
        {
            ResultModel<FiscalYearVM> result = new ResultModel<FiscalYearVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new FiscalYearsRepo();


            try
            {
                if (model.Operation.ToLower() == "add")
                {
                    model.CreatedBy = Session["UserId"].ToString();
                    model.CreatedOn = DateTime.Now.ToString();
                    model.CreatedFrom = Ordinary.GetLocalIpAddress();

                    resultVM = _repo.Insert(model);

                    if (resultVM.Status == "Success")
                    {
                        model = JsonConvert.DeserializeObject<FiscalYearVM>(resultVM.DataVM.ToString());
                        model.Operation = "add";
                        Session["result"] = resultVM.Status + "~" + resultVM.Message;
                        result = new ResultModel<FiscalYearVM>()
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

                        result = new ResultModel<FiscalYearVM>()
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
                        result = new ResultModel<FiscalYearVM>()
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

                        result = new ResultModel<FiscalYearVM>()
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
        public ActionResult Edit(int id)
        {
            try
            {
                _repo = new FiscalYearsRepo();

                FiscalYearVM vm = new FiscalYearVM();
                CommonVM param = new CommonVM();
                param.Id = id.ToString();
                ResultVM result = _repo.List(param);
                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<FiscalYearVM>>(result.DataVM.ToString()).FirstOrDefault();
                }
                else
                {
                    vm = null;
                }

                vm.Operation = "update";
                vm.YearPeriod = vm.Year;

                return View("CreateEdit", vm);
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index");
            }
        }

        [HttpPost]
        public ActionResult Delete(FiscalYearVM vm)
        {
            ResultModel<FiscalYearVM> result = new ResultModel<FiscalYearVM>();

            try
            {
                _repo = new FiscalYearsRepo();
                CommonVM param = new CommonVM();
                param.IDs = vm.IDs;
                param.ModifyBy = Session["UserId"].ToString();
                param.ModifyFrom = Ordinary.GetLocalIpAddress();
                ResultVM resultData = _repo.Delete(param);

                Session["result"] = resultData.Status + "~" + resultData.Message;

                result = new ResultModel<FiscalYearVM>()
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

        [HttpPost]
        public JsonResult GetFiscalYearsGrid(GridOptions options)
        {

            ResultVM result = new ResultVM { Status = MessageModel.Fail, Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new FiscalYearsRepo();

            try
            {
                result = _repo.GetGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<FiscalYearVM>>(result.DataVM.ToString());

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