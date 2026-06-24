using ShampanBFRS.Models.CommonVMs;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanBFRS.Models.SetUpVMs
{
    public class ApprovalOrganogramVM : Audit
    {
        public int Id { get; set; }
        public string? Module { set; get; }

        [Display(Name = "Transaction Type")]
        public string? TransactionType { set; get; }
        [Display(Name = "Active Status")]
        public string? Status { get; set; }
        public string? Operation { get; set; }
        public List<string>? IDs { get; set; }
        public List<ApprovalOrganogramDetailVM>? ApprovalOrganogramDetails { get; set; }

        public ApprovalOrganogramVM()
        {
            ApprovalOrganogramDetails = new List<ApprovalOrganogramDetailVM>();
        }
    }
    public abstract class SessionModel
    {
        public static string DBName;
        public static string authDB;
        public static string SettingValue;
        public static int CompanyId;
        public static string CompanyName;
    }
}
