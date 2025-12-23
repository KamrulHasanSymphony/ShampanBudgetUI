using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ShampanBFRS.Models.CommonVMs;

namespace ShampanBFRS.Models.SetUpVMs
{
    public class ChargeGroupVM :Audit
    {
        public int Id { get; set; }
        public string ?ChargeGroupValue { get; set; }
        public string? ChargeGroupText { get; set; }
    }
}
