using ShampanBFRS.Models.SetUpVMs;
using System.Collections.Generic;

namespace ShampanBFRS.Models.CommonVMs
{
    public class HeaderModel
    {
        public string HeaderName { get; set; }
        public Dictionary<string, string> BreadCrums { get; set; }
    }
    public class PopupModel
    {
        public string BankNo { get; set; }
        public string GLBatchNo { get; set; }

        public string ItemNo { get; set; }
        public string TransectionType { get; set; }

    }
    public class LoginModel
    {
        public LoginModel()
        {
            CompanyInfos = new List<CompanyProfileVM>();
        }
        public List<CompanyProfileVM> CompanyInfos { get; set; }
    }



}
