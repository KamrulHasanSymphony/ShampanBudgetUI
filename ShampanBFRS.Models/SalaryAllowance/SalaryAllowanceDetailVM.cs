using ShampanBFRS.Models.CommonVMs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanBFRS.Models.SalaryAllowance
{
    public class SalaryAllowanceDetailVM : Audit
    {

        public int Id { get; set; }
        public int SalaryAllowanceHeaderId { get; set; }
        public int PersonnelCategoriesId { get; set; }
        public decimal? TotalPostSanctioned { get; set; }
        public decimal? ActualPresentStrength { get; set; }
        public decimal? ExpectedNumber { get; set; }
        public decimal? BasicWagesSalaries { get; set; }
        public decimal? OtherCash { get; set; }
        public decimal? TotalSalary { get; set; }
        public decimal? PersonnelSentForTraining { get; set; }
        public string? PersonnelCategoriesName { get; set; }
    }
}
