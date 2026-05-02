var ReportTypeController = function (CommonService, CommonAjaxService) {
    var getFiscalYearId = 0;
    var getReportType = 0;
    var getBudgetType = 0;
    var getChargeGroup = 0;

    var init = function () {
        getFiscalYearId = $("#FiscalYearId").val() || 0;
        getBudgetType = $("#BudgetType").val() || 0;
        getReportType = $("#ReportType").val() || 0;
        getChargeGroup = $("#ChargeGroup").val() || 0;

        $("[data-bootstrap-switch]").bootstrapSwitch();

        GetFiscalYearComboBox();    
        GetReportTypeComboBox();
        GetBudgetTypeComboBox();
        GetChargeGroup();

        $('.btnbudgetReportDownload').click(function () {
            var model = serializeInputs("frmEntry");
            var text = document.querySelector("#budgetreport h5").innerText;
            if (text === "Budget Report") {
                if (!model.FiscalYearId) {
                    ShowNotification(3, "Please Select Fiscal Year");
                    return;
                }
                if (!model.ReportType) {
                    ShowNotification(3, "Please Select ReportType");
                    return;
                }
            }
            var status = "Download";

            Confirmation("Are you sure? Do You Want to " + status + " Data?", function (result) {
                if (result) {
                    BudgetReportDownload(model);
                }
            });
        });

        // Download button For NonOperating
        $('.btnNonOperationDownload').click(function () {
            var model = serializeInputs("frmEntry");
            var text = document.querySelector("#nonoperating h5").innerText;
            if (text === "Non Operating Income Report") {
                if (!model.FiscalYearId) {
                    ShowNotification(3, "Please Select Fiscal Year");
                    return;
                }
                if (!model.ReportType) {
                    ShowNotification(3, "Please Select ReportType");
                    return;
                }
            }
            var status = "Download";
            Confirmation("Are you sure? Do You Want to " + status + " Data?", function (result) {
                if (result) {
                    NonOperatingDownload();
                }
            });
        });

        $('.btnIncomeStatementAllDownload').click(function () {
            var model = serializeInputs("frmEntry");
            var text = document.querySelector("#incomesatementall h5").innerText;
            if (text === "Income Statement All Report") {
                if (!model.FiscalYearId) {
                    ShowNotification(3, "Please Select Fiscal Year");
                    return;
                }
                if (!model.ReportType) {
                    ShowNotification(3, "Please Select ReportType");
                    return;
                }
            }
            var status = "Download";

            Confirmation("Are you sure? Do You Want to " + status + " Data?", function (result) {
                if (result) {
                    IncomeStatementAllDownload();
                }
            });
        });

        $('.btnOperationDetailStatementDownload').click(function () {
            var model = serializeInputs("frmEntry");
            var text = document.querySelector("#operatingdetail h5").innerText;
            if (text === "Operating Details Statement") {
                if (!model.FiscalYearId) {
                    ShowNotification(3, "Please Select Fiscal Year");
                    return;
                }
                if (!model.ReportType) {
                    ShowNotification(3, "Please Select ReportType");
                    return;
                }
            }
            var status = "Download";

            Confirmation("Are you sure? Do You Want to " + status + " Data?", function (result) {
                if (result) {
                    OperationDetailStatementDownload();
                }
            });
        });

        $('.btnpaymentToGovernmentStatementDownload').click(function () {

            var model = serializeInputs("frmEntry");
            var text = document.querySelector("#paymentgovernment h5").innerText;
            if (text === "Payment To Government Statement") {
                if (!model.FiscalYearId) {
                    ShowNotification(3, "Please Select Fiscal Year");
                    return;
                }
                if (!model.ReportType) {
                    ShowNotification(3, "Please Select ReportType");
                    return;
                }
            }
            var status = "Download";

            Confirmation("Are you sure? Do You Want to " + status + " Data?", function (result) {
                if (result) {
                    PaymentToGovernmentStatementDownload();
                }
            });
        });

        $('.btnProductIncomeStatementDownload').click(function () {

            var model = serializeInputs("frmEntry");
            var text = document.querySelector("#productincome h5").innerText;
            if (text === "Product Income Statement") {
                if (!model.FiscalYearId) {
                    ShowNotification(3, "Please Select Fiscal Year");
                    return;
                }
                if (!model.ReportType) {
                    ShowNotification(3, "Please Select ReportType");
                    return;
                }
            }
            var status = "Download";

            Confirmation("Are you sure? Do You Want to " + status + " Data?", function (result) {
                if (result) {
                    ProductIncomeStatementDownload();
                }
            });
        });

        $('.btnCashFlowStatementDownload').click(function () {
            var model = serializeInputs("frmEntry");
            var text = document.querySelector("#cashflow h5").innerText;
            if (text === "Cash Flow Statement") {
                if (!model.FiscalYearId) {
                    ShowNotification(3, "Please Select Fiscal Year");
                    return;
                }
                if (!model.ReportType) {
                    ShowNotification(3, "Please Select Report Type");
                    return;
                }
            }
            var status = "Download";

            Confirmation("Are you sure? Do You Want to " + status + " Data?", function (result) {
                if (result) {
                    CashFlowStatementDownload();
                }
            });
        });

        $('.btnSaleStatementDownload').click(function () {

            var model = serializeInputs("frmEntry");
            var text = document.querySelector("#salestatement h5").innerText;
            if (text === "Sales Statement") {
                if (!model.FiscalYearId) {
                    ShowNotification(3, "Please Select Fiscal Year");
                    return;
                }
                if (!model.BudgetType) {
                    ShowNotification(3, "Please Select Budget Type");
                    return;
                }
            }
            var status = "Download";

            Confirmation("Are you sure? Do You Want to " + status + " Data?", function (result) {
                if (result) {
                    SaleStatementDownload();
                }
            });
        });

        $('.btnIncomeStatementDownload').click(function () {
            var model = serializeInputs("frmEntry");
            var text = document.querySelector("#incomestatement h5").innerText;
            if (text === "Income Statement") {
                if (!model.FiscalYearId) {
                    ShowNotification(3, "Please Select Fiscal Year");
                    return;
                }
                if (!model.BudgetType) {
                    ShowNotification(3, "Please Select Budget Type");
                    return;
                }
            }
            var status = "Download";

            Confirmation("Are you sure? Do You Want to " + status + " Data?", function (result) {
                if (result) {
                    IncomeStatementDownload();
                }
            });
        });

        $('.btnSalaryAllowanceReportDownload').click(function () {

            var model = serializeInputs("frmEntry");
            var text = document.querySelector("#salayallowance h5").innerText;
            if (text === "Salary Allowance Report") {
                if (!model.FiscalYearId) {
                    ShowNotification(3, "Please Select Fiscal Year");
                    return;
                }
                if (!model.BudgetType) {
                    ShowNotification(3, "Please Select Budget Type");
                    return;
                }
            }
            var status = "Download";

            Confirmation("Are you sure? Do You Want to " + status + " Data?", function (result) {
                if (result) {
                    SalaryAllowanceReportDownload();
                }
            });
        });

        $('.btnCostStatementReportDownload').click(function () {
            var model = serializeInputs("frmEntry");
            var text = document.querySelector("#coststatement h5").innerText;
            if (text === "Cost Statement Report") {
                if (!model.FiscalYearId) {
                    ShowNotification(3, "Please Select Fiscal Year");
                    return;
                }
                if (!model.BudgetType) {
                    ShowNotification(3, "Please Select Budget Type");
                    return;
                }
                if (!model.ChargeGroup) {
                    ShowNotification(3, "Please Select Charge Group");
                    return;
                }
            }

            var status = "Download";

            Confirmation("Are you sure? Do You Want to " + status + " Data?", function (result) {
                if (result) {
                    CostStatementReportDownload();
                }
            });
        });


        $('#details').on('blur', "td", function (e) {
            updateLineTotal($(this));
        });

    };
    function GetFiscalYearComboBox() {
        var FiscalYearComboBox = $("#FiscalYearId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "Name", title: "Name", width: 150 }
            ],
            filter: "contains",
            filterFields: ["Name"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetFiscalYearComboBox"
                }
            },
            placeholder: "Select Fiscal Year",
            value: "",
            dataBound: function (e) {
                if (getFiscalYearId) {
                    this.value(parseInt(getFiscalYearId));
                }
            }
        }).data("kendoMultiColumnComboBox");
    };

    function GetBudgetTypeComboBox() {
        var BudgetTypeComboBox = $("#BudgetType").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Name",
            height: 400,
            columns: [
                { field: "Name", title: "Name", width: 150 }
            ],
            filter: "contains",
            filterFields: ["Name"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetEnumTypeList?EnumType=SalesBudgetType"
                }
            },
            placeholder: "Select Budget Type",
            value: "",
            dataBound: function (e) {
                if (getBudgetType) {
                    this.value(getBudgetType);
                }
            }
        }).data("kendoMultiColumnComboBox");
    };
    function GetChargeGroup() {
        var ChargeGroupComboBox = $("#ChargeGroup").kendoMultiColumnComboBox({
            dataTextField: "ChargeGroupText",
            dataValueField: "ChargeGroupValue",
            height: 400,
            columns: [
                { field: "ChargeGroupText", title: "Charge Group Text", width: 150 },
            ],
            filter: "contains",
            filterFields: ["ChargeGroupText"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetChargeGroupList"
                }
            },
            placeholder: "Select Charge Group",
            value: "",
            dataBound: function (e) {
                if (getChargeGroup) {
                    this.value(parseInt(getChargeGroup));
                }
            }
        }).data("kendoMultiColumnComboBox");
    };
    function GetReportTypeComboBox() {

        var GetReportTypeCombox = $("#ReportType").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Name",
            height: 400,
            columns: [
                { field: "Name", title: "Name", width: 150 },
            ],
            filter: "contains",
            filterFields: ["Name"],
            dataSource: {
                transport: {
                    read: {
                        url: "/Common/Common/GetEnumTypeList",
                        data: {
                            EnumType: "SixMonthReportType"
                        },
                        dataType: "json",
                        success: function (response) {
                            console.log("Report Type loaded successfully:", response);
                        },
                        error: function (xhr, status, error) {
                            console.error("Error fetching Report Type list:", error);
                            alert("Error fetching ReportType list.");
                        }
                    }
                }
            },
            placeholder: "Select Report Type",
            value: "",
            dataBound: function (e) {

                if (getReportType && getReportType !== 0) {
                    this.value(getReportType);
                }
            },
            change: function (e) {
                var selectedDiseaseId = this.value();
                console.log("Selected Disease ID:", selectedDiseaseId);
            }
        }).data("kendoMultiColumnComboBox");
        function GetChargeGroup() {
            var ChargeGroupComboBox = $("#ChargeGroup").kendoMultiColumnComboBox({
                dataTextField: "ChargeGroupText",
                dataValueField: "ChargeGroupValue",
                height: 400,
                columns: [
                    { field: "ChargeGroupText", title: "Charge Group Text", width: 150 },
                ],
                filter: "contains",
                filterFields: ["ChargeGroupText"],
                dataSource: {
                    transport: {
                        read: "/Common/Common/GetChargeGroupList"
                    }
                },
                placeholder: "Select Charge Group",
                value: "",
                dataBound: function (e) {
                    if (getChargeGroup) {
                        this.value(parseInt(getChargeGroup));
                    }
                }
            }).data("kendoMultiColumnComboBox");
        };
        function validateAndFetchReportTypeData() {

            var isValid = true;
            var yearId = $('#FiscalYearId').val() || 0;
            var reportType = $('#ReportType').val() || '';

            if (yearId === 'xx' || parseInt(yearId) <= 0) {
                isValid = false;
                ShowNotification(3, 'Fiscal Year Required.');
            }
            else if (parseInt(reportType) <= 0) {
                isValid = false;
                ShowNotification(3, 'Report Type Required.');
            }

            if (isValid) {
                GetReportTypeDetailsData();
            }
        };
        $('#details').on('blur', "td", function (e) {
            updateLineTotal($(this));
        });

    }
    function BudgetReportDownload(model) {

        var form = $('<form method="post" action="/Reports/Budget/BudgetFinalReport"></form>');

        for (var key in model) {
            if (model.hasOwnProperty(key)) {
                form.append('<input type="hidden" name="' + key + '" value="' + model[key] + '" />');
            }
        }

        $('body').append(form);
        form.submit();
        form.remove();
    }

    //function BudgetReportDownload() {
    //    var model = serializeInputs("frmEntry");

    //    var text = document.querySelector("#budgetreport h5").innerText;
    //    if (text === "Budget Report") {
    //        if (model.FiscalYearId === "" || model.FiscalYearId === null) {
    //            ShowNotification(3, "Please Select Fiscal Year");
    //            return;
    //        }
    //        if (model.ReportType === "" || model.ReportType === null) {
    //            ShowNotification(3, "Please Select ReportType");
    //            return;
    //        }
    //    }

    //    var form = $('<form method="post" action="/Reports/Budget/BudgetFinalReport"></form>');

    //    for (var key in model) {
    //        if (model.hasOwnProperty(key)) {
    //            form.append('<input type="hidden" name="' + key + '" value="' + model[key] + '" />');
    //        }
    //    }

    //    $('body').append(form);
    //    form.submit();
    //    form.remove();
    //}

    function NonOperatingDownload(model) {
       
        var form = $('<form method="post" action="/Reports/NonOperatingIncomeReport/NonOperatingIncomeReport"></form>');
        for (var key in model) {
            if (model.hasOwnProperty(key)) {
                form.append('<input type="hidden" name="' + key + '" value="' + model[key] + '" />');
            }
        }
        $('body').append(form);
        form.submit();
        form.remove();
    }

    function IncomeStatementAllDownload(model) {
        var form = $('<form method="post" action="/Reports/IncomeStatementAllReport/IncomeStatementAllReport"></form>');

        for (var key in model) {
            if (model.hasOwnProperty(key)) {
                form.append('<input type="hidden" name="' + key + '" value="' + model[key] + '" />');
            }
        }
        $('body').append(form);
        form.submit();
        form.remove();
    }

    function OperationDetailStatementDownload(model) {

        var form = $('<form method="post" action="/Reports/OperatingDetailStatementReport/OperatingDetailStatementReport"></form>');

        for (var key in model) {
            if (model.hasOwnProperty(key)) {
                form.append('<input type="hidden" name="' + key + '" value="' + model[key] + '" />');
            }
        }

        $('body').append(form);
        form.submit();
        form.remove();
    }

    function PaymentToGovernmentStatementDownload(model) {

        var form = $('<form method="post" action="/Reports/PaymentToGovernmentStatementReport/PaymentToGovernmentStatementReport"></form>');
        for (var key in model) {
            if (model.hasOwnProperty(key)) {
                form.append('<input type="hidden" name="' + key + '" value="' + model[key] + '" />');
            }
        }

        $('body').append(form);
        form.submit();
        form.remove();
    }

    function ProductIncomeStatementDownload(model) {

        var form = $('<form method="post" action="/Reports/ProductIncomeStatementReport/ProductIncomeStatementReport"></form>');

        for (var key in model) {
            if (model.hasOwnProperty(key)) {
                form.append('<input type="hidden" name="' + key + '" value="' + model[key] + '" />');
            }
        }
        $('body').append(form);
        form.submit();
        form.remove();
    }

    

    function CashFlowStatementDownload(model) {

        var form = $('<form method="post" action="/Reports/CashFlowStatementReport/CashFlowStatementReport"></form>');

        for (var key in model) {
            if (model.hasOwnProperty(key)) {
                form.append('<input type="hidden" name="' + key + '" value="' + model[key] + '" />');
            }
        }
        $('body').append(form);
        form.submit();
        form.remove();
    }

    function SaleStatementDownload(model) {

        var form = $('<form method="post" action="/Reports/SalesStatementReport/SalesStatementReport"></form>');

        for (var key in model) {
            if (model.hasOwnProperty(key)) {
                form.append('<input type="hidden" name="' + key + '" value="' + model[key] + '" />');
            }
        }

        $('body').append(form);
        form.submit();
        form.remove();
    }
    function IncomeStatementDownload(model) {

        var form = $('<form method="post" action="/Reports/IncomeStatementReport/IncomeStatementReport"></form>');

        for (var key in model) {
            if (model.hasOwnProperty(key)) {
                form.append('<input type="hidden" name="' + key + '" value="' + model[key] + '" />');
            }
        }

        $('body').append(form);
        form.submit();
        form.remove();
    }

    function SalaryAllowanceReportDownload(model) {

        var form = $('<form method="post" action="/Reports/SalaryAllowanceReport/SalaryAllowanceReport"></form>');

        for (var key in model) {
            if (model.hasOwnProperty(key)) {
                form.append('<input type="hidden" name="' + key + '" value="' + model[key] + '" />');
            }
        }

        $('body').append(form);
        form.submit();
        form.remove();
    }

    function CostStatementReportDownload(model) {

        var form = $('<form method="post" action="/Reports/CostStatementReport/CostStatementReport"></form>');

        for (var key in model) {
            if (model.hasOwnProperty(key)) {
                form.append('<input type="hidden" name="' + key + '" value="' + model[key] + '" />');
            }
        }

        $('body').append(form);
        form.submit();
        form.remove();
    }

    // Handle fail
    function saveFail(result) {
        ShowNotification(3, "Query Exception!");
    }

    // Handle delete done
    
    return {
        init: init
    }
}(CommonService, CommonAjaxService);
