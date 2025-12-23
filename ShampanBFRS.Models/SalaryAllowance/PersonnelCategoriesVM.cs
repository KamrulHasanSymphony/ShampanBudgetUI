using ShampanBFRS.Models.CommonVMs;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanBFRS.Models.SalaryAllowance
{
    public class PersonnelCategoriesVM: Audit
    {

        public int? Id { get; set; }
        public int SL { get; set; }

        [Display(Name = "Category of Personnel")]
        public string CategoryOfPersonnel { get; set; }
        public string? Status { get; set; }


    }
}
