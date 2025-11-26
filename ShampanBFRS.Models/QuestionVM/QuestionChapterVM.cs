using ShampanBFRS.Models.CommonVMs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanBFRS.Models.QuestionVM
{
    public class QuestionChapterVM : Audit
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? NameInBangla { get; set; }
        public string? Remarks { get; set; }

        public PeramModel PeramModel { get; set; }

        public QuestionChapterVM()
        {
            PeramModel = new PeramModel();
        }
    }
}
