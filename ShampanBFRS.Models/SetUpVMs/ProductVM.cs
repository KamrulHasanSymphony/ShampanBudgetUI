using ShampanBFRS.Models.CommonVMs;
using System.ComponentModel.DataAnnotations;

namespace ShampanBFRS.Models.SetUpVMs
{
    public class ProductVM : Audit
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }

        public string? ProductGroupName { get; set; }

        [Display(Name = "Product Group")]
        public int? ProductGroupId { get; set; }
        [Display(Name = "Conversion Factor")]
        public decimal? ConversionFactor { get; set; }
        [Display(Name= "CIF Price")]
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
        [Display(Name = "AIT Rate")]
        public decimal? AITRate { get; set; }
        [Display(Name = "Con Factor Fixed Value")]
        public decimal? ConversionFactorFixedValue { get; set; }
        [Display(Name = "VAT Rate Fixed")]
        public decimal? VATRateFixed { get; set; }
        [Display(Name = "River Dues")]
        public decimal? RiverDues { get; set; }
        [Display(Name = "Tariff Rate")]
        public decimal? TariffRate { get; set; }
        [Display(Name = "Fob Price BBL")]
        public decimal? FobPriceBBL { get; set; }
        [Display(Name = "Freight Usd")]
        public decimal? FreightUsd { get; set; }
        [Display(Name = "Service Charge")]
        public decimal? ServiceCharge { get; set; }
        [Display(Name = "Process Fee")]
        public decimal? ProcessFee { get; set; }
        [Display(Name = "Rco Treatment Fee")]
        public decimal? RcoTreatmentFee { get; set; }
        [Display(Name = "Abp Treatment Fee")]
        public decimal? AbpTreatmentFee { get; set; }



        public PeramModel PeramModel { get; set; }

        public ProductVM()
        {
            PeramModel = new PeramModel();
        }

    }

}
