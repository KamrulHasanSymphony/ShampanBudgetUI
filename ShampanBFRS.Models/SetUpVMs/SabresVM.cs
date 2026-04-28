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

        [Display(Name = "iBAS")]
        public int? COAId { get; set; }

        [Display(Name = "Code")]
        [Required(ErrorMessage = "Code is required")]
        public string? Code { get; set; }

        [Display(Name = "Name")]
        [Required(ErrorMessage = "Name is required")]
        [StringLength(50, ErrorMessage = "Name must be between 3 and 50 characters")]
        public string? Name { get; set; }

        [Display(Name = "SABRE(Bangla)")]
        public string? BanglaName { get; set; }

        [Display(Name = "Remarks")]
        public string? Remarks { get; set; }
        public string? iBASName { get; set; }
        public string? iBASCode { get; set; }

    }
}
