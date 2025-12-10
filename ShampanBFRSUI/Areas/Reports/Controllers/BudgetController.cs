using OfficeOpenXml;
using ShampanBFRS.Models.Ceiling;
using ShampanBFRS.Models.CommonVMs;
using ShampanBFRS.Repo.Ceiling;
using ShampanBFRS.Repo.Reports;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ShampanBFRSUI.Areas.Reports.Controllers
{
    public class BudgetController : Controller
    {
        ReportRepo _repo = new ReportRepo();

        // GET: Reports/Budget
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult BudgetFinalReport(CeilingVM model)
        {
            ResultModel<CeilingVM> result = new ResultModel<CeilingVM>();
            ResultVM resultVM = new ResultVM { Status = MessageModel.Fail, Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new ReportRepo();

            if (ModelState.IsValid)
            {
                try
                {
                    var currentBranchId = 0;
                    if (Session["CurrentBranch"] != null)
                        int.TryParse(Session["CurrentBranch"].ToString(), out currentBranchId);

                    CommonVM commonVM = new CommonVM();

                    commonVM.YearId = model.GLFiscalYearId.ToString();
                    commonVM.BranchId = currentBranchId.ToString();
                    commonVM.UserId = Session["UserId"].ToString();
                    commonVM.ReportType = model.ReportType.ToString();
                  


                    resultVM = _repo.BudgetFinalReport(commonVM);

                    var json = Newtonsoft.Json.JsonConvert.SerializeObject(resultVM.DataVM);
                    var list = Newtonsoft.Json.JsonConvert.DeserializeObject<List<Dictionary<string, object>>>(json);

                    DataTable dt = ConvertListToDataTable(list);

                    if (dt.Rows.Count == 0)
                    {
                        result = new ResultModel<CeilingVM>()
                        {
                            Status = Status.Fail,
                            Message = "No data found.",
                            Data = model
                        };
                        return Json(result);
                    }

                    ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                    using (var package = new ExcelPackage())
                    {
                        var ws = package.Workbook.Worksheets.Add("BudgetFinalReport");

                        string companyName = "Bangladesh Petroleum Corporation";

                        // 1. Add company name at top, merge across all columns
                        int totalCols = dt.Columns.Count + 1; // +1 for SL column
                        ws.Cells[1, 1, 1, totalCols].Merge = true;
                        ws.Cells[1, 1].Value = companyName;
                        ws.Cells[1, 1].Style.Font.Bold = true;
                        ws.Cells[1, 1].Style.Font.Size = 14;
                        ws.Cells[1, 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                        ws.Cells[1, 1].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Center;

                        // 2. Leave 2 blank rows, start data from row 4
                        int startRow = 4;
                        ws.Cells[startRow, 1, startRow, totalCols].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Center;

                        // 3. Add Serial column
                        DataTable dtWithSerial = dt.Copy();
                        dtWithSerial.Columns.Add("SL", typeof(int)).SetOrdinal(0); // Insert at first position
                        for (int i = 0; i < dtWithSerial.Rows.Count; i++)
                            dtWithSerial.Rows[i]["SL"] = i + 1;

                        // 4. Load data into worksheet
                        ws.Cells[startRow, 1].LoadFromDataTable(dtWithSerial, true);

                        // Fix header names (multi-line)
                        for (int col = 1; col <= totalCols; col++)
                        {
                            var cell = ws.Cells[startRow, col];  // Header row is startRow (4)

                            string header = cell.Text;

                            if (header.Contains("(") && header.Contains(")"))
                            {
                                int start = header.IndexOf("(");
                                int end = header.IndexOf(")");

                                string part1 = header.Substring(0, start).Trim();              // Estimated
                                string part2 = header.Substring(start + 1, end - start - 1);   // 2025-2026

                                cell.Value = part1 + "\n" + part2;
                                cell.Style.WrapText = true;
                            }
                        }

                        int totalRows = dtWithSerial.Rows.Count;
                        int footerRow = startRow + totalRows + 1; // leave one row empty before footer

                        // 5. Format header bold and center
                        using (var headerRange = ws.Cells[startRow, 1, startRow, totalCols])
                        {
                            headerRange.Style.Font.Bold = true;
                            headerRange.Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                            headerRange.Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Center;
                            headerRange.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                            headerRange.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightGray);
                        }

                        // 6. Format numeric columns, ratio %, and sum in footer
                        for (int col = 1; col <= totalCols; col++)
                        {
                            bool isDecimal = dtWithSerial.Columns[col - 1].DataType == typeof(decimal) ||
                                             dtWithSerial.Columns[col - 1].DataType == typeof(double) ||
                                             dtWithSerial.Columns[col - 1].DataType == typeof(float);

                            bool isRatioColumn = dtWithSerial.Columns[col - 1].ColumnName.Contains("%");

                            if (isDecimal || isRatioColumn)
                            {
                                ws.Column(col).Style.Numberformat.Format = "#,##0.00";

                                if (!isRatioColumn)
                                {
                                    ws.Cells[footerRow, col].Formula = $"SUM({ws.Cells[startRow + 1, col].Address}:{ws.Cells[startRow + totalRows, col].Address})";
                                }
                                //else
                                //{
                                //    ws.Cells[footerRow, col].Formula = $"AVERAGE({ws.Cells[startRow + 1, col].Address}:{ws.Cells[startRow + totalRows, col].Address})";
                                //}
                            }
                        }

                        // 7. Footer formatting
                        using (var footerRange = ws.Cells[footerRow, 1, footerRow, totalCols])
                        {
                            footerRange.Style.Font.Bold = true;
                            footerRange.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                            footerRange.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightGray);
                        }

                        // 8. Set column widths
                        ws.Column(1).Width = 5; // SL column narrower
                        for (int i = 2; i <= totalCols; i++)
                            ws.Column(i).Width = 20;

                        // 9. Export to browser
                        using (var memoryStream = new MemoryStream())
                        {
                            package.SaveAs(memoryStream);
                            memoryStream.Position = 0;

                            Response.Clear();
                            Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                            string fileName = $"BudgetFinalReport_{DateTime.Now:yyyyMMddHHmmss}.xlsx";
                            Response.AddHeader("content-disposition", $"attachment; filename={fileName}");
                            memoryStream.WriteTo(Response.OutputStream);
                            Response.Flush();
                            Response.End();
                        }
                    }




                    result = new ResultModel<CeilingVM>()
                    {
                        Status = Status.Fail,
                        Message = resultVM.Message,
                        Data = model
                    };
                    return Json(result);

                }
                catch (Exception e)
                {
                    Session["result"] = MessageModel.Fail + "~" + e.Message;
                    Elmah.ErrorSignal.FromCurrentContext().Raise(e);
                    return View("Create", model);
                }
            }
            else
            {
                result = new ResultModel<CeilingVM>()
                {
                    Success = false,
                    Status = Status.Fail,
                    Message = "Model State Error!",
                    Data = model
                };
                return Json(result);
            }
        }

        public static DataTable ConvertListToDataTable(List<Dictionary<string, object>> list)
        {
            DataTable dt = new DataTable();

            if (list == null || list.Count == 0)
                return dt;

            //dt.Columns.Add("SL", typeof(int));

            // Create columns
            foreach (var key in list[0].Keys)
            {
                // Try to detect numeric columns
                var firstValue = list[0][key];
                Type colType = typeof(string);
                if (key!= "iBAS Code" && key != "Sabre Code")
                {
                    if (firstValue != null)
                    {
                        if (decimal.TryParse(firstValue.ToString(), out _))
                            colType = typeof(decimal);
                        else if (double.TryParse(firstValue.ToString(), out _))
                            colType = typeof(double);
                        else if (int.TryParse(firstValue.ToString(), out _))
                            colType = typeof(int);
                    }
                }
                

                dt.Columns.Add(key, colType);
            }

            //int serial = 1;

            foreach (var dict in list)
            {
                DataRow row = dt.NewRow();
                //row["SL"] = serial++;
                foreach (var kv in dict)
                {
                    if (dt.Columns[kv.Key].DataType == typeof(decimal))
                        row[kv.Key] = kv.Value != null ? Convert.ToDecimal(kv.Value) : 0;
                    else if (dt.Columns[kv.Key].DataType == typeof(double))
                        row[kv.Key] = kv.Value != null ? Convert.ToDouble(kv.Value) : 0;
                    else if (dt.Columns[kv.Key].DataType == typeof(int))
                        row[kv.Key] = kv.Value != null ? Convert.ToInt32(kv.Value) : 0;
                    else
                        row[kv.Key] = kv.Value ?? "";
                }
                dt.Rows.Add(row);
            }

            return dt;
        }


    }
}