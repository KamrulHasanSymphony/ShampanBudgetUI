using ShampanBFRS.Models.CommonVMs;
using System.Collections.Generic;

namespace ShampanBFRS.Models.Ceiling
{
    public class ProductBudgetMasterVM : Audit
    {
        public int? Id { get; set; }
        public string? ProductGroupName { get; set; }
        public string? YearName { get; set; }

        public int? CompanyId { get; set; }
        public int? BranchId { get; set; }
        public int? GLFiscalYearId { get; set; }
        public string? BudgetSetNo { get; set; }

        public string? BudgetType { get; set; }
        public int? ProductGroupId { get; set; }

        public string? Operation { get; set; }
        public string? TransactionType { get; set; }

        public PeramModel PeramModel { get; set; }

        public List<ProductBudgetVM> DetailList { set; get; }
        public ProductBudgetMasterVM()
        {
            PeramModel = new PeramModel();
        }

    }
}
