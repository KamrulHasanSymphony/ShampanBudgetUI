using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ShampanBFRS.Models.CommonVMs;

namespace ShampanBFRS.Models.SetUpVMs
{
    public class StructureDetailsVM : Audit
    {
        public int Id { get; set; }
        [Display(Name = "Structure")]
        public int StructureId { get; set; }

     
        public int SegmentId { get; set; }
        [Display(Name = "Segment Name")]
        public string SegmentName { get; set; }
        public int? Length { get; set; }

        [Display(Name = "Remarks")]
        public string? Remarks { get; set; }
        public string? SegmentCode { get; set; }
    }
}
