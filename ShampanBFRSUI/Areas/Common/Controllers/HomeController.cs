using Newtonsoft.Json;
using ShampanBFRS.Models.CommonVMs;
using ShampanBFRS.Models.SetUpVMs;
using ShampanBFRS.Repo.CommonRepo;
using ShampanBFRS.Repo.SetUpRepo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace ShampanBFRSUI.Areas.Common.Controllers
{
    public class HomeController : Controller
    {
        CommonRepo _repo = new CommonRepo();

        // GET: Common/Home
        public ActionResult Index(bool branchChange=false)
        {
            try
            {
                if (User.Identity.IsAuthenticated || (Session["UserId"] != null && !string.IsNullOrEmpty(Session["UserId"].ToString())))
                {
                    List<BranchProfileVM> branchProfiles = new List<BranchProfileVM>();

                    if (branchChange)
                    {
                        return View(branchProfiles);
                    }

                    if (Session["UserId"] != null)
                    {
                        if (Session["CurrentBranch"] == null)
                        {
                            branchProfiles = new List<BranchProfileVM>();
                        }
                        else
                        {
                            BranchProfileVM branch = new BranchProfileVM
                            {
                                BranchID = 0,
                                BranchCode = "",
                            };
                            branchProfiles.Add(branch);
                        }
                    }

                    return View(branchProfiles);
                }
                else
                {
                    return RedirectToAction("Index", "Login", new { area = (string)null });
                }
            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                return RedirectToAction("Index", "Login", new { area = (string)null });
            }
        }
        [HttpGet]
        public JsonResult LoadBranchProfiles()
        {
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };

            try
            {
                BranchProfileRepo _branchRepo = new BranchProfileRepo();
                CommonVM vm = new CommonVM();
                List<BranchProfileVM> lst = new List<BranchProfileVM>();

                if (Session["UserId"] != null && Session["UserId"].ToString().ToLower() == "erp")
                {

                    vm.UserId = Session["UserId"].ToString();
                    resultVM = _branchRepo.List(vm);
                }
                else
                {
                    UserBranchProfileRepo userBranchProfileRepo = new UserBranchProfileRepo();
                    vm.UserId = Session["UserId"].ToString();
                    resultVM = userBranchProfileRepo.List(vm);
                }


                if (resultVM.Status == ResultStatus.Success.ToString())
                {
                    lst = JsonConvert.DeserializeObject<List<BranchProfileVM>>(resultVM.DataVM.ToString());
                    lst = lst.Where(b => b.IsActive == true).ToList();
                }

                return Json(new
                {
                    data = lst,
                    draw = "",
                    recordsTotal = lst.Count,
                    recordsFiltered = lst.Count
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new
                {
                    data = "",
                    draw = "",
                    recordsTotal = 0,
                    recordsFiltered = 0
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public async Task<ActionResult> AssignBranch(BranchProfileVM branch)
        {
            ResultVM resultVM = new ResultVM { Status = "Fail", Message = "Error", ExMessage = null, Id = "0", DataVM = null };


            try
            {
                if (!string.IsNullOrEmpty(branch.BranchCode))
                {
                    BranchProfileRepo _branchRepo = new BranchProfileRepo();
                    CommonVM vm = new CommonVM();
                    List<BranchProfileVM> lst = new List<BranchProfileVM>();
                    vm.UserId = branch.UserId;
                    resultVM = _branchRepo.List(vm);

                    if (resultVM.Status == ResultStatus.Success.ToString())
                    {
                        lst = JsonConvert.DeserializeObject<List<BranchProfileVM>>(resultVM.DataVM.ToString());
                    }

                    branch.BranchID = lst.FirstOrDefault(x => x.Code == branch.BranchCode).Id;
                    branch.BranchName = lst.FirstOrDefault(x => x.Code == branch.BranchCode).Name;
                }

                if (branch.BranchID == 0) return RedirectToAction("Index");

                var identity = new ClaimsIdentity(User.Identity);
                identity.AddClaim(new Claim(ClaimNames.CurrentBranch, branch.BranchID.ToString()));
                identity.AddClaim(new Claim(ClaimNames.CurrentBranchCode, branch.BranchCode.ToString()));
                identity.AddClaim(new Claim(ClaimNames.CurrentBranchName, branch.BranchName.ToString().Trim()));

                var principal = new ClaimsPrincipal(identity);

                var ticket = new FormsAuthenticationTicket(
                    1, // Ticket version
                    branch.UserId.ToString(), // Username
                    DateTime.Now, // Issue time
                    DateTime.Now.AddMinutes(30), // Expiration time
                    false, // Is persistent (for remember me)
                    $"{branch.BranchID}|{branch.BranchCode}|{branch.BranchName}",
                    FormsAuthentication.FormsCookiePath);

                string encryptedTicket = FormsAuthentication.Encrypt(ticket);

                var cookie = new HttpCookie(FormsAuthentication.FormsCookieName, encryptedTicket)
                {
                    Expires = ticket.Expiration,
                    Path = FormsAuthentication.FormsCookiePath
                };

                Response.Cookies.Add(cookie);

                Session["CurrentBranch"] = branch.BranchID.ToString();
                Session["CurrentBranchCode"] = branch.BranchCode;
                Session["CurrentBranchName"] = branch.BranchName;
                Session["UserId"] = branch.UserId.ToString();

            }
            catch (Exception e)
            {
                Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                System.Diagnostics.Trace.TraceError($"Error: {e.Message}\nStack Trace: {e.StackTrace}");
            }

            return RedirectToAction("Index", "Home", new { area = "Common", branchChange = false });
        }


    }
}