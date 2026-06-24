using ShampanBFRS.Models.CommonVMs;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ShampanBFRS.Models.SetUpVMs
{
    public class OrganogramSettingsVM : Audit
    {
        public int Id { get; set; }
        public string Module { get; set; }

        [Display(Name = "Transaction Type")]
        public string TransactionType { get; set; }
        public bool IsApprovalRequired { get; set; }
        public string ApprovalRequired { get; set; }
        public int ApprovalLevel { get; set; }
        public string? Remarks { get; set; }
        [Display(Name = "Active Status")]
        public bool IsActive { get; set; }
        public bool IsArchive { get; set; }
        public Audit Audit { get; set; }

        public Dictionary<string, string> ApprovalOptions { get; set; }
        public Dictionary<string, string> ApprovalLevels { get; set; }

        public OrganogramSettingsVM()
        {
            Audit = new Audit();
            ApprovalOptions = new Dictionary<string, string>
            {
                { "N", "No" },
                { "Y", "Yes" }
            };

            ApprovalLevels = new Dictionary<string, string>();

        }

        public void GenerateApprovalLevels(int upToValue)
        {
            ApprovalLevels = new Dictionary<string, string>();
            for (int i = 1; i <= upToValue; i++)
            {
                ApprovalLevels.Add(i.ToString(), i.ToString());
            }
        }


    }


}
