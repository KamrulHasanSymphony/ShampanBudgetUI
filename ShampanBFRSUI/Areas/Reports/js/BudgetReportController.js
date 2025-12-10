var BudgetReportController = function (CommonService, CommonAjaxService) {

    var init = function () {
        var getFiscalYearId = $("#GLFiscalYearId").val() || 0;
        var getReportType = $("#ReportType").val() || 0;
        var getOperation = $("#Operation").val() || '';
        if (getOperation !== '') {
            GetReportType();
        }
       
        $("[data-bootstrap-switch]").bootstrapSwitch();

        GetFiscalYearComboBox();
        GetReportType();
       
        // Save button click handler
        $('.btnsave').click('click', function () {
            var getId = $('#Id').val();
            var status = "Save";
            if (parseInt(getId) > 0) {
                status = "Update";
            }
            Confirmation("Are you sure? Do You Want to " + status + " Data?", function (result) {
                if (result) {
                    save();
                }
            });
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

        function GetFiscalYearComboBox() {
            var FiscalYearComboBox = $("#GLFiscalYearId").kendoMultiColumnComboBox({
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

        $('#details').on('blur', "td", function (e) {
            updateLineTotal($(this));
        });

    };
    function GetReportType() {

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
    }


    function Download() {
        var model = serializeInputs("frmEntry");

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


    // Handle success
    function saveDone(result) {

        if (result.Status == 200) {

            if (result.Data.Operation == "add") {

                ShowNotification(1, result.Message);
                $(".divSave").hide();
                $(".divUpdate").show();

                $("#Code").val(result.Data.Code);
                $("#Id").val(result.Data.Id);
                $("#Operation").val("update");
                $("#CreatedBy").val(result.Data.CreatedBy);
                $("#CreatedOn").val(result.Data.CreatedOn);

            } else {

                ShowNotification(1, result.Message);
                $("#LastModifiedBy").val(result.Data.LastModifiedBy);
                $("#LastModifiedOn").val(result.Data.LastModifiedOn);
            }

        } else if (result.Status == 400) {
            ShowNotification(3, result.Message);

        } else {
            ShowNotification(2, result.Message);
        }

    }

    // Handle fail
    function saveFail(result) {
        ShowNotification(3, "Query Exception!");
    }

    // Handle delete done
    function deleteDone(result) {
        var grid = $('#GridDataList').data('kendoGrid');
        if (grid) {
            grid.dataSource.read();
        }

        if (result.Status == 200) {
            ShowNotification(1, result.Message);
        }
    }


    return {
        init: init
    }
}(CommonService, CommonAjaxService);
