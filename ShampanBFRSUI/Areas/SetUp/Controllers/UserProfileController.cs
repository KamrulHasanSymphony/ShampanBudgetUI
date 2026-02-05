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
using System.IdentityModel.Protocols.WSTrust;
using System.Linq;
using System.Web.Mvc;
using Status = ShampanBFRS.Models.CommonVMs.Status;

namespace ShampanBFRSUI.Areas.SetUp.Controllers
{
    [Authorize]
    [RouteArea("SetUp")]
    public class UserProfileController : Controller
    {
        UserProfileRepo _repo = new UserProfileRepo();

        // GET: SetUp/UserProfile
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Create()
        {
            UserProfileVM vm = new UserProfileVM();
            vm.Operation = "add";
            vm.Mode = "new";

            return View("Create", vm);
        }


        [HttpPost]
        public ActionResult CreateEdit(UserProfileVM model)
        {
            _repo = new UserProfileRepo();
            ResultModel<UserProfileVM> result = new ResultModel<UserProfileVM>();
            ResultVM resultVM = new ResultVM { Status = MessageModel.Fail, Message = "Error", ExMessage = null, Id = "0", DataVM = null };

            if (ModelState.IsValid)
            {
                try
                {
                    model.CreatedOn = DateTime.Now.ToString();
                    model.CreatedBy = Session["UserId"].ToString();
                    model.CreatedFrom = Ordinary.GetLocalIpAddress();

                    if (model.Operation.ToLower() == "add")
                    {
                        resultVM = _repo.Insert(model);

                        if (resultVM.Status == ResultStatus.Success.ToString())
                        {
                            model = JsonConvert.DeserializeObject<UserProfileVM>(resultVM.DataVM.ToString());
                            model.Operation = "add";
                            Session["result"] = resultVM.Status + "~" + resultVM.Message;
                            result = new ResultModel<UserProfileVM>()
                            {
                                Success = true,
                                Status = ShampanBFRS.Models.CommonVMs.Status.Success,
                                Message = resultVM.Message,
                                Data = model
                            };
                            return Json(result);
                        }
                        else
                        {
                            Session["result"] = "Fail" + "~" + resultVM.Message;

                            result = new ResultModel<UserProfileVM>()
                            {
                                Status = Status.Fail,
                                Message = resultVM.Message,
                                Data = model
                            };
                            return Json(result);
                        }
                    }
                    else if (model.Operation.ToLower() == "update" && model.Mode.ToLower() == "passwordchange")
                    {
                        resultVM = _repo.PasswordUpdate(model);

                        if (resultVM.Status == ResultStatus.Success.ToString())
                        {
                            Session["result"] = resultVM.Status + "~" + resultVM.Message;
                            result = new ResultModel<UserProfileVM>()
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

                            result = new ResultModel<UserProfileVM>()
                            {
                                Status = Status.Fail,
                                Message = resultVM.Message,
                                Data = model
                            };
                            return Json(result);
                        }
                    }
                    else if (model.Operation.ToLower() == "update" && model.Mode.ToLower() == "profileupdate")
                    {

                        resultVM = _repo.Update(model);

                        if (resultVM.Status == ResultStatus.Success.ToString())
                        {
                            Session["result"] = resultVM.Status + "~" + resultVM.Message;
                            result = new ResultModel<UserProfileVM>()
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

                            result = new ResultModel<UserProfileVM>()
                            {
                                Status = ShampanBFRS.Models.CommonVMs.Status.Fail,
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
                result = new ResultModel<UserProfileVM>()
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
        public ActionResult Edit(string id, string mode)
        {
            try
            {
                _repo = new UserProfileRepo();

                UserProfileVM vm = new UserProfileVM();
                CommonVM param = new CommonVM();
                param.Id = id;
                ResultVM result = _repo.List(param);

                if (result.Status == "Success" && result.DataVM != null)
                {
                    vm = JsonConvert.DeserializeObject<List<UserProfileVM>>(result.DataVM.ToString()).FirstOrDefault();
                }
                else
                {
                    vm = null;
                }

                vm.Operation = "update";
                vm.Mode = mode;

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
        public JsonResult GetGridData(GridOptions options)
        {
            ResultVM result = new ResultVM { Status = MessageModel.Fail, Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new UserProfileRepo();

            try
            {
                string userId = Session["UserId"] != null ? Session["UserId"].ToString() : "";
                bool isAdmin = User.IsInRole("Admin");

                result = _repo.GetGridData(options);

                if (result.Status == "Success" && result.DataVM != null)
                {
                  var gridData = JsonConvert.DeserializeObject<GridEntity<UserProfileVM>>(result.DataVM.ToString());
                 // gridData.Items = gridData.Items.Where(user => user.UserName != "erp").ToArray();
                   if (userId.ToLower() != "erp")
                   {
                        gridData.Items = gridData.Items.Where(user => user.UserName == userId).ToArray();
                   }

                    gridData.TotalCount = gridData.Items.Count();

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