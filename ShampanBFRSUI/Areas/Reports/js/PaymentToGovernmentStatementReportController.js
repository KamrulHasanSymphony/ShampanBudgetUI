var PaymentToGovernmentStatementReportController = function (CommonService, CommonAjaxService) {

    var init = function () {
        var getFiscalYearId = $("#FiscalYearId").val() || 0;
        //var getBudgetType = $("#BudgetType").val() || 0;
        getReportType = $("#ReportType").val() || 0;

        $("[data-bootstrap-switch]").bootstrapSwitch();

        GetFiscalYearComboBox();
        //GetBudgetTypeComboBox();
        GetReportTypeComboBox();


        // Download button click handler
        $('.btnDownload').click('click', function () {
            var status = "Download";

            Confirmation("Are you sure? Do You Want to " + status + " Data?", function (result) {
                if (result) {
                    Download();
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


    function Download() {

        var model = serializeInputs("frmEntry");

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

    // Handle fail
    function saveFail(result) {
        ShowNotification(3, "Query Exception!");
    }

    // Handle delete done
    
    return {
        init: init
    }
}(CommonService, CommonAjaxService);
