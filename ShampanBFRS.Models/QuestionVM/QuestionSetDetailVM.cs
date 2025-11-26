using ShampanBFRS.Models.CommonVMs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanBFRS.Models.QuestionVM
{
    public class QuestionSetDetailVM : Audit
    {
        public int Id { get; set; }
        public int? QuestionSetHeaderId { get; set; }
        public int? QuestionHeaderId { get; set; }
        public int? QuestionMark { get; set; }

        public string? QuestionSetHeaderName { get; set; }
        public string? QuestionHeaderName { get; set; }

        public PeramModel PeramModel { get; set; }

        public QuestionSetDetailVM()
        {
            PeramModel = new PeramModel();
        }
    }
}
