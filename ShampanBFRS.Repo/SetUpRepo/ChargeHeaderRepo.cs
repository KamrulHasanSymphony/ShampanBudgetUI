using Newtonsoft.Json;
using ShampanBFRS.Models.CommonVMs;
using ShampanBFRS.Models.KendoCommon;
using ShampanBFRS.Models.QuestionVM;
using ShampanBFRS.Models.SetUpVMs;
using ShampanBFRS.Repo.Configuration;
using System;
using System.IO;
using static ShampanBFRS.Models.CommonVMs.CommonModel;

namespace ShampanBFRS.Repo.SetUpRepo
{
    public class ChargeHeaderRepo
    {
        public ResultVM Insert(ChargeHeaderVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                var data = httpRequestHelper.PostData("api/ChargeHeader/Insert", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM Update(ChargeHeaderVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };
                var data = httpRequestHelper.PostData("api/ChargeHeader/Update", authModel, JsonConvert.SerializeObject(model));
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
                var data = httpRequestHelper.PostData("api/ChargeHeader/MultipleDelete", authModel, JsonConvert.SerializeObject(model));
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
                var data = httpRequestHelper.PostData("api/ChargeHeader/List", authModel, JsonConvert.SerializeObject(model));
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
                var data = httpRequestHelper.PostData("api/ChargeHeader/GetGridData", authModel, JsonConvert.SerializeObject(options,
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
                var data = httpRequestHelper.PostData("api/ChargeHeader/Dropdown", authModel, JsonConvert.SerializeObject(authModel));
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
                var result = httpRequestHelper.PostDataReport("api/ChargeHeader/ReportPreview", authModel, JsonConvert.SerializeObject(model));

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
                var data = httpRequestHelper.PostData("api/ChargeHeader/MultiplePost", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        public ResultVM GetChargeDetailDataById(GridOptions options, int masterId)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = new AuthModel { token = ClaimNames.token };

                var data = httpRequestHelper.PostData($"api/ChargeHeader/GetChargeDetailDataById?masterId={masterId}", authModel, JsonConvert.SerializeObject(options,
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

                var data = httpRequestHelper.PostData("api/ChargeHeader/GetDetailsGridData", authModel, JsonConvert.SerializeObject(options,
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
