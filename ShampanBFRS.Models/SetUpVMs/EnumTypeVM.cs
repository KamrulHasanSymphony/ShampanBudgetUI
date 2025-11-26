using System;
using System.ComponentModel.DataAnnotations;

namespace ShampanBFRS.Models.SetUpVMs
{

    public class EnumTypeVM
    {
        public int Id { get; set; }

        [Display(Name = "Name")]
        public string Name { get; set; }

        [Display(Name = "Enum Type")]
        public string? EnumType { get; set; }

        [Display(Name = "Created By")]
        public string CreatedBy { get; set; }

        [Display(Name = "Created On")]
        [DataType(DataType.DateTime)]
        public DateTime? CreatedOn { get; set; }

        [Display(Name = "Last Modified By")]
        public string LastModifiedBy { get; set; }

        [Display(Name = "Last Modified On")]
        [DataType(DataType.DateTime)]
        public DateTime? LastModifiedOn { get; set; }

        [Display(Name = "Created From")]
        public string CreatedFrom { get; set; }

        [Display(Name = "Last Update From")]
        public string LastUpdateFrom { get; set; }

        public string? Operation { get; set; }
        public string?[] IDs { get; set; }

    }


}
