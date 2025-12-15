using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ShampanBFRS.Models.CommonVMs;

namespace ShampanBFRS.Models.SetUpVMs
{
    public class ChargeHeaderVM : Audit
    {
        public int Id { get; set; }
        public string ChargeGroup { get; set; }
        //public string ?ProductName { get; set; }

        public List<ChargeDetailVM> ChargeDetails { get; set; }
        public ChargeHeaderVM()
        {
            ChargeDetails = new List<ChargeDetailVM>();
        }
    }
}
