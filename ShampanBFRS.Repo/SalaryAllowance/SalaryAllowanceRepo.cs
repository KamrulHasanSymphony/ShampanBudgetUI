using Newtonsoft.Json;
using ShampanBFRS.Models.CommonVMs;
using ShampanBFRS.Models.KendoCommon;
using ShampanBFRS.Models.SalaryAllowance;
using ShampanBFRS.Models.SetUpVMs;
using ShampanBFRS.Repo.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static ShampanBFRS.Models.CommonVMs.CommonModel;

namespace ShampanBFRS.Repo.SalaryAllowance
{
    public class SalaryAllowanceRepo
    {
        public ResultVM Insert(SalaryAllowanceHeaderVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                var data = httpRequestHelper.PostData("api/SalaryAllowance/Insert", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM Update(SalaryAllowanceHeaderVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                var data = httpRequestHelper.PostData("api/SalaryAllowance/Update", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM MultipleDelete(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                var data = httpRequestHelper.PostData("api/SalaryAllowance/MultipleDelete", authModel, JsonConvert.SerializeObject(model));
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
                var data = httpRequestHelper.PostData("api/SalaryAllowance/List", authModel, JsonConvert.SerializeObject(model));
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
                var data = httpRequestHelper.PostData("api/SalaryAllowance/GetGridData", authModel, JsonConvert.SerializeObject(options,
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
                var data = httpRequestHelper.PostData("api/SalaryAllowance/Dropdown", authModel, JsonConvert.SerializeObject(authModel));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public Stream ReportPreview(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                var result = httpRequestHelper.PostDataReport("api/SalaryAllowance/ReportPreview", authModel, JsonConvert.SerializeObject(model));

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM MultiplePost(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                var data = httpRequestHelper.PostData("api/SalaryAllowance/MultiplePost", authModel, JsonConvert.SerializeObject(model));
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

                var data = httpRequestHelper.PostData($"api/SalaryAllowance/GetSalaryAllowanceDetailDataById?masterId={masterId}", authModel, JsonConvert.SerializeObject(options,
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

                var data = httpRequestHelper.PostData("api/SalaryAllowance/GetDetailsGridData", authModel, JsonConvert.SerializeObject(options,
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

                var data = httpRequestHelper.PostData($"api/SalaryAllowance/GetDetailDataById?masterId={masterId}", authModel, JsonConvert.SerializeObject(options,
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

