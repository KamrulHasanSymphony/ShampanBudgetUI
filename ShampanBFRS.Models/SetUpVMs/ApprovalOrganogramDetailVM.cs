using ShampanBFRS.Models.CommonVMs;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanBFRS.Models.SetUpVMs
{
    public class ApprovalOrganogramDetailVM : Audit
    {
        public int Id { get; set; }
        public int? ApprovalOrganogramId { get; set; }

        [Display(Name = "User Id")]
        public int? UserId { set; get; }
        public string? UserName { set; get; }
        public string? FullName { set; get; }
        public int? ApprovalLevel { set; get; }

        public Dictionary<string, string>? ApprovalLevels { get; set; }


        public ApprovalOrganogramDetailVM()
        {
            ApprovalLevels = new Dictionary<string, string>
            {
                { "1", "1" },
                { "2", "2" },
                { "3", "3" },
                { "4", "4" },
                { "5", "5" }
            };
        }

    }
}
