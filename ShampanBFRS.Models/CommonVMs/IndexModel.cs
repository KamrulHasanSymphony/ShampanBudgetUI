namespace ShampanBFRS.Models.CommonVMs
{
    public class IndexModel
    {
        public string? SearchValue { get; set; }
        public string OrderName { get; set; }
        public string orderDir { get; set; }
        public int startRec { get; set; }
        public int pageSize { get; set; }

        public string IsArchive { get; set; }
        public string IsActive { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }

        public string createdBy { get; set; }
        public string FixedParam { get; set; }
        public string CurrentBranchid { get; set; }
        public string CurrentBranchCode { get; set; }
        public string sageUser { get; set; }
        public string Location { set; get; }
        public string VendorNumber { get; set; }
        public string Status { get; set; }
        public string Code { get; set; }

        public string FromDate { get; set; }
        public string ToDate { get; set; }
    }


}
