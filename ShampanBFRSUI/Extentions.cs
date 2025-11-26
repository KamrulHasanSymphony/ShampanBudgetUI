using System;
using System.Globalization;

namespace ShampanBFRSUI
{
    public static class Extentions
    {

        public static string DateFormatChange(this string value, string Presentpattern = "dd-MM-yyyy", string Desirepattern = "yyyy-MM-dd")
        {

            if (string.IsNullOrWhiteSpace(value)) return "";
            string result = "";

            try
            {
                DateTime parsedDate;
                var a = value;
                DateTime.TryParseExact(a, Presentpattern, null, DateTimeStyles.None, out parsedDate);
                result = parsedDate.ToString(Desirepattern);
            }
            catch (Exception)
            {

            }
            return result;
        }

    }
}