using Newtonsoft.Json;
using ShampanBFRS.Models.Ceiling;
using ShampanBFRS.Models.CommonVMs;
using ShampanBFRS.Models.KendoCommon;
using ShampanBFRS.Repo.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static ShampanBFRS.Models.CommonVMs.CommonModel;

namespace ShampanBFRS.Repo.Ceiling
{
    public class ProductBudgetRepo
    {

        public ResultVM GetProductBudgetDataForDetailsLoad(ProductBudgetVM vm)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

                #region Invoke API
                var data = httpRequestHelper.PostData("api/ProductBudget/GetProductBudgetDataForDetailsLoad", authModel, JsonConvert.SerializeObject(vm));

                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public ResultVM GetProductBudgetDataForDetailsNew(ProductBudgetVM vm)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

                #region Invoke API
                var data = httpRequestHelper.PostData("api/ProductBudget/GetProductBudgetDataForDetailsNew", authModel, JsonConvert.SerializeObject(vm));

                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }



    }
}
