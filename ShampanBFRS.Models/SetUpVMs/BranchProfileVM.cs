using System.ComponentModel.DataAnnotations;
using ShampanBFRS.Models.CommonVMs;

namespace ShampanBFRS.Models.SetUpVMs
{
    public class BranchProfileVM :Audit
    {
        public int Id { get; set; }

        [Display(Name = "Branch Code")]
        public string? Code { get; set; }

        [Display(Name = "Name")]
        [Required(ErrorMessage = "Name is required")]
        public string? Name { get; set; }

        [Display(Name = "Legal Name")]
        [Required(ErrorMessage = "Legal Name is required")]
        public string? LegalName { get; set; }

        [Display(Name = "Address")]
        [Required(ErrorMessage = "Address is required")]
        public string? Address { get; set; }

        [Display(Name = "Active")]
        public bool ActiveStatus { get; set; }

        [Display(Name = "City")]
        public string? City { get; set; }

        [Display(Name = "Zip Code")]
        public string? ZipCode { get; set; }

        [Display(Name = "Telephone No.")]
        public string? TelephoneNo { get; set; }


        [Display(Name = "Fax No")]
        public string? FaxNo { get; set; }


        [Display(Name = "Email Address")]
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [StringLength(100, ErrorMessage = "Email cannot exceed 100 characters")]
        public string? Email { get; set; }


        [Display(Name = "Contact Person")]
        public string? ContactPerson { get; set; }

        [Display(Name = "Contact Person Designation")]
        public string? ContactPersonDesignation { get; set; }

        [Display(Name = "Contact Person Telephone")]
        public string? ContactPersonTelephone { get; set; }

        [Display(Name = "Contact Person Email")]
        public string? ContactPersonEmail { get; set; }

        [Display(Name = "Comments")]
        public string? Comments { get; set; }

        public string? UserId { get; set; }
        public string? UserName { get; set; }
        public string?[] IDs { get; set; }
        public int? BranchID { get; set; }
        public string BranchCode { get; set; }
        public string BranchName { get; set; }

    }

}
