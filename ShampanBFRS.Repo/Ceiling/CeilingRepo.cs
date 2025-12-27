using Newtonsoft.Json;
using ShampanBFRS.Models.Ceiling;
using ShampanBFRS.Models.CommonVMs;
using ShampanBFRS.Models.KendoCommon;
using ShampanBFRS.Models.QuestionVM;
using ShampanBFRS.Repo.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static ShampanBFRS.Models.CommonVMs.CommonModel;

namespace ShampanBFRS.Repo.Ceiling
{
    public class CeilingRepo
    {

        public ResultVM Insert(CeilingVM model, string UserName)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

                #region Invoke API
                var data = httpRequestHelper.PostData("api/Ceiling/Insert", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public ResultVM Update(CeilingVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

                #region Invoke API
                var data = httpRequestHelper.PostData("api/Ceiling/Update", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public ResultVM GetGridData(GridOptions options)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

                #region Invoke API
                var data = httpRequestHelper.PostData("api/Ceiling/GetGridData", authModel, JsonConvert.SerializeObject(options));

                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public ResultVM GetAllSabreDataForDetails(GridOptions options)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

                #region Invoke API
                var data = httpRequestHelper.PostData("api/Ceiling/GetAllSabreDataForDetails", authModel, JsonConvert.SerializeObject(options));

                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public ResultVM CeilingList(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

                #region Invoke API
                var data = httpRequestHelper.PostData("api/Ceiling/CeilingList", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        public ResultVM GridDataReportType(GridOptions options)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

                #region Invoke API
                var data = httpRequestHelper.PostData("api/Ceiling/GridDataReportType", authModel, JsonConvert.SerializeObject(options));

                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public ResultVM GetCeilingDetailDataById(GridOptions options, int masterId)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                var data = httpRequestHelper.PostData($"api/Ceiling/GetCeilingDetailDataById?masterId={masterId}", authModel, JsonConvert.SerializeObject(options,
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

        public ResultVM BudgetTransfer(CeilingVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

                #region Invoke API
                var data = httpRequestHelper.PostData("api/Ceiling/BudgetTransfer", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public ResultVM MultiplePost(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                #region Invoke API
                var data = httpRequestHelper.PostData("api/Ceiling/MultiplePost", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }



    }
}
