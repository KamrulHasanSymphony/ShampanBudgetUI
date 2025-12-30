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
    public class BudgetRepo
    {

        public ResultVM Insert(BudgetHeaderVM model, string UserName)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

                #region Invoke API
                var data = httpRequestHelper.PostData("api/Budget/Insert", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public ResultVM Update(BudgetHeaderVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

                #region Invoke API
                var data = httpRequestHelper.PostData("api/Budget/Update", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public ResultVM GetBudgetDataForDetailsNew(GridOptions options)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

                #region Invoke API
                var data = httpRequestHelper.PostData("api/Budget/GetBudgetDataForDetailsNew", authModel, JsonConvert.SerializeObject(options));

                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public ResultVM List(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                var data = httpRequestHelper.PostData("api/Budget/List", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        //public ResultVM ProductBudgetList(BudgetHeaderVM vm)
        //{
        //    try
        //    {
        //        HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
        //        AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

        //        #region Invoke API
        //        var data = httpRequestHelper.PostData("api/Budget/ProductBudgetList", authModel, JsonConvert.SerializeObject(vm));

        //        ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
        //        #endregion

        //        return result;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //}

        //public ResultVM BudgeDistincttList(BudgetHeaderVM vm)
        //{
        //    try
        //    {
        //        HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
        //        AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

        //        #region Invoke API
        //        var data = httpRequestHelper.PostData("api/Budget/BudgeDistincttList", authModel, JsonConvert.SerializeObject(vm));

        //        ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
        //        #endregion

        //        return result;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //}

        public ResultVM GetGridData(GridOptions options)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                var data = httpRequestHelper.PostData("api/Budget/GetGridData", authModel, JsonConvert.SerializeObject(options,
                    new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore }));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM GetDetailDataById(GridOptions options, int masterId)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                var data = httpRequestHelper.PostData($"api/Budget/GetDetailDataById?masterId={masterId}", authModel, JsonConvert.SerializeObject(options,
                    new JsonSerializerSettings
                    {
                        NullValueHandling = NullValueHandling.Ignore
                    }));

                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }


    }
}
