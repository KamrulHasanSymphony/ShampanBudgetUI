using ShampanBFRS.Models;
using ShampanBFRS.Models.KendoCommon;
using ShampanBFRS.Models.SetUpVMs;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace ShampanBFRS.Repo.CommonKendo
{
    public class CommonDataService
    {
        SqlDataAdapter _da;
        SqlConnection _dbConn;
        SqlCommand _cmd;
        DataSet _ds;
        DataTable _dt;      

      

        public List<T> Select_Data_List<T>(string procedureName, string callName, string parm1 = "", string parm2 = "", string parm3 = "", string parm4 = "", string parm5 = "", string parm6 = "", string parm7 = "", string parm8 = "", string parm9 = "", string parm10 = "")
        {
            try
            {
                _dbConn = new SqlConnection(SessionClass.ConnectionString);
                _dbConn.Open();

                _cmd = new SqlCommand(procedureName, _dbConn);
                _cmd.CommandType = CommandType.StoredProcedure;
                _cmd.Parameters.Add(new SqlParameter("@CallType", callName));
                _cmd.Parameters.Add(new SqlParameter("@Desc1", parm1));
                _cmd.Parameters.Add(new SqlParameter("@Desc2", parm2));
                _cmd.Parameters.Add(new SqlParameter("@Desc3", parm3));
                _cmd.Parameters.Add(new SqlParameter("@Desc4", parm4));
                _cmd.Parameters.Add(new SqlParameter("@Desc5", parm5));
                _cmd.Parameters.Add(new SqlParameter("@Desc6", parm6));
                _cmd.Parameters.Add(new SqlParameter("@Desc7", parm7));
                _cmd.Parameters.Add(new SqlParameter("@Desc8", parm8));
                _cmd.Parameters.Add(new SqlParameter("@Desc9", parm9));
                _cmd.Parameters.Add(new SqlParameter("@Desc10", parm10));

                _da = new SqlDataAdapter(_cmd);
                _ds = new DataSet();
                _da.Fill(_ds);
                _dbConn.Close();

                _dt = _ds.Tables[0];
                var dataList = new List<T>();

                if (_dt.Rows.Count > 0)
                {
                    dataList = (List<T>)ListConversion.ConvertTo<T>(_dt);
                }

                return dataList;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public List<T> Select_Data_ListCMD<T>(string sqlQuery, string parm1 = "", string parm2 = "", string parm3 = "", string parm4 = "", string parm5 = "", string parm6 = "", string parm7 = "", string parm8 = "", string parm9 = "", string parm10 = "")
        {
            try
            {
                _dbConn = new SqlConnection(SessionClass.ConnectionString);
                _dbConn.Open();

                _cmd = new SqlCommand(sqlQuery, _dbConn);
                _cmd.CommandType = CommandType.Text;
                
                _cmd.Parameters.Add(new SqlParameter("@Desc1", parm1));
                _cmd.Parameters.Add(new SqlParameter("@Desc2", parm2));
                _cmd.Parameters.Add(new SqlParameter("@Desc3", parm3));
                _cmd.Parameters.Add(new SqlParameter("@Desc4", parm4));
                _cmd.Parameters.Add(new SqlParameter("@Desc5", parm5));
                _cmd.Parameters.Add(new SqlParameter("@Desc6", parm6));
                _cmd.Parameters.Add(new SqlParameter("@Desc7", parm7));
                _cmd.Parameters.Add(new SqlParameter("@Desc8", parm8));
                _cmd.Parameters.Add(new SqlParameter("@Desc9", parm9));
                _cmd.Parameters.Add(new SqlParameter("@Desc10", parm10));

                _da = new SqlDataAdapter(_cmd);
                _ds = new DataSet();
                _da.Fill(_ds);
                _dbConn.Close();

                _dt = _ds.Tables[0];
                var dataList = new List<T>();

                if (_dt.Rows.Count > 0)
                {
                    dataList = (List<T>)ListConversion.ConvertTo<T>(_dt);
                }

                return dataList;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public DataTable Select_DataTableCMD(string sqlQuery, Dictionary<string, object> parameters)
        {
            try
            {
                _dbConn = new SqlConnection(SessionClass.ConnectionString);
                _dbConn.Open();

                _cmd = new SqlCommand(sqlQuery, _dbConn);
                _cmd.CommandType = CommandType.Text;

                foreach (var param in parameters)
                {
                    _cmd.Parameters.AddWithValue(param.Key, param.Value ?? DBNull.Value);
                }

                _da = new SqlDataAdapter(_cmd);
                _ds = new DataSet();
                _da.Fill(_ds);
                _dbConn.Close();

                _dt = _ds.Tables[0];

                return _dt;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}
