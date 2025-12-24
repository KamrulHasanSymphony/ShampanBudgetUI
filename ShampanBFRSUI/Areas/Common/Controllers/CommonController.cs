using DocumentFormat.OpenXml.Office2010.Excel;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using ShampanBFRS.Models.CommonVMs;
using ShampanBFRS.Models.SalaryAllowance;
using ShampanBFRS.Models.SetUpVMs;
using ShampanBFRS.Repo.CommonRepo;
using ShampanBFRS.Repo.SetUpRepo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace ShampanBFRSUI.Areas.Common.Controllers
{
    [Authorize]
    public class CommonController : Controller
    {
        CommonRepo _repo = new CommonRepo();
        UserBranchProfileRepo userBranchProfileRepo = new UserBranchProfileRepo();
        BranchProfileRepo _branchRepo = new BranchProfileRepo();

        // GET: Common/Common
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public ActionResult SettingsValue(string value)
        {
            try
            {
                List<CommonVM> lst = new List<CommonVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.GetSettingsValue(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<CommonVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpGet]
        public ActionResult _getProductModal()
        {
            return PartialView("_getProductModal");
        }

        [HttpGet]
        public ActionResult _getMeasurementModal()
        {
            return PartialView("_getMeasurementModal");
        }
        [HttpGet]
        public ActionResult _getMeasurementForOrderModal()
        {
            return PartialView("_getMeasurementForOrderModal");
        }
        [HttpGet]
        public ActionResult _getItemDesignModal()
        {
            return PartialView("_getItemDesignModal");
        }
        [HttpGet]
        public ActionResult _getViewMeasurementForOrderModal()
        {
            return PartialView("_getViewMeasurementForOrderModal");
        }

        [HttpGet]
        public ActionResult _getItemModal()
        {
            return PartialView("_getItemModal");
        } 
        [HttpGet]
        public ActionResult _getSegmentModal()
        {
            return PartialView("_getSegmentModal");
        }
        [HttpGet]
        public ActionResult _getProductList()
        {
            return PartialView("_getProductList");
        }


        [HttpGet]
        public ActionResult _getPersonnelCategoriesList()
        {
            return PartialView("_getPersonnelCategoriesList");
        }



        public ActionResult _getProductBudget()
        {
            return PartialView("_getProductBudget");
        }


        [HttpGet]
        public ActionResult _getDesignCategoryModal()
        {
            return PartialView("_getDesignCategoryModal");
        }
        [HttpGet]
        public ActionResult _getUomModal()
        {
            return PartialView("_getUomModal");
        }
        [HttpGet]
        public ActionResult _getFabricSourceModal()
        {
            return PartialView("_getFabricSourceModal");
        }
        [HttpGet]
        public ActionResult _getDesignTypeModal()
        {
            return PartialView("_getDesignTypeModal");
        }
        [HttpGet]
        public ActionResult _getDesignFollowedModal()
        {
            return PartialView("_getDesignFollowedModal");
        }

        [HttpPost]
        public ActionResult GetProductData()
        {
            try
            {
                _repo = new CommonRepo();

                ProductVM vm = new ProductVM();
                var search = Request.Form["search[value]"].Trim();

                var startRec = Request.Form["start"].ToString();
                var pageSize = Request.Form["length"].ToString();
                var orderColumnIndex = Request.Form["order[0][column]"].ToString();
                var orderDir = Request.Form["order[0][dir]"].ToString();
                var orderName = Request.Form[$"columns[{orderColumnIndex}][name]"].ToString();

                vm.PeramModel.SearchValue = search;
                vm.PeramModel.OrderName = orderName == "" ? "P.Id" : orderName;
                vm.PeramModel.orderDir = orderDir;
                vm.PeramModel.startRec = Convert.ToInt32(startRec);
                vm.PeramModel.pageSize = Convert.ToInt32(pageSize);
                vm.PeramModel.BranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
                vm.PeramModel.FromDate = Request.Form["FromDate"];

                //vm.ProductCode = search;
                //vm.ProductName = search;
                vm.Status = search;

                ResultVM result = _repo.GetProductModalData(vm);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var jArray = result.DataVM as JArray;
                    if (jArray != null)
                    {
                        var data = jArray.ToObject<List<ProductVM>>();
                        return Json(new
                        {
                            draw = Request.Form["draw"],
                            recordsTotal = result.Count,
                            recordsFiltered = result.Count,
                            data = data
                        }, JsonRequestBehavior.AllowGet);
                    }
                }

                return Json(new
                {
                    draw = Request.Form["draw"],
                    recordsTotal = 0,
                    recordsFiltered = 0,
                    data = new List<ProductVM>()
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new
                {
                    draw = Request.Form["draw"],
                    recordsTotal = 0,
                    recordsFiltered = 0,
                    data = new List<ProductVM>()
                }, JsonRequestBehavior.AllowGet);
            }
        } 
        
        [HttpPost]
        public ActionResult GetSegmentData()
        {
            try
            {
                _repo = new CommonRepo();

                SegmentVM vm = new SegmentVM();
                var search = Request.Form["search[value]"].Trim();

                var startRec = Request.Form["start"].ToString();
                var pageSize = Request.Form["length"].ToString();
                var orderColumnIndex = Request.Form["order[0][column]"].ToString();
                var orderDir = Request.Form["order[0][dir]"].ToString();
                var orderName = Request.Form[$"columns[{orderColumnIndex}][name]"].ToString();

                vm.PeramModel.SearchValue = search;
                vm.PeramModel.OrderName = orderName == "" ? "P.Id" : orderName;
                vm.PeramModel.orderDir = orderDir;
                vm.PeramModel.startRec = Convert.ToInt32(startRec);
                vm.PeramModel.pageSize = Convert.ToInt32(pageSize);
                vm.PeramModel.BranchId = Session["CurrentBranch"] != null ? Session["CurrentBranch"].ToString() : "0";
                vm.PeramModel.FromDate = Request.Form["FromDate"];

                //vm.ProductCode = search;
                //vm.ProductName = search;
                vm.Status = search;

                ResultVM result = _repo.GetSegmentData(vm);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var jArray = result.DataVM as JArray;
                    if (jArray != null)
                    {
                        var data = jArray.ToObject<List<SegmentVM>>();
                        return Json(new
                        {
                            draw = Request.Form["draw"],
                            recordsTotal = result.Count,
                            recordsFiltered = result.Count,
                            data = data
                        }, JsonRequestBehavior.AllowGet);
                    }
                }

                return Json(new
                {
                    draw = Request.Form["draw"],
                    recordsTotal = 0,
                    recordsFiltered = 0,
                    data = new List<ProductVM>()
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new
                {
                    draw = Request.Form["draw"],
                    recordsTotal = 0,
                    recordsFiltered = 0,
                    data = new List<ProductVM>()
                }, JsonRequestBehavior.AllowGet);
            }
        }
       

        [HttpGet]
        public ActionResult GetBooleanDropDown()
        {
            _repo = new CommonRepo();
            try
            {
                var result = _repo.GetBooleanDropDown();
                return Json(result.Data, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }


        //[HttpGet]
        //public ActionResult GetCustomerList(string value)
        //{
        //    try
        //    {
        //        List<CustomerVM> lst = new List<CustomerVM>();
        //        CommonVM param = new CommonVM();
        //        param.Value = value;
        //        ResultVM result = _repo.GetCustomerList(param);

        //        if (result.Status == "Success" && result.DataVM != null)
        //        {
        //            lst = JsonConvert.DeserializeObject<List<CustomerVM>>(result.DataVM.ToString());
        //        }
        //        return Json(lst, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        Elmah.ErrorSignal.FromCurrentContext().Raise(e);
        //        return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        [HttpGet]
        public ActionResult GetEnumTypeList(string EnumType)
        {
            try
            {
                List<EnumTypeVM> lst = new List<EnumTypeVM>();
                CommonVM param = new CommonVM();
                param.Value = EnumType.ToString();
                ResultVM result = _repo.GetEnumTypeList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<EnumTypeVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult GetCompanyTypeList(string value)
        {
            try
            {
                List<EnumTypeVM> lst = new List<EnumTypeVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.EnumList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<EnumTypeVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult GetBranchProfileList(string value)
        {
            try
            {
                List<BranchProfileVM> lst = new List<BranchProfileVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.EnumList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<BranchProfileVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpGet]
        public ActionResult GetBranchList(string value)
        {
            try
            {
                List<BranchProfileVM> lst = new List<BranchProfileVM>();
                CommonVM param = new CommonVM();
                ResultVM result = new ResultVM();
                param.Value = value;
                param.UserId = Session["UserId"] != null ? Session["UserId"].ToString() : "";

                if (Session["UserId"] != null && Session["UserId"].ToString().ToLower() == "erp")
                {

                    param.UserId = Session["UserId"].ToString();
                    result = _branchRepo.List(param);
                }
                else
                {
                    userBranchProfileRepo = new UserBranchProfileRepo();
                    param.UserId = Session["UserId"].ToString();
                    result = userBranchProfileRepo.List(param);
                }

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<BranchProfileVM>>(result.DataVM.ToString());
                }

                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }


        public ActionResult BranchLoading(string UserId)
        {
            UserBranchProfileVM model = new UserBranchProfileVM();
            model.Operation = "add";
            model.UserId = UserId;
            return PartialView("_branchLoading", model);
        }

        [HttpGet]
        public ActionResult GetQuestionSetDataForItem()
        {
            try
            {
                // Define a list to hold the data you want to return
                //List<QuestionSetVM> lst = new List<QuestionSetVM>();

                // Create a new instance of your parameter model (if required)
                CommonVM param = new CommonVM();

                // Fetch data from your repository (ensure the repo method is implemented)
                //ResultVM result = _repo.GetQuestionSetDataForItem(param);

                // Check if the data retrieval was successful
                //if (result.Status == "Success" && result.DataVM != null)
                //{
                //    // Deserialize the fetched data into your model
                //    lst = JsonConvert.DeserializeObject<List<QuestionSetVM>>(result.DataVM.ToString());
                //}

                // Return the data as JSON response
                //return Json(lst, JsonRequestBehavior.AllowGet);

                return Json(new { Error = true, Message = "Not Implemented" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                // Log any exceptions (for debugging and tracking purposes)
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);

                // Return an error message if something went wrong
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult GetFiscalYearComboBox(string value)
        {
            try
            {
                List<EnumTypeVM> lst = new List<EnumTypeVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.GetFiscalYearComboBox(param);

                if (result.Status == MessageModel.Success && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<EnumTypeVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpGet]
        public ActionResult GetCOAList(string value)
        {
            try
            {
                List<COAVM> lst = new List<COAVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.GetCOAList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<COAVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpGet]
        public ActionResult GetDepartmentList(string value)
        {
            try
            {
                List<DepartmentVM> lst = new List<DepartmentVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.GetDepartmentList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<DepartmentVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult GetSabreList(string value)
        {
            try
            {
                List<SabresVM> lst = new List<SabresVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.GetSabreList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<SabresVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult GetCOAGroupList(string value)
        {
            try
            {
                List<COAGroupVM> lst = new List<COAGroupVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.GetCOAGroupList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<COAGroupVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult GetStructureList(string value)
        {
            try
            {
                List<StructureVM> lst = new List<StructureVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.GetStructureList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<StructureVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult GetProductGroupList(string value)
        {
            try
            {
                List<ProductGroupVM> lst = new List<ProductGroupVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.GetProductGroupList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<ProductGroupVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult ProductList(string value)
        {
            try
            {
                List<ProductVM> lst = new List<ProductVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.ProductList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<ProductVM>>(result.DataVM.ToString());
                }
                return Json(new
                {
                    draw = Request["draw"],
                    recordsTotal = lst.Count,
                    recordsFiltered = lst.Count,
                    data = lst
                }, JsonRequestBehavior.AllowGet);
                //return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpPost]
        public ActionResult PersonnelCategoriesList(string value)
        {
            try
            {
                List<PersonnelCategoriesVM> lst = new List<PersonnelCategoriesVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.PersonnelCategoriesList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<PersonnelCategoriesVM>>(result.DataVM.ToString());
                }
                return Json(new
                {
                    draw = Request["draw"],
                    recordsTotal = lst.Count,
                    recordsFiltered = lst.Count,
                    data = lst
                }, JsonRequestBehavior.AllowGet);
                //return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult GetChargeGroupList(string value)
        {
            try
            {
                List<ChargeGroupVM> lst = new List<ChargeGroupVM>();
                CommonVM param = new CommonVM();
                param.Value = value;
                ResultVM result = _repo.GetChargeGroupList(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<ChargeGroupVM>>(result.DataVM.ToString());
                }
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }




    }
}