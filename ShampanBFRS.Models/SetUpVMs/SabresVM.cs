using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ShampanBFRS.Models.CommonVMs;

namespace ShampanBFRS.Models.SetUpVMs
{
    public class SabresVM : Audit
    {
        public int Id { get; set; }

        [Display(Name = "COA")]
        public int? COAId { get; set; }

        [Display(Name = "Code")]
        public string? Code { get; set; }

        [Display(Name = "Name")]
        public string? Name { get; set; }

        [Display(Name = "Remarks")]
        public string? Remarks { get; set; }
        public string? iBASName { get; set; }
        public string? iBASCode { get; set; }

    }
}
