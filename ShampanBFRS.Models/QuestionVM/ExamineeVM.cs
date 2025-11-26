using ShampanBFRS.Models.CommonVMs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanBFRS.Models.QuestionVM
{
    public class ExamineeVM : Audit
    {
        public long Id { get; set; }
        public int? ExamineeGroupId { get; set; }
        public string? Name { get; set; }
        public string? MobileNo { get; set; }
        public string? LogInId { get; set; }
        public string? Password { get; set; }
        public bool IsChangePassword { get; set; }

        public PeramModel PeramModel { get; set; }

        public ExamineeVM()
        {
            PeramModel = new PeramModel();
        }
    }
}
