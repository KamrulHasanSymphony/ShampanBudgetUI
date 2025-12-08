using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ShampanBFRS.Models.CommonVMs;

namespace ShampanBFRS.Models.SetUpVMs
{
    public class StructureVM :Audit
    {
        public int Id { get; set; }
        public string? Code { get; set; }
        public string Name { get; set; }
        public string? Remarks { get; set; }
        public List<StructureDetailsVM> StructureDetails { get; set; }
        public StructureVM()
        {
            StructureDetails = new List<StructureDetailsVM>();
        }
    }
}
