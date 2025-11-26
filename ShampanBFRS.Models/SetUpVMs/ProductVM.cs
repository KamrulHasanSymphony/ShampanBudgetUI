using ShampanBFRS.Models.CommonVMs;
using System.ComponentModel.DataAnnotations;

namespace ShampanBFRS.Models.SetUpVMs
{
    public class ProductVM : Audit
    {
        public int Id { get; set; }

        [Display(Name = "Product Code")]
        public string? Code { get; set; }

        [Display(Name = "Product Name")]
        public string? Name { get; set; }

        [Display(Name = "Description")]
        public string? Description { get; set; }

        [Display(Name = "Image Path")]
        public string? ImagePath { get; set; }

        public string? FromDate { get; set; }
        public int? ProductId { get; set; }
        public int? BranchId { get; set; }
        public string? ProductCode { get; set; }
        public string? ProductName { get; set; }
        public string?[] IDs { get; set; }


        public PeramModel PeramModel { get; set; }

        public ProductVM()
        {
            PeramModel = new PeramModel();
        }

    }

}
