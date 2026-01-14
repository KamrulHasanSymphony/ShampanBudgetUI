var BudgetTransferNewController = function (CommonService, CommonAjaxService) {

    var init = function () {
        
        var getFiscalYearId = $("#FiscalYearId").val() || 0;
        var getToFiscalYearId = $("#FiscalYearId").val() || 0;
        var getBudgetSetNo = $("#BudgetSetNo").val() || 0;
        var getBudgetType = $("#BudgetType").val() || 0;
        var getToBudgetType = $("#ToBudgetType").val() || 0;

        $("[data-bootstrap-switch]").bootstrapSwitch();

        GetFiscalYearComboBox();
        //GetToFiscalYearComboBox();
        GetBudgetTypeComboBox();
        GetToBudgetTypeComboBox();
        //GenerateDatePicker();


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


        // Delete button click handler
        $('.btnDelete').on('click', function () {
            Confirmation("Are you sure? Do You Want to Delete Data?", function (result) {
                if (result) {
                    SelectData();
                }
            });
        });

        // Previous button click handler
        $('#btnPrevious').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/Ceiling/Ceiling/NextPrevious?id=" + getId + "&status=Previous";
            }
        });

        // Next button click handler
        $('#btnNext').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/Ceiling/Ceiling/NextPrevious?id=" + getId + "&status=Next";
            }
        });

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

        function GetToFiscalYearComboBox() {
            var FiscalYearComboBox = $("#ToFiscalYearId").kendoMultiColumnComboBox({
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
                    if (getToFiscalYearId) {
                        this.value(parseInt(getToFiscalYearId));
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
                        read: "/Common/Common/GetEnumTypeList?EnumType=BudgetType"
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

        function GetToBudgetTypeComboBox() {
            var ToBudgetTypeComboBox = $("#ToBudgetType").kendoMultiColumnComboBox({
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
                        read: "/Common/Common/GetEnumTypeList?EnumType=BudgetType"
                    }
                },
                placeholder: "Select Budget Type",
                value: "",
                dataBound: function (e) {
                    if (getToBudgetType) {
                        this.value(getToBudgetType);
                    }
                }
            }).data("kendoMultiColumnComboBox");
        };

    };

    //function GenerateDatePicker() {
    //    $("#TransactionDate").kendoDatePicker({
    //        format: "yyyy-MM-dd",
    //        max: new Date()
    //    });
    //};

    // Select data for delete
    function SelectData() {
        var IDs = [];

        var selectedRows = $("#GridDataList").data("kendoGrid").select();

        if (selectedRows.length === 0) {
            ShowNotification(3, "You are requested to Select checkbox!");
            return;
        }

        selectedRows.each(function () {
            var dataItem = $("#GridDataList").data("kendoGrid").dataItem(this);
            IDs.push(dataItem.Id);
        });

        var model = {
            IDs: IDs
        };

        var url = "/Ceiling/Ceiling/Delete";

        CommonAjaxService.deleteData(url, model, deleteDone, saveFail);
    };

    
    // Save the form data
    function save() {

        var validator = $("#frmEntry").validate();
        var formData = new FormData();
        var model = serializeInputs("frmEntry");

        var isActiveValue = $('#IsActive').prop('checked');
        model.IsActive = isActiveValue;

        var result = validator.form();

        if (!result) {
            if (!result) {
                validator.focusInvalid();
            }
            return;
        }

        var url = "/Ceiling/Budget/BudgetTransferInsert";
        CommonAjaxService.finalSave(url, model, saveDone, saveFail);
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

   
    return {
        init: init
    }
}(CommonService, CommonAjaxService);
