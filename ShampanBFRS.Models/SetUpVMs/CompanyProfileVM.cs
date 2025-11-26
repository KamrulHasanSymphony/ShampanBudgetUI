using System.ComponentModel.DataAnnotations;

namespace ShampanBFRS.Models.SetUpVMs
{
    public class CompanyProfileVM
    {
        public int Id { get; set; }

        [Display(Name = "Company Code")]
        public string? Code { get; set; }

        [Display(Name = "Company Name")]
        public string? CompanyName { get; set; }

        [Display(Name = "Company Name (Bangla)")]
        public string? CompanyBanglaName { get; set; }

        [Display(Name = "Company Legal Name")]
        public string? CompanyLegalName { get; set; }

        [Display(Name = "Address Line 1")]
        public string? Address1 { get; set; }

        [Display(Name = "Address Line 2")]
        public string? Address2 { get; set; }

        [Display(Name = "Address Line 3")]
        public string? Address3 { get; set; }

        [Display(Name = "City")]
        public string? City { get; set; }

        [Display(Name = "Zip Code")]
        public string? ZipCode { get; set; }

        [Display(Name = "Telephone Number")]
        public string? TelephoneNo { get; set; }

        [Display(Name = "Fax Number")]
        public string? FaxNo { get; set; }

        [Display(Name = "Email")]
        public string? Email { get; set; }

        [Display(Name = "Contact Person")]
        public string? ContactPerson { get; set; }

        [Display(Name = "Designation of Contact Person")]
        public string? ContactPersonDesignation { get; set; }

        [Display(Name = "Contact Person Telephone")]
        public string? ContactPersonTelephone { get; set; }

        [Display(Name = "Contact Person Email")]
        public string? ContactPersonEmail { get; set; }

        [Display(Name = "TIN Number")]
        public string? TINNo { get; set; }

        [Display(Name = "VAT Registration Number")]
        public string? VatRegistrationNo { get; set; }

        [Display(Name = "Comments")]
        public string? Comments { get; set; }

        [Display(Name = "Archived")]
        public bool IsArchive { get; set; }

        [Display(Name = "Active")]
        public bool IsActive { get; set; }

        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }

        [Display(Name = "Created On")]
        public string? CreatedOn { get; set; }

        [Display(Name = "Created From")]
        public string? CreatedFrom { get; set; }

        [Display(Name = "Last Modified By")]
        public string LastModifiedBy { get; set; }

        [Display(Name = "Last Modified On")]
        public string? LastModifiedOn { get; set; }

        [Display(Name = "Last Updated From")]
        public string? LastUpdateFrom { get; set; }

        [Display(Name = "Fiscal Year Start")]
        public string? FYearStart { get; set; }

        [Display(Name = "Fiscal Year End")]
        public string? FYearEnd { get; set; }

        [Display(Name = "Nature of Business")]
        public string? BusinessNature { get; set; }

        [Display(Name = "Nature of Accounting")]
        public string? AccountingNature { get; set; }

        [Display(Name = "Company Type")]
        public int? CompanyTypeId { get; set; }

        [Display(Name = "Section")]
        public string? Section { get; set; }

        [Display(Name = "Business Identification Number (BIN)")]
        public string? BIN { get; set; }

        [Display(Name = "VDS Withholder")]
        public bool IsVDSWithHolder { get; set; }

        [Display(Name = "Application Version")]
        public string? AppVersion { get; set; }

        [Display(Name = "License")]
        public string? License { get; set; }
        public int? CompanyId { get; set; }
        public string? Status { get; set; }
        public string? Operation { get; set; }
        public string?[] IDs { get; set; }

    }


}
