using Newtonsoft.Json;
using ShampanBFRS.Models.CommonVMs;
using System;
using System.Collections.Generic;
using System.Data;
using System.Security.Claims;
using System.Web;

namespace ShampanBFRSUI
{
    public static class Extensions
    {

        public static string GetCurrentBranchId()
        {
            var principal = HttpContext.Current.User as ClaimsPrincipal;
            var branchId = principal?.FindFirst(ClaimNames.CurrentBranch)?.Value;
            return branchId ?? "";
        }

        public static string GetCurrentBranchName()
        {
            var principal = HttpContext.Current.User as ClaimsPrincipal;
            var branchName = principal?.FindFirst(ClaimNames.CurrentBranchName)?.Value;
            return branchName ?? "";
        }

        public static string GetCurrentBranchCode()
        {
            var principal = HttpContext.Current.User as ClaimsPrincipal;
            var branchCode = principal?.FindFirst(ClaimNames.CurrentBranchCode)?.Value;
            return branchCode ?? "";
        }

        public static string GetUserId()
        {
            try
            {
                var principal = HttpContext.Current.User as ClaimsPrincipal;
                var userId = principal?.FindFirst(ClaimNames.UserId)?.Value;
                return userId ?? "";
            }
            catch (Exception)
            {
                return null;
            }
        }

        public static string GetCompanyName()
        {
            try
            {
                var principal = HttpContext.Current.User as ClaimsPrincipal;
                var companyName = principal?.FindFirst(ClaimNames.CompanyName)?.Value;
                return companyName ?? "";
            }
            catch (Exception)
            {
                return null;
            }
        }

        public static DataTable DtColumnNameChangeList(DataTable table, List<string> oldColumnNames, List<string> newColumnNames)
        {
            DataTable resultDt = new DataTable();
            resultDt = table;

            // Iterate through each old column name
            for (int i = 0; i < oldColumnNames.Count; i++)
            {
                // Get the corresponding column index
                int columnIndex = resultDt.Columns.IndexOf(oldColumnNames[i]);

                // If the column exists, change its name to the new column name
                if (columnIndex >= 0)
                {
                    resultDt.Columns[columnIndex].ColumnName = newColumnNames[i];
                }
            }
            return resultDt;
        }


        public static string DataTableToJson(DataTable dataTable)
        {

            try
            {
                string json = JsonConvert.SerializeObject(dataTable, Formatting.Indented);
                return json;
            }
            catch (Exception)
            {
                return "";
            }

        }

        public static DataTable ToDataTable<T>(List<T> items)
        {
            DataTable dt = new DataTable();

            // Get all the properties of the object
            var properties = typeof(T).GetProperties();

            // Create the columns in the DataTable based on the properties
            foreach (var property in properties)
            {
                dt.Columns.Add(property.Name, property.PropertyType);
            }

            // Add rows to the DataTable based on the data
            foreach (var item in items)
            {
                DataRow row = dt.NewRow();
                foreach (var property in properties)
                {
                    row[property.Name] = property.GetValue(item) ?? DBNull.Value;
                }
                dt.Rows.Add(row);
            }

            return dt;
        }

        public static DataTable ConvertToDataTable<T>(IList<T> data)
        {
            DataTable dt = new DataTable(typeof(T).Name);

            var properties = typeof(T).GetProperties();

            foreach (var prop in properties)
            {
                // Check if the property is nullable
                Type propType = Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType;

                dt.Columns.Add(prop.Name, propType); // Add column with correct type
            }

            foreach (var item in data)
            {
                var values = new object[properties.Length];
                for (int i = 0; i < properties.Length; i++)
                {
                    object value = properties[i].GetValue(item, null);
                    values[i] = value ?? DBNull.Value; // Replace null with DBNull.Value
                }
                dt.Rows.Add(values);
            }

            return dt;
        }



        public static string[] Alphabet = new string[] { "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK", "AL", "AM", "AN", "AO", "AP", "AQ", "AR", "AS", "AT", "AU", "AV", "AW", "AX", "AY", "AZ", "BA", "BB", "BC", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BK", "BL", "BM", "BN", "BO", "BP", "BQ", "BR", "BS", "BT", "BU", "BV", "BW", "BX", "BY", "BZ", "CA", "CB", "CC", "CD", "CE", "CF", "CG", "CH", "CI", "CJ", "CK", "CL", "CM", "CN", "CO", "CP", "CQ", "CR", "CS", "CT", "CU", "CV", "CW", "CX", "CY", "CZ", "DA", "DB", "DC", "DD", "DE", "DF", "DG", "DH", "DI", "DJ", "DK", "DL", "DM", "DN", "DO", "DP", "DQ", "DR", "DS", "DT", "DU", "DV", "DW", "DX", "DY", "DZ", "EA", "EB", "EC", "ED", "EE", "EF", "EG", "EH", "EI", "EJ", "EK", "EL", "EM", "EN", "EO", "EP", "EQ", "ER", "ES", "ET", "EU", "EV", "EW", "EX", "EY", "EZ", "FA", "FB", "FC", "FD", "FE", "FF", "FG", "FH", "FI", "FJ", "FK", "FL", "FM", "FN", "FO", "FP", "FQ", "FR", "FS", "FT", "FU", "FV", "FW", "FX", "FY", "FZ" };
    }


}
