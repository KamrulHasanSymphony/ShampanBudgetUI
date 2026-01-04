var SalaryAllowanceReportController = function (CommonService, CommonAjaxService) {

    var init = function () {
        var getFiscalYearId = $("#FiscalYearId").val() || 0;
        var getBudgetType = $("#BudgetType").val() || 0;
       
        $("[data-bootstrap-switch]").bootstrapSwitch();

        GetFiscalYearComboBox();
        GetBudgetTypeComboBox();
       
        $('.btnLoad').click('click', function () {
            validateAndFetchReportTypeData();
        });

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
                    read: "/Common/Common/GetEnumTypeList?EnumType=SalaryAllowanceBudgetType"
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

    function Download() {
        var YearName = $("#FiscalYearId").text();
        $("#YearName").val(YearName);

        var model = serializeInputs("frmEntry");

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

    // Handle fail
    function saveFail(result) {
        ShowNotification(3, "Query Exception!");
    }

    // Handle delete done
    
    return {
        init: init
    }
}(CommonService, CommonAjaxService);
