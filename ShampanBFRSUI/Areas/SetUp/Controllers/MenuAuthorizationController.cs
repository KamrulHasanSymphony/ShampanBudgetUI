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
    public class MenuAuthorizationController : Controller
    {
        // GET: SetUp/MenuAuthorization
        MenuAuthorizationRepo _repo = new MenuAuthorizationRepo();


        #region Role
        public ActionResult Role()
        {
            return View();
        }

        [HttpPost]
        public JsonResult RoleIndex(GridOptions options)
        {
            _repo = new MenuAuthorizationRepo();
            try
            {
                var gridData = _repo.RoleIndex(options);

                return Json(new
                {
                    Items = gridData.Items,
                    TotalCount = gridData.TotalCount
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult RoleCreate()
        {
            _repo = new MenuAuthorizationRepo();
            try
            {
                UserRoleVM vm = new UserRoleVM();
                vm.Operation = "add";
                return View("RoleCreateEdit", vm);
            }
            catch (Exception ex)
            {
                Session["result"] = "Fail" + "~" + ex.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                throw ex;
            }
        }

        [HttpPost]
        public ActionResult RoleCreateEdit(UserRoleVM model)
        {
            ResultModel<UserRoleVM> result = new ResultModel<UserRoleVM>();
            ResultVM resultVM = new ResultVM { Status = MessageModel.Fail, Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new MenuAuthorizationRepo();

            if (ModelState.IsValid)
            {
                try
                {
                    model.CreatedBy = Session["UserId"].ToString();
                    model.CreatedOn = DateTime.Now.ToString();
                    model.CreatedFrom = Ordinary.GetLocalIpAddress();

                    resultVM = _repo.RoleCreateEdit(model);

                    if (resultVM.Status == ResultStatus.Success.ToString())
                    {
                        model.Id = Convert.ToInt32(resultVM.Id);
                        Session["result"] = resultVM.Status + "~" + resultVM.Message;
                        result = new ResultModel<UserRoleVM>()
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

                        result = new ResultModel<UserRoleVM>()
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
                    Session["result"] = "Fail" + "~" + e.Message;
                    Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                    result = new ResultModel<UserRoleVM>()
                    {
                        Status = Status.Fail,
                        Message = e.Message,
                        Data = model
                    };
                    return Json(result);
                }
            }
            return View("Create", model);

        }

        public ActionResult RoleEdit(int id)
        {
            _repo = new MenuAuthorizationRepo();
            try
            {
                ResultModel<List<UserRoleVM>> result = _repo.GetRoleAll(id);

                UserRoleVM vm = result.Data.FirstOrDefault();
                vm.Operation = "update";
                vm.Id = id;
                return View("RoleCreateEdit", vm);
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Role");
            }
        }

        #endregion

        #region UserGroup
        public ActionResult UserGroup()
        {
            return View();
        }

        [HttpPost]
        public JsonResult UserGroupIndex(GridOptions options)
        {
            _repo = new MenuAuthorizationRepo();
            try
            {
                var gridData = _repo.UserGroupIndex(options);

                return Json(new
                {
                    Items = gridData.Items,
                    TotalCount = gridData.TotalCount
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult UserGroupCreate()
        {
            _repo = new MenuAuthorizationRepo();
            try
            {
                UserGroupVM vm = new UserGroupVM();
                vm.Operation = "add";
                return View("UserGroupCreateEdit", vm);
            }
            catch (Exception ex)
            {
                Session["result"] = "Fail" + "~" + ex.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                throw ex;
            }
        }

        [HttpPost]
        public ActionResult UserGroupCreateEdit(UserGroupVM model)
        {
            ResultModel<UserGroupVM> result = new ResultModel<UserGroupVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new MenuAuthorizationRepo();

            if (ModelState.IsValid)
            {
                try
                {
                    model.CreatedBy = Session["UserId"].ToString();
                    model.CreatedOn = DateTime.Now.ToString();
                    model.CreatedFrom = Ordinary.GetLocalIpAddress();

                    resultVM = _repo.UserGroupCreateEdit(model);

                    if (resultVM.Status == ResultStatus.Success.ToString())
                    {
                        model.Id = Convert.ToInt32(resultVM.Id);
                        Session["result"] = resultVM.Status + "~" + resultVM.Message;
                        result = new ResultModel<UserGroupVM>()
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

                        result = new ResultModel<UserGroupVM>()
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
                    Session["result"] = "Fail" + "~" + e.Message;
                    Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                    result = new ResultModel<UserGroupVM>()
                    {
                        Status = Status.Fail,
                        Message = e.Message,
                        Data = model
                    };
                    return Json(result);
                }
            }
            return View("Create", model);

        }

        [HttpGet]
        public ActionResult UserGroupEdit(int id)
        {
            _repo = new MenuAuthorizationRepo();
            try
            {
                ResultModel<List<UserGroupVM>> result = _repo.GetUserGroupAll(id);

                UserGroupVM vm = result.Data.FirstOrDefault();
                vm.Operation = "update";
                vm.Id = id;
                return View("UserGroupCreateEdit", vm);
            }
            catch (Exception e)
            {
                Session["result"] = "Fail" + "~" + e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("UserGroup");
            }
        }

        [HttpGet]
        public ActionResult UserGroupMenuEdit(int id)
        {
            _repo = new MenuAuthorizationRepo();
            try
            {
                RoleMenuVM vm = new RoleMenuVM();

                ResultModel<List<UserGroupVM>> result = _repo.GetUserGroupAll(id);

                vm.roleMenuList = new List<RoleMenuVM>();
                vm.RoleId = "0";
                vm.UserGroupId = id.ToString();
                vm.UserGroupName = result.Data.FirstOrDefault().Name;
                vm.RoleName = result.Data.FirstOrDefault().Name;
                vm.Type = "User Group";
                vm.Operation = "update";

                if (id > 0)
                {
                    var menuData = _repo.GetUserGroupWiseMenuAccessData(id);
                    vm.roleMenuList = menuData.Data;
                }

                return View("RoleMenuCreateEdit", vm);
            }
            catch (Exception ex)
            {
                Session["result"] = "Fail" + "~" + ex.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                throw ex;
            }
        }

        public ActionResult UserGroupMenuCreateEdit(RoleMenuVM model)
        {
            ResultModel<RoleMenuVM> result = new ResultModel<RoleMenuVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new MenuAuthorizationRepo();

            if (ModelState.IsValid)
            {
                try
                {
                    model.CreatedBy = Session["UserId"].ToString();
                    model.CreatedOn = DateTime.Now.ToString();
                    model.CreatedFrom = Ordinary.GetLocalIpAddress();

                    resultVM = _repo.UserGroupMenuCreateEdit(model);

                    if (resultVM.Status == ResultStatus.Success.ToString())
                    {
                        model.Operation = "add";
                        Session["result"] = resultVM.Status + "~" + resultVM.Message;
                        result = new ResultModel<RoleMenuVM>()
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

                        result = new ResultModel<RoleMenuVM>()
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
                    Session["result"] = "Fail" + "~" + e.Message;
                    Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                    return View("Create", model);
                }
            }
            return View("Create", model);
        }

        #endregion

        #region Role Menu

        public ActionResult RoleMenu()
        {
            return View();
        }

        [HttpPost]
        public JsonResult RoleMenuIndex(GridOptions options)
        {
            _repo = new MenuAuthorizationRepo();
            try
            {
                var gridData = _repo.RoleIndex(options);

                return Json(new
                {
                    Items = gridData.Items,
                    TotalCount = gridData.TotalCount
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult Create()
        {
            try
            {
                RoleMenuVM vm = new RoleMenuVM();
                vm.roleMenuList = new List<RoleMenuVM>();
                vm.Operation = "add";
                return View("RoleMenuCreateEdit", vm);
            }
            catch (Exception ex)
            {
                Session["result"] = "Fail" + "~" + ex.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                throw ex;
            }
        }

        public ActionResult RoleMenuEdit(int id)
        {
            _repo = new MenuAuthorizationRepo();
            try
            {
                RoleMenuVM vm = new RoleMenuVM();

                ResultModel<List<UserRoleVM>> result = _repo.GetRoleAll(id);

                vm.roleMenuList = new List<RoleMenuVM>();
                vm.RoleId = id.ToString();
                vm.UserGroupId = "0";
                vm.RoleName = result.Data.FirstOrDefault().Name;
                vm.Type = "User Role";
                vm.Operation = "update";

                if (id > 0)
                {
                    var menuData = _repo.GetMenuAccessData(id);
                    vm.roleMenuList = menuData.Data;
                }

                return View("RoleMenuCreateEdit", vm);
            }
            catch (Exception ex)
            {
                Session["result"] = "Fail" + "~" + ex.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                throw ex;
            }
        }

        public ActionResult GetUserRoleData(string roleId)
        {
            _repo = new MenuAuthorizationRepo();
            try
            {
                RoleMenuVM vm = new RoleMenuVM();

                if (!string.IsNullOrEmpty(roleId))
                {
                    var result = _repo.GetMenuAccessData(Convert.ToInt32(roleId));
                    vm.roleMenuList = result.Data;
                    vm.RoleId = roleId;
                }
                else
                {
                    vm.roleMenuList = new List<RoleMenuVM>();
                }

                return Json(vm.roleMenuList);
            }
            catch (Exception ex)
            {
                Session["result"] = "Fail" + "~" + ex.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                throw ex;
            }
        }

        public ActionResult RoleMenuCreateEdit(RoleMenuVM model)
        {
            ResultModel<RoleMenuVM> result = new ResultModel<RoleMenuVM>();
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new MenuAuthorizationRepo();

            if (ModelState.IsValid)
            {
                try
                {
                    model.CreatedBy = Session["UserId"].ToString();
                    model.CreatedOn = DateTime.Now.ToString();
                    model.CreatedFrom = Ordinary.GetLocalIpAddress();

                    resultVM = _repo.RoleMenuCreateEdit(model);

                    if (resultVM.Status == ResultStatus.Success.ToString())
                    {
                        model.Operation = "add";
                        Session["result"] = resultVM.Status + "~" + resultVM.Message;
                        result = new ResultModel<RoleMenuVM>()
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

                        result = new ResultModel<RoleMenuVM>()
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
                    Session["result"] = "Fail" + "~" + e.Message;
                    Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                    return View("Create", model);
                }
            }
            return View("Create", model);
        }

        #endregion                      

        #region User Menu

        public ActionResult UserMenu()
        {
            try
            {
                return View();
            }
            catch (Exception ex)
            {
                Session["result"] = "Fail" + "~" + ex.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                throw ex;
            }
        }

        [HttpPost]
        public JsonResult UserMenuIndex(GridOptions options)
        {
            _repo = new MenuAuthorizationRepo();
            try
            {
                var gridData = _repo.UserMenuIndex(options);

                return Json(new
                {
                    Items = gridData.Items,
                    TotalCount = gridData.TotalCount
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult UserMenuCreate()
        {
            _repo = new MenuAuthorizationRepo();
            try
            {
                UserMenuVM vm = new UserMenuVM();
                vm.userMenuList = new List<UserMenuVM>();
                vm.Operation = "add";
                return View("UserMenuCreateEdit", vm);
            }
            catch (Exception ex)
            {
                Session["result"] = "Fail" + "~" + ex.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                throw ex;
            }
        }

        public ActionResult UserMenuEdit(int? roleId, string userId)
        {
            _repo = new MenuAuthorizationRepo();
            try
            {
                UserMenuVM vm = new UserMenuVM();

                vm.RoleId = roleId > 0 ? Convert.ToInt32(roleId) : 0;
                vm.UserId = userId;
                vm.Operation = "update";

                if (roleId > 0 && !string.IsNullOrEmpty(userId))
                {
                    var result = _repo.GetUserMenuAccessData(Convert.ToInt32(roleId), userId);
                    vm.userMenuList = result.Data;
                }
                else
                {
                    vm.userMenuList = new List<UserMenuVM>();
                }

                return View("UserMenuCreateEdit", vm);
            }
            catch (Exception ex)
            {
                Session["result"] = "Fail" + "~" + ex.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                throw ex;
            }
        }

        public ActionResult GetAssignedData(string roleId, string userId)
        {
            _repo = new MenuAuthorizationRepo();
            try
            {
                UserMenuVM vm = new UserMenuVM();

                if (!string.IsNullOrEmpty(roleId) && !string.IsNullOrEmpty(userId))
                {
                    var result = _repo.GetUserMenuAccessData(Convert.ToInt32(roleId), userId);
                    vm.userMenuList = result.Data;
                    vm.RoleId = Convert.ToInt32(roleId);
                    vm.UserId = userId;
                }
                else
                {
                    vm.userMenuList = new List<UserMenuVM>();
                }

                return Json(vm.userMenuList);
            }
            catch (Exception ex)
            {
                Session["result"] = "Fail" + "~" + ex.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                throw ex;
            }
        }

        public ActionResult GetUserRoleWiseData(string roleId)
        {
            _repo = new MenuAuthorizationRepo();
            try
            {
                UserMenuVM vm = new UserMenuVM();

                if (!string.IsNullOrEmpty(roleId))
                {
                    var result = _repo.GetUserRoleWiseMenuAccessData(Convert.ToInt32(roleId));
                    vm.userMenuList = result.Data;
                }
                else
                {
                    vm.userMenuList = new List<UserMenuVM>();
                }

                return Json(vm.userMenuList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Session["result"] = "Fail" + "~" + ex.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                throw ex;
            }
        }

        public ActionResult UserMenuCreateEdit(UserMenuVM model)
        {
            ResultModel<UserMenuVM> result = new ResultModel<UserMenuVM>();
            ResultVM resultVM = new ResultVM { Status = MessageModel.Fail, Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new MenuAuthorizationRepo();

            if (ModelState.IsValid)
            {
                try
                {
                    model.CreatedBy = Session["UserId"].ToString();
                    model.CreatedOn = DateTime.Now.ToString();
                    model.CreatedFrom = Ordinary.GetLocalIpAddress();

                    resultVM = _repo.UserMenuCreateEdit(model);

                    if (resultVM.Status == ResultStatus.Success.ToString())
                    {
                        model.Operation = "add";
                        Session["result"] = resultVM.Status + "~" + resultVM.Message;
                        result = new ResultModel<UserMenuVM>()
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

                        result = new ResultModel<UserMenuVM>()
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
                    Session["result"] = "Fail" + "~" + e.Message;
                    Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                    return View("Create", model);
                }
            }
            return View("Create", model);
        }

        #endregion

        #region Common

        [HttpGet]
        public ActionResult GetRoleData()
        {
            _repo = new MenuAuthorizationRepo();
            try
            {
                var result = _repo.GetRoleData();
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult GetUserGroupData()
        {
            _repo = new MenuAuthorizationRepo();
            try
            {
                var result = _repo.GetUserGroupData();
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return Json(new { Error = true, Message = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        #endregion

    }
}