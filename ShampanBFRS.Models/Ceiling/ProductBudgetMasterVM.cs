using ShampanBFRS.Models.CommonVMs;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ShampanBFRS.Models.Ceiling
{
    public class ProductBudgetMasterVM : Audit
    {
        public int? Id { get; set; }
        public string? ProductGroupName { get; set; }

        public string? YearName { get; set; }

        public int? CompanyId { get; set; }
        public int? BranchId { get; set; }

        [Display(Name = "Year")]
        public int? GLFiscalYearId { get; set; }

        [Display(Name = "Budget Set No")]
        public string? BudgetSetNo { get; set; }

        [Display(Name = "Budget Type")]
        public string? BudgetType { get; set; }

        [Display(Name = "Product Group")]
        public int? ProductGroupId { get; set; }

        public string? Operation { get; set; }
        public string? TransactionType { get; set; }

        [Display(Name = "Charge Group")]
        public string? ChargeGroup { get; set; }

        public PeramModel PeramModel { get; set; }

        public List<ProductBudgetVM> DetailList { set; get; }
        public ProductBudgetMasterVM()
        {
            PeramModel = new PeramModel();
        }

    }
}