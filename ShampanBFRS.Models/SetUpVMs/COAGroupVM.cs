using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ShampanBFRS.Models.CommonVMs;

namespace ShampanBFRS.Models.SetUpVMs
{
    public class COAGroupVM : Audit
    {
        public int Id { get; set; }
        public string? Code { get; set; }
        public int? GroupSL { get; set; }
        public string? Category { get; set; }
        public string? Name { get; set; }
        public string? Remarks { get; set; }


    }
}
