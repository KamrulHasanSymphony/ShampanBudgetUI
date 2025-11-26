using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ShampanBFRS.Models.SetUpVMs
{
    public class UserBranchProfileVM
    {
        public int Id { get; set; }

        [Display(Name = "User")]
        public string? UserId { get; set; }

        [Display(Name = "User Name")]
        public string? UserName { get; set; }

        [Display(Name = "Full Name")]
        public string? FullName { get; set; }

        [Display(Name = "Branch Code")]
        public string? BranchCode { get; set; }

        [Display(Name = "Branch Code")]
        public string? Code { get; set; }

        [Display(Name = "Branch Name")]
        public string? BranchName { get; set; }

        [Display(Name = "Branch Name")]
        public string? Name { get; set; }

        [Display(Name = "Branch")]
        public int? BranchId { get; set; }

        public bool IsActive { get; set; }

        public List<string> IDs { get; set; }
        public string? Operation { get; set; }       
        public string? CreatedFrom { get; set; }

        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }

        [Display(Name = "Created On")]
        public string? CreatedOn { get; set; }

        [Display(Name = "Last Modified By")]
        public string? LastModifiedBy { get; set; }

        [Display(Name = "Last Modified On")]
        public string? LastModifiedOn { get; set; }
        public string? LastUpdateFrom { get; set; }

    }

}
