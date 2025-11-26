using Newtonsoft.Json;
using ShampanBFRS.Models.CommonVMs;
using ShampanBFRS.Models.KendoCommon;
using ShampanBFRS.Models.SetUpVMs;
using ShampanBFRS.Repo.CommonKendo;
using ShampanBFRS.Repo.Configuration;
using System;
using System.Collections.Generic;
using static ShampanBFRS.Models.CommonVMs.CommonModel;

namespace ShampanBFRS.Repo.SetUpRepo
{
    public class FiscalYearsRepo
    {
        public ResultVM Dropdown()
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

                #region Invoke API
                var data = httpRequestHelper.PostData("/api/FiscalYear/Dropdown", authModel, JsonConvert.SerializeObject(authModel));
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
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });
                #region Invoke API
                var data = httpRequestHelper.PostData("api/FiscalYear/List", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM Insert(FiscalYearVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });
                #region Invoke API
                var data = httpRequestHelper.PostData("api/FiscalYear/Insert", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM Update(FiscalYearVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });
                #region Invoke API
                var data = httpRequestHelper.PostData("api/FiscalYear/Update", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public ResultVM Delete(CommonVM model)
        {
            try
            {
                HttpRequestHelper httpRequestHelper = new HttpRequestHelper();
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });
                #region Invoke API
                var data = httpRequestHelper.PostData("api/FiscalYear/Delete", authModel, JsonConvert.SerializeObject(model));
                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);
                #endregion                

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
                AuthModel authModel = httpRequestHelper.GetAuthentication(new CredentialModel { UserName = "erp", Password = "123456" });

                #region Invoke API 

                var data = httpRequestHelper.PostData("api/FiscalYear/GetGridData", authModel, JsonConvert.SerializeObject(options,
                    new JsonSerializerSettings
                    {
                        NullValueHandling = NullValueHandling.Ignore
                    }));

                ResultVM result = JsonConvert.DeserializeObject<ResultVM>(data);

                #endregion                

                return result;
            }
            catch (Exception e)
            {
                throw e;
            }
            //       try
            //       {
            //           var result = new GridEntity<FiscalYearVM>();

            //           // Define your SQL query string
            //           string sqlQuery = @"
            //       -- Count query
            //       SELECT COUNT(DISTINCT H.Id) AS totalcount
            //       FROM  FiscalYears H
            //       Where H.YearLock = 0
            //       -- Add the filter condition
            //       " + (options.filter != null ? " AND (" + GridQueryBuilder<FiscalYearVM>.FilterCondition(options.filter) + ")" : "") + @"

            //       -- Data query with pagination and sorting
            //       SELECT * 
            //       FROM (
            //           SELECT 
            //           ROW_NUMBER() OVER(ORDER BY " + (options.sort != null ? options.sort[0].field + " " + options.sort[0].dir : "H.Id DESC") + @") AS rowindex,
            //           ISNULL(H.Id, 0) AS Id,
            //ISNULL(H.Year, 0) AS Year,
            //ISNULL(FORMAT(H.YearStart, 'yyyy-MM-dd'),'1900-01-01') AS YearStart,
            //ISNULL(FORMAT(H.YearEnd, 'yyyy-MM-dd'),'1900-01-01') AS YearEnd,
            //ISNULL(H.YearLock, 0) AS YearLock,
            //ISNULL(H.Remarks, '') AS Remarks,					
            //ISNULL(H.CreatedBy, '') AS CreatedBy,
            //ISNULL(H.CreatedOn, '1900-01-01') AS CreatedOn,
            //ISNULL(H.LastModifiedBy, '''') AS LastModifiedBy,
            //ISNULL(H.LastModifiedOn, '1900-01-01') AS LastModifiedOn,
            //ISNULL(H.CreatedFrom, '') AS CreatedFrom,
            //ISNULL(H.LastUpdateFrom, '') AS LastUpdateFrom
            //FROM FiscalYears H 
            //           Where H.YearLock = 0
            //       -- Add the filter condition
            //       " + (options.filter != null ? " AND (" + GridQueryBuilder<FiscalYearVM>.FilterCondition(options.filter) + ")" : "") + @"

            //       ) AS a
            //       WHERE rowindex > @skip AND (@take = 0 OR rowindex <= @take)
            //   ";

            //           result = KendoGrid<FiscalYearVM>.GetGridData_CMD(options, sqlQuery, "H.Id");

            //           return result;
            //       }
            //       catch (Exception ex)
            //       {
            //           throw ex.InnerException;
            //       }
        }

        public List<FiscalYearVM> GetFiscalYearsList()
        {
            try
            {
                CommonDataService kendoList = new CommonDataService();
                string sqlQuery = @"
                SELECT DISTINCT
                    ISNULL(H.Id, 0) AS Id,
                    ISNULL(H.Id, 0) AS Value,
                    ISNULL(H.Code, '') AS Code,
                    ISNULL(H.Name, '') AS Name,
                    ISNULL(H.Description, '') AS Description,
                    ISNULL(H.Comments, '') AS Comments,
                    CASE WHEN ISNULL(H.IsActive, 0) = 1 THEN 'Active' ELSE 'Inactive' END AS Status
                FROM FiscalYearss H
                WHERE H.IsArchive != 1
                ";


                return kendoList.Select_Data_ListCMD<FiscalYearVM>(sqlQuery);
            }
            catch (Exception ex)
            {
                throw ex.InnerException;
            }
        }

   
    }
}
