using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ShampanBFRS.Models.CommonVMs;

namespace ShampanBFRS.Models.SetUpVMs
{
    public class COAVM :Audit
    {

        public int Id { get; set; }

        public int? PID { get; set; }

        public int? COASL { get; set; }
        [Display(Name = "Structure Code")]
        public int? StructureId { get; set; }

        [Display(Name = "iBAS Group")]
        public int? COAGroupId { get; set; }

        [Display(Name = "iBAS Code")]
        public string? Code { get; set; }

        [Display(Name = "iBAS Name")]
        public string? Name { get; set; }

        [Display(Name = "Account Nature")]
        public string? Nature { get; set; }

        [Display(Name = "Account Type")]
        public string? COAType { get; set; }

        [Display(Name = "Report Type")]
        public string? ReportType { get; set; }

        [Display(Name = "Remarks")]
        public string? Remarks { get; set; }
        public string? GroupName { get; set; }

        [Display(Name = "Active")]
        public bool IsActive { get; set; }

        [Display(Name = "Archive")]
        public bool IsArchive { get; set; }

        [Display(Name = "Retained Earnings")]
        public bool IsRetainedEarning { get; set; }

        [Display(Name = "Net Profit")]
        public bool IsNetProfit { get; set; }

        [Display(Name = "Depreciation")]
        public bool IsDepreciation { get; set; }

        [Display(Name = "Non Operating Income")]
        public bool IsNonOperatingIncome { get; set; }

        public string? Segement01 { get; set; }
        public string? Segement02 { get; set; }
        public string? Segement03 { get; set; }
        public string? Segement04 { get; set; }
        public string? Segement05 { get; set; }
        public string? Segement06 { get; set; }
        public string? Segement07 { get; set; }
        public string? Segement08 { get; set; }
        public string? Segement09 { get; set; }
        public string? Segement10 { get; set; }

        [Display(Name = "Account Group Code")]
        public string? ACCTGRPCOD { get; set; }
    }
}

