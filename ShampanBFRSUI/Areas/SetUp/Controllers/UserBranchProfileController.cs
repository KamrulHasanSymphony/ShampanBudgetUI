using Newtonsoft.Json;
using ShampanBFRS.Models;
using ShampanBFRS.Models.CommonVMs;
using ShampanBFRS.Models.Helper;
using ShampanBFRS.Models.KendoCommon;
using ShampanBFRS.Models.SetUpVMs;
using ShampanBFRS.Repo;
using ShampanBFRS.Repo.SetUpRepo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace ShampanBFRSUI.Areas.SetUp.Controllers
{
    [Authorize]
    [RouteArea("SetUp")]
    public class UserBranchProfileController : Controller
    {

        UserBranchProfileRepo _repo = new UserBranchProfileRepo();

        // GET: SetUp/UserBranchProfile
        public ActionResult Index(string Id)
        {
            UserBranchProfileVM model = new UserBranchProfileVM();
            model.UserId = Id;
            return View(model);
        }

        public ActionResult Create()
        {
            UserBranchProfileVM vm = new UserBranchProfileVM();
            vm.Operation = "add";

            return View("Create", vm);
        }

        [HttpPost]
        public ActionResult CreateEdit(UserBranchProfileVM model)
        {
            ResultModel<UserBranchProfileVM> result = new ResultModel<UserBranchProfileVM>();
            ResultVM resultVM = new ResultVM { Status = MessageModel.Fail, Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new UserBranchProfileRepo();

            if (ModelState.IsValid)
            {
                try
                {
                    if (model.Operation.ToLower() == "add")
                    {
                        model.CreatedBy = Session["UserId"].ToString();
                        model.CreatedOn = DateTime.Now.ToString();
                        model.CreatedFrom = Ordinary.GetLocalIpAddress();

                        if (model.IDs.Count > 0)
                        {
                            foreach (var item in model.IDs)
                            {
                                model.BranchId = Convert.ToInt32(item);

                                resultVM = _repo.Insert(model);
                            }
                        }
                        else
                        {
                            resultVM = _repo.Insert(model);
                        }

                        if (resultVM.Status == ResultStatus.Success.ToString())
                        {
                            model = JsonConvert.DeserializeObject<UserBranchProfileVM>(resultVM.DataVM.ToString());
                            model.Operation = "add";
                            Session["result"] = resultVM.Status + "~" + resultVM.Message;
                            result = new ResultModel<UserBranchProfileVM>()
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

                            result = new ResultModel<UserBranchProfileVM>()
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
                            result = new ResultModel<UserBranchProfileVM>()
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

                            result = new ResultModel<UserBranchProfileVM>()
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
            return View("Create", model);

        }

        [HttpGet]
        public ActionResult Edit(string id)
        {
            try
            {
                _repo = new UserBranchProfileRepo();

                UserBranchProfileVM vm = new UserBranchProfileVM();
                CommonVM param = new CommonVM();
                param.Id = id;
                ResultVM result = _repo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<UserBranchProfileVM>>(result.DataVM.ToString()).FirstOrDefault();
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
        public JsonResult GetGridData(GridOptions options, string userId)
        {
            ResultVM result = new ResultVM { Status = MessageModel.Fail, Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new UserBranchProfileRepo();

            try
            {
                CommonVM param = new CommonVM();
                param.UserId = userId;
                result = _repo.GetGridData(options, param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    var gridData = JsonConvert.DeserializeObject<GridEntity<UserBranchProfileVM>>(result.DataVM.ToString());

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