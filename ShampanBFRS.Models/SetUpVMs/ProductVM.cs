using ShampanBFRS.Models.CommonVMs;
using System.ComponentModel.DataAnnotations;

namespace ShampanBFRS.Models.SetUpVMs
{
    public class ProductVM : Audit
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        [Display(Name = "Conversion Factor")]
        public decimal? ConversionFactor { get; set; }
        [Display(Name= "CIF Charge")]
        public decimal? CIFCharge { get; set; }
        [Display(Name = "Exchange Rate Usd")]
        public decimal? ExchangeRateUsd { get; set; }
        [Display(Name = "Insurance Rate")]
        public decimal? InsuranceRate { get; set; }
        [Display(Name = "Bank Charge")]
        public decimal? BankCharge { get; set; }
        [Display(Name = "Ocean Loss")]
        public decimal? OceanLoss { get; set; }
        [Display(Name = "CPA Charge")]
        public decimal? CPACharge { get; set; }
        [Display(Name = "Handeling Charge")]
        public decimal? HandelingCharge { get; set; }
        [Display(Name = "Light Charge")]
        public decimal? LightCharge { get; set; }
        [Display(Name = "Survey")]
        public decimal? Survey { get; set; }
        [Display(Name = "CostLiter ExImport")]
        public decimal? CostLiterExImport { get; set; }
        [Display(Name = "ExERL Rate")]
        public decimal? ExERLRate { get; set; }
        [Display(Name = "Duty PerLiter")]
        public decimal? DutyPerLiter { get; set; }
        [Display(Name = "Refined")]
        public decimal? Refined { get; set; }
        [Display(Name = "Crude")]
        public decimal? Crude { get; set; }
        [Display(Name = "SD Rate")]
        public decimal? SDRate { get; set; }
        [Display(Name = "Duty In Tariff")]
        public decimal? DutyInTariff { get; set; }
        [Display(Name = "AT Rate")]
        public decimal? ATRate { get; set; }
        [Display(Name = "VAT Rate")]
        public decimal? VATRate { get; set; }

        public PeramModel PeramModel { get; set; }

        public ProductVM()
        {
            PeramModel = new PeramModel();
        }

    }

}
