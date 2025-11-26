using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShampanDms.Models
{
  
        public class BussinessTypeVM
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Code { get; set; }
            public bool IsArchive { get; set; }
            public bool IsActiveStatus { get; set; }
            public string CreatedBy { get; set; }
            public DateTime CreatedOn { get; set; }
            public string LastModifiedBy { get; set; }
            public DateTime? LastModifiedOn { get; set; }
        }
}
