using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ShampanBFRS.Models.CommonVMs;

namespace ShampanBFRS.Models.SetUpVMs
{
    public class DepartmentVM : Audit
    {
        public int Id { get; set; }
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

        public DepartmentVM()
        {
            PeramModel = new PeramModel();
        }
    }
}
