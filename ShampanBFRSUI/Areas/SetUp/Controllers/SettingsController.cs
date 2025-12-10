using Newtonsoft.Json;
using ShampanBFRS.Models;
using ShampanBFRS.Models.CommonVMs;
using ShampanBFRS.Models.Helper;
using ShampanBFRS.Models.SetUpVMs;
using ShampanBFRS.Repo;
using ShampanBFRS.Repo.SetUpRepo;
using System;
using System.Collections.Generic;
using System.Web.Mvc;

namespace ShampanBFRSUI.Areas.SetUp.Controllers
{
    [Authorize]
    [RouteArea("SetUp")]
    public class SettingsController : Controller
    {

        SettingsRepo _repo = new SettingsRepo();

        // GET: SetUp/Settings
        public ActionResult Index()
        {
            ResultVM resultVM = new ResultVM { Status = MessageModel.Fail, Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            try
            {
                List<SettingsModel> lst = new List<SettingsModel>();
                CommonVM vm = new CommonVM();

                SettingsModel model = new SettingsModel()
                {
                    SettingGroup = "DMSApiUrl",
                    SettingName = "DMSApiUrl",
                    SettingType = "String",
                    SettingValue = "-",
                    IsActive = true
                };

                model.CreatedBy = Session["UserId"].ToString();
                model.CreatedOn = DateTime.Now.ToString();
                model.CreatedFrom = Ordinary.GetLocalIpAddress();

                resultVM = _repo.Insert(model);

                resultVM = _repo.List(vm);

                if (resultVM.Status == "Success" && resultVM.DataVM != null)
                {
                    lst = JsonConvert.DeserializeObject<List<SettingsModel>>(resultVM.DataVM.ToString());
                }
                else
                {
                    return RedirectToAction("Index");
                }

                return View(lst);
            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                return View();
            }
        }

        public ActionResult Edit(SettingsModel model)
        {
            try
            {
                model.LastModifiedOn = DateTime.Now.ToString();
                model.LastModifiedBy = Session["UserId"].ToString();
                model.LastUpdateFrom = Ordinary.GetLocalIpAddress();

                ResultVM result = _repo.Update(model);

                if (result.Status == "Success")
                {
                    TempData["UpdateSettings"] = result.Message;
                    return RedirectToAction("Index");
                }
                else
                {
                    return RedirectToAction("Index");
                }
            }

            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index");
            }
        }

        public ActionResult DbUpdate()
        {
            try
            {
                CommonVM model = new CommonVM();
                model.ModifyBy = Session["UserId"].ToString();
                model.ModifyFrom = Ordinary.GetLocalIpAddress();
                var result = _repo.DbUpdate(model);

                if (result.Status == "Success")
                {
                    TempData["DbUpdate"] = "DbUpdate Successfully.";
                }
                else
                {
                    TempData["DbUpdate"] = result.Message;
                }
            }

            catch (Exception e)
            {
                TempData["DbUpdate"] = e.Message;
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
            }

            return RedirectToAction("Index", "Home", new { area = "Common", branchChange = false, message = TempData["DbUpdate"] });
        }



    }
}