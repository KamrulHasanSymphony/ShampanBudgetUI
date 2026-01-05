using Newtonsoft.Json;
using OfficeOpenXml.Style;
using OfficeOpenXml;
using ShampanBFRS.Models.CommonVMs;
using ShampanBFRS.Models.SalaryAllowance;
using ShampanBFRS.Models.SetUpVMs;
using ShampanBFRS.Repo.Reports;
using ShampanBFRS.Repo.SetUpRepo;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ShampanBFRS.Models.Ceiling;
using ShampanBFRS.Repo.CommonRepo;

namespace ShampanBFRSUI.Areas.Reports.Controllers
{
    public class CostStatementReportController : Controller
    {
        ReportRepo _repo = new ReportRepo();

        // GET: Reports/CostStatementReport
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult CostStatementReport(ProductBudgetMasterVM model)
        {
            ResultModel<ProductBudgetMasterVM> result = new ResultModel<ProductBudgetMasterVM>();
            ResultVM resultVM = new ResultVM { Status = MessageModel.Fail, Message = "Error", ExMessage = null, Id = "0", DataVM = null };
            _repo = new ReportRepo();

            if (ModelState.IsValid)
            {
                try
                {
                    var currentBranchId = 0;
                    if (Session["CurrentBranch"] != null)
                        int.TryParse(Session["CurrentBranch"].ToString(), out currentBranchId);
                    string YearName = "";
                    string CompanyName = "";
                    string ChargeGroup = "";

                    CommonVM commonVM = new CommonVM();

                    commonVM.YearId = model.GLFiscalYearId.ToString();
                    commonVM.BranchId = currentBranchId.ToString();
                    commonVM.BudgetType = model.BudgetType.ToString();
                    commonVM.ChargeGroup = model.ChargeGroup.ToString();

                    resultVM = _repo.CostStatementReport(commonVM);

                    var json = Newtonsoft.Json.JsonConvert.SerializeObject(resultVM.DataVM);
                    var list = Newtonsoft.Json.JsonConvert.DeserializeObject<List<Dictionary<string, object>>>(json);

                    DataTable dt = ConvertListToDataTable(list);

                    #region Fiscal Years

                    FiscalYearsRepo _FiscalYearsrepo = new FiscalYearsRepo();

                    FiscalYearVM FYVM = new FiscalYearVM();
                    CommonVM param = new CommonVM();
                    param.Id = model.GLFiscalYearId.ToString();
                    ResultVM FiscalYearresult = _FiscalYearsrepo.List(param);
                    if (FiscalYearresult.Status == MessageModel.Success && FiscalYearresult.DataVM != null)
                    {
                        FYVM = JsonConvert.DeserializeObject<List<FiscalYearVM>>(FiscalYearresult.DataVM.ToString()).FirstOrDefault();

                        YearName = FYVM.YearName;
                    }
                    else
                    {
                        FYVM = null;
                    }

                    #endregion

                    #region Company Profile

                    CompanyProfileRepo _Companyrepo = new CompanyProfileRepo();

                    CompanyProfileVM CompanyVM = new CompanyProfileVM();
                    param = new CommonVM();
                    ResultVM CompanyResult = _Companyrepo.List(param);
                    if (CompanyResult.Status == MessageModel.Success && CompanyResult.DataVM != null)
                    {
                        CompanyVM = JsonConvert.DeserializeObject<List<CompanyProfileVM>>(CompanyResult.DataVM.ToString()).FirstOrDefault();

                        CompanyName = CompanyVM.CompanyLegalName;
                    }
                    else
                    {
                        CompanyName = null;
                    }

                    #endregion

                    #region Charge Group

                    CommonRepo _CommonRepo = new CommonRepo();

                    ChargeGroupVM ChargeGroupVM = new ChargeGroupVM();
                    param = new CommonVM();
                    param.ChargeGroup = model.ChargeGroup;
                    ResultVM ChargeGroupResult = _CommonRepo.GetChargeGroupList(param);
                    if (ChargeGroupResult.Status == MessageModel.Success && ChargeGroupResult.DataVM != null)
                    {
                        ChargeGroupVM = JsonConvert.DeserializeObject<List<ChargeGroupVM>>(ChargeGroupResult.DataVM.ToString()).FirstOrDefault();

                        ChargeGroup = ChargeGroupVM.ChargeGroupText;
                    }
                    else
                    {
                        ChargeGroup = null;
                    }

                    #endregion

                    if (dt.Rows.Count == 0)
                    {
                        result = new ResultModel<ProductBudgetMasterVM>()
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
                        var ws = package.Workbook.Worksheets.Add("CostStatement");

                        string ReportHead = CompanyName;
                        string ReportHead2 = model.BudgetType.ToUpper() + " BUDGET";
                        string ReportHead3 = ChargeGroup.ToUpper();
                        string ReportHead4 = "COST STATEMENT OF " + ChargeGroup.ToUpper() + " PRODUCTS FOR " + YearName;

                        string Numberofworking = " ";
                        string companyName = "";

                        // CHANGED: Use actual column count from dt, no +1 for SL
                        int totalCols = dt.Columns.Count;
                        int headerRow = 1;

                        void AddCenteredHeader(string text, int row, bool bold = true, int fontSize = 14)
                        {
                            ws.Cells[row, 1, row, totalCols].Merge = true;
                            ws.Cells[row, 1].Value = text;
                            ws.Cells[row, 1].Style.Font.Bold = bold;
                            ws.Cells[row, 1].Style.Font.Size = fontSize;
                            ws.Cells[row, 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                            ws.Cells[row, 1].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Center;
                        }
                        AddCenteredHeader(ReportHead, 1, true, 14);
                        AddCenteredHeader(ReportHead2, 2, true, 12);
                        AddCenteredHeader(ReportHead3, 3, true, 12);
                        AddCenteredHeader(ReportHead4, 4, true, 12);

                        int infoRow = 6;

                        // Left side: Company name
                        ws.Cells[infoRow, 1, infoRow, totalCols / 2].Merge = true;
                        ws.Cells[infoRow, 1].Value = companyName;
                        ws.Cells[infoRow, 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Left;
                        ws.Cells[infoRow, 1].Style.Font.Bold = true;

                        // Right side: Number of working days
                        // Ensure we don't try to merge beyond valid columns if totalCols is small
                        int rightMergeStart = (totalCols / 2) + 1;
                        if (rightMergeStart <= totalCols)
                        {
                            ws.Cells[infoRow, rightMergeStart, infoRow, totalCols].Merge = true;
                            ws.Cells[infoRow, rightMergeStart].Value = Numberofworking;
                            ws.Cells[infoRow, rightMergeStart].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Right;
                            ws.Cells[infoRow, rightMergeStart].Style.Font.Bold = true;
                        }

                        // 2. Leave 2 blank rows, start data from row 7
                        int startRow = 7;
                        ws.Cells[startRow, 1, startRow, totalCols].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Center;

                        // REMOVED: Section 3 (dtWithSerial creation and SL loop)

                        // 4. Load data into worksheet (Changed source to 'dt')
                        ws.Cells[startRow, 1].LoadFromDataTable(dt, true);

                        // Apply header styles
                        for (int col = 1; col <= totalCols; col++)
                        {
                            var cell = ws.Cells[startRow, col];

                            cell.Style.Font.Bold = true;
                            cell.Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                            cell.Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Center;
                            cell.Style.WrapText = true;

                            cell.Style.Border.Top.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                            cell.Style.Border.Bottom.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                            cell.Style.Border.Left.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                            cell.Style.Border.Right.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                        }

                        // Fix header names (multi-line)
                        for (int col = 1; col <= totalCols; col++)
                        {
                            var cell = ws.Cells[startRow, col];
                            string header = cell.Text;

                            if (header.Contains("(") && header.Contains(")"))
                            {
                                int start = header.IndexOf("(");
                                int end = header.IndexOf(")");

                                string part1 = header.Substring(0, start).Trim();
                                string part2 = header.Substring(start + 1, end - start - 1);

                                cell.Value = part1 + "\n" + part2;
                                cell.Style.WrapText = true;
                            }
                        }

                        int totalRows = dt.Rows.Count; // Changed from dtWithSerial to dt
                        int footerRow = startRow + totalRows + 1;

                        // 5. Format header bold and center
                        using (var headerRange = ws.Cells[startRow, 1, startRow, totalCols])
                        {
                            headerRange.Style.Font.Bold = true;
                            headerRange.Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                            headerRange.Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Center;
                        }

                        // 6. Format numeric columns, ratio %, and sum in footer
                        for (int col = 1; col <= totalCols; col++)
                        {
                            // Changed indexing: dt.Columns[col-1] maps directly now
                            var colType = dt.Columns[col - 1].DataType;
                            bool isDecimal = colType == typeof(decimal) || colType == typeof(double) || colType == typeof(float);
                            bool isRatioColumn = dt.Columns[col - 1].ColumnName.Contains("%");

                            if (isDecimal || isRatioColumn)
                            {
                                ws.Column(col).Style.Numberformat.Format = "#,##0.00";

                                if (!isRatioColumn)
                                {
                                    ws.Cells[footerRow, col].Formula = $"SUM({ws.Cells[startRow + 1, col].Address}:{ws.Cells[startRow + totalRows, col].Address})";
                                }
                            }
                        }

                        // Footer Labels
                        ws.Cells[footerRow, 1].Value = "Total";
                        ws.Cells[footerRow, 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                        ws.Cells[footerRow, 1].Style.Font.Bold = true;

                        // Only merge if we have at least 2 columns, otherwise just use the first cell
                        //if (totalCols >= 2)
                        //{
                        //    ws.Cells[footerRow, 1, footerRow, 1].Merge = false;
                        //}
                        ws.Cells[footerRow, 1].Value = "Total";

                        using (var footerRange = ws.Cells[footerRow, 1, footerRow, totalCols])
                        {
                            footerRange.Style.Font.Bold = true;
                            footerRange.Style.Border.Top.Style = OfficeOpenXml.Style.ExcelBorderStyle.Double;
                            footerRange.Style.Border.Bottom.Style = OfficeOpenXml.Style.ExcelBorderStyle.Double;
                            footerRange.Style.Border.Left.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                            footerRange.Style.Border.Right.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                        }

                        // 8. Set column widths
                        // REMOVED: specific width for column 1 (SL). Now applying standard width to all.
                        for (int i = 1; i <= totalCols; i++)
                            ws.Column(i).Width = 20;

                        int dataStartRow = startRow + 1;
                        int dataEndRow = startRow + totalRows;

                        using (var dataRange = ws.Cells[dataStartRow, 1, dataEndRow, totalCols])
                        {
                            dataRange.Style.Border.Top.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                            dataRange.Style.Border.Bottom.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                            dataRange.Style.Border.Left.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                            dataRange.Style.Border.Right.Style = OfficeOpenXml.Style.ExcelBorderStyle.Thin;
                        }

                        ws.View.ShowGridLines = true;

                        // 9. Export to browser
                        using (var memoryStream = new MemoryStream())
                        {
                            package.SaveAs(memoryStream);
                            memoryStream.Position = 0;

                            Response.Clear();
                            Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                            string fileName = $"CostStatementReport_{DateTime.Now:yyyyMMddHHmmss}.xlsx";
                            Response.AddHeader("content-disposition", $"attachment; filename={fileName}");
                            memoryStream.WriteTo(Response.OutputStream);
                            Response.Flush();
                            Response.End();
                        }
                    }

                    result = new ResultModel<ProductBudgetMasterVM>()
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
                result = new ResultModel<ProductBudgetMasterVM>()
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
                if (key != "iBAS Code" && key != "Sabre Code")
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