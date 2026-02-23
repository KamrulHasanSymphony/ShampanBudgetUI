using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ShampanBFRS.Models.CommonVMs;

namespace ShampanBFRS.Models.SetUpVMs
{
    public class DepartmentVM : Audit
    {
        public int Id { get; set; }
        [DisplayName("iBAS Group")]
        public int? COAGroupId { get; set; }
        public string? Code {get;set;}
        [Display(Name = "Name")]
        [Required(ErrorMessage = "Name is required")]
        [StringLength(50, ErrorMessage = "Name must be between 3 and 50 characters")]
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Reference { get; set; }
        public string? Remarks { get; set; }
        public bool IsActive { get; set; }
        public bool IsArchive { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedOn { get; set; }
        public string CreatedFrom { get; set; }
        public string? LastUpdateBy { get; set; }
        public string? LastUpdateOn { get; set; }
        public string? LastUpdateFrom { get; set; }

        public PeramModel PeramModel { get; set; }

        public List<DepartmentSabreVM> SabreList { get; set; }


        public DepartmentVM()
        {
            PeramModel = new PeramModel();
            SabreList = new List<DepartmentSabreVM>();
        }
    }
}
