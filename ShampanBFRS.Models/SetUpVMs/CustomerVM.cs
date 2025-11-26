using System.ComponentModel.DataAnnotations;

namespace ShampanTailor.Models
{
    public class CustomerVM
    {
        public int Id { get; set; }

        [Display(Name = "Customer Code")]
        public string? Code { get; set; }

        [Display(Name = "Customer Name")]
        public string? Name { get; set; }

        [Display(Name = "Branch")]
        public int? BranchId { get; set; }

        [Display(Name = "Address")]
        public string? Address { get; set; }

        [Display(Name = "City")]
        public string? City { get; set; }

        [Display(Name = "Email")]
        public string? Email { get; set; }

        [Display(Name = "TIN Number")]
        public string? TINNo { get; set; }

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

        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }

        [Display(Name = "Last Modified On")]
        public string? LastModifiedOn { get; set; }

        [Display(Name = "Created From")]
        public string? CreatedFrom { get; set; }

        [Display(Name = "Last Updated From")]
        public string? LastUpdateFrom { get; set; }

        [Display(Name = "Image Path")]
        public string? ImagePath { get; set; }
        public string? CustomerCode { get; set; }
        public string? CustomerName { get; set; }
        public string? Operation { get; set; }
        public string? Status { get; set; }
        public string?[] IDs { get; set; }

    }


}
