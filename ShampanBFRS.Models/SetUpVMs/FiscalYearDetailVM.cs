using System.ComponentModel.DataAnnotations;

namespace ShampanBFRS.Models.SetUpVMs
{

    public class FiscalYearDetailVM
    {
        public int Id { get; set; }

        [Display(Name = "Fiscal Year")]
        public int? FiscalYearId { get; set; }

        [Display(Name = "Year")]
        public int? Year { get; set; }

        [Display(Name = "Remarks")]
        public string? Remarks { get; set; }

        [Display(Name = "Month")]
        public int? MonthId { get; set; }

        [Display(Name = "Month Start")]
        public string? MonthStart { get; set; }

        [Display(Name = "Month End")]
        public string? MonthEnd { get; set; }

        [Display(Name = "Month Name")]
        public string? MonthName { get; set; }

        [Display(Name = "Month Lock")]
        public bool MonthLock { get; set; }

        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }

        [Display(Name = "Created On")]
        [DataType(DataType.DateTime)]
        public string? CreatedOn { get; set; }

        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }

        [Display(Name = "Last Modified On")]
        [DataType(DataType.DateTime)]
        public string? LastModifiedOn { get; set; }
    }


}
