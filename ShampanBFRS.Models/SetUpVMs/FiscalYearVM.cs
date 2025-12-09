using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ShampanBFRS.Models.SetUpVMs
{

    public class FiscalYearVM
    {        
        public int Id { get; set; }

        [Display(Name = "Year")]
        public int Year { get; set; }

        [Display(Name = "Year Name")]
        public string? YearName { get; set; }
        public int? YearPeriod { get; set; }

        [Display(Name = "Year Start Date")]
        public string? YearStart { get; set; }

        [Display(Name = "Year End Date")]
        public string? YearEnd { get; set; }

        [Display(Name = "Year Locked")]
        public bool YearLock { get; set; }

        [Display(Name = "Remarks")]
        public string? Remarks { get; set; }

        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }

        [Display(Name = "Created On")]
        public string? CreatedOn { get; set; }
        public string? CreatedFrom { get; set; }

        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }

        [Display(Name = "Last Modified On")]
        public string? LastModifiedOn { get; set; }
        public string? LastUpdateFrom { get; set; }        
        public string? Operation { get; set; }
        public string? Status { get; set; }
        public string?[] IDs { get; set; }
        
        public List<FiscalYearDetailVM> fiscalYearDetails { get; set; }
        public FiscalYearVM()
        {
            fiscalYearDetails = new List<FiscalYearDetailVM>();           

        }
    }


}
