using Newtonsoft.Json;
using ShampanBFRS.Models;
using ShampanBFRS.Models.CommonVMs;
using ShampanBFRS.Models.Helper;
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
    public class OrganogramSettingController : Controller
    {

        OrganogramSettingRepo _repo = new OrganogramSettingRepo();

        // GET: SetUp/Settings
        public ActionResult Index()
        {
            ResultVM resultVM = new ResultVM
            {
                Status = MessageModel.Fail,
                Message = "Error",
                ExMessage = null,
                Id = "0",
                DataVM = null
            };

            try
            {
                List<OrganogramSettingsVM> lst = new List<OrganogramSettingsVM>();
                CommonVM vm = new CommonVM();
                OrganogramSettingsVM model = new OrganogramSettingsVM()
                {
                    Module = "Budget",
                    TransactionType = "Ceilings",
                    IsApprovalRequired = false,
                    ApprovalLevel = 1
                };


                // Approval Level
                var approvalLevelResult = _repo.ApprovalLevelList();
                if (approvalLevelResult != null &&approvalLevelResult.Status == "Success" &&approvalLevelResult.DataVM != null)
                {
                    var approvalLevels =JsonConvert.DeserializeObject<List<ShampanBFRS.Models.CommonVMs.CommonDropDown>>
                        (
                            approvalLevelResult.DataVM.ToString()
                        );
                     model.ApprovalLevels = approvalLevels.ToDictionary( x => x.Value,x => x.Name);

                }
                else
                {
                    model.GenerateApprovalLevels(5);
                }

                model.CreatedBy =Session["UserId"]?.ToString();
                model.CreatedOn = DateTime.Now.ToString();
                model.CreatedFrom =Ordinary.GetLocalIpAddress();
                resultVM = _repo.Insert(model);
                resultVM = _repo.List(vm);
                if (resultVM.Status == "Success" && resultVM.DataVM != null)
                {

                    lst =JsonConvert.DeserializeObject<List<OrganogramSettingsVM>>
                    (
                        resultVM.DataVM.ToString()
                    );

                    // Important
                    foreach (var item in lst)
                    {
                        item.ApprovalLevels =model.ApprovalLevels;
                        item.ApprovalOptions = model.ApprovalOptions;
                    }

                }
                return View(lst);

            }
            catch (Exception ex)
            {
                Elmah.ErrorSignal.FromCurrentContext()
                     .Raise(ex);

                return View();
            }
        }



        public ActionResult Edit(OrganogramSettingsVM model)
        {
            try
            {
                model.LastUpdateAt = DateTime.Now.ToString();
                model.LastUpdateBy = Session["UserId"].ToString();
                model.LastUpdateFrom = Ordinary.GetLocalIpAddress();


                // Convert ApprovalRequired
                if (!string.IsNullOrEmpty(model.ApprovalRequired))
                {
                    model.IsApprovalRequired = model.ApprovalRequired == "Y";
                }

                // Reload Approval Dropdowns
                var approvalLevelResult = _repo.ApprovalLevelList();


                if (approvalLevelResult != null &&
                    approvalLevelResult.Status == "Success" &&
                    approvalLevelResult.DataVM != null)
                {

                    var approvalLevels =
                        JsonConvert.DeserializeObject
                        <
                            List<CommonDropDown>
                        >
                        (
                            approvalLevelResult.DataVM.ToString()
                        );

                    model.ApprovalLevels =
                        approvalLevels.ToDictionary(
                            x => x.Value,
                            x => x.Name
                        );
                }

                ResultVM result = _repo.Update(model);
                if (result.Status == "Success")
                {
                    TempData["UpdateSettings"] =
                        result.Message;
                }
                return RedirectToAction("Index");

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