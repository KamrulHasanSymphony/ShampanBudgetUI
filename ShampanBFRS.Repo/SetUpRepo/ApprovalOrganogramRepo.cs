using Newtonsoft.Json;
using ShampanBFRS.Models.CommonVMs;
using ShampanBFRS.Models.KendoCommon;
using ShampanBFRS.Models.QuestionVM;
using ShampanBFRS.Models.SalaryAllowance;
using ShampanBFRS.Models.SetUpVMs;
using ShampanBFRS.Repo.Configuration;
using System;
using System.IO;
using static ShampanBFRS.Models.CommonVMs.CommonModel;

namespace ShampanBFRS.Repo.SetUpRepo
{
    public class ApprovalOrganogramRepo
    {
        public ResultVM Insert(ApprovalOrganogramVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                var data = httpRequestHelper.PostData("api/ApprovalOrganogram/Insert", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM Update(ApprovalOrganogramVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                var data = httpRequestHelper.PostData("api/ApprovalOrganogram/Update", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }


        public ResultVM List(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                var data = httpRequestHelper.PostData("api/ApprovalOrganogram/List", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM GetGridData(GridOptions options)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                var data = httpRequestHelper.PostData("api/ApprovalOrganogram/GetGridData", authModel, JsonConvert.SerializeObject(options,
                    new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore }));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM Dropdown()
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                var data = httpRequestHelper.PostData("api/ApprovalOrganogram/Dropdown", authModel, JsonConvert.SerializeObject(authModel));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        
        public ResultVM GetSalaryAllowanceDetailDataById(GridOptions options, int masterId)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                var data = httpRequestHelper.PostData($"api/ApprovalOrganogram/GetSalaryAllowanceDetailDataById?masterId={masterId}", authModel, JsonConvert.SerializeObject(options,
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

        public ResultVM GetDetailsGridData(GridOptions options)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                var data = httpRequestHelper.PostData("api/ApprovalOrganogram/GetDetailsGridData", authModel, JsonConvert.SerializeObject(options,
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

        public ResultVM GetDetailDataById(GridOptions options, int masterId)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                var data = httpRequestHelper.PostData($"api/ApprovalOrganogram/GetDetailDataById?masterId={masterId}", authModel, JsonConvert.SerializeObject(options,
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
