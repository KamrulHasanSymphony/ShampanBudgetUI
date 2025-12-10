var CeilingController = function (CommonService, CommonAjaxService) {

    var init = function () {
        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';
        var getFiscalYearId = $("#GLFiscalYearId").val() || 0;
        var getBudgetSetNo = $("#BudgetSetNo").val() || 0;
        var getBudgetType = $("#BudgetType").val() || 0;

        var getTransactionType = $("#TransactionType").val() || '';
        var getMenuType = $("#MenuType").val() || '';

        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList(getTransactionType, getMenuType, getBudgetType);
        }

        if (parseInt(getFiscalYearId) > 0 && parseInt(getBudgetSetNo) > 0 && getBudgetType !== '') {
            GetCeilingDetailsData();
        };

        $("[data-bootstrap-switch]").bootstrapSwitch();

        GetFiscalYearComboBox();
        //GetBudgetSetComboBox();
        //GetBudgetTypeComboBox();
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

        // Download button click handler
        $('.btnDownload').click('click', function () {
            var status = "Download";
            
            Confirmation("Are you sure? Do You Want to " + status + " Data?", function (result) {
                if (result) {
                    Download();
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

        function GetBudgetSetComboBox() {
            var BudgetSetComboBox = $("#BudgetSetNo").kendoMultiColumnComboBox({
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
                        read: "/Common/Common/GetEnumTypeList?value=BudgetSet"
                    }
                },
                placeholder: "Select Budget Set",
                value: "",
                dataBound: function (e) {
                    if (getBudgetSetNo) {
                        this.value(parseInt(getBudgetSetNo));
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
                        read: "/Common/Common/GetEnumTypeList?value=BudgetType"
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

        $('#GLFiscalYearId, #BudgetSetNo, #BudgetType').on('change', validateAndFetchCeilingData);
        function validateAndFetchCeilingData() {

            var isValid = true;
            var yearId = $('#GLFiscalYearId').val() || 0;
            var budgetSetNo = $('#BudgetSetNo').val() || 0;
            var budgetType = $('#BudgetType').val() || '';

            if (yearId === 'xx' || parseInt(yearId) <= 0) {
                isValid = false;
                ShowNotification(3, 'Fiscal Year Required.');
            }
            else if (parseInt(budgetSetNo) <= 0) {
                isValid = false;
                ShowNotification(3, 'Budget Set Required.');
            }
            else if (budgetType === 'xx' || budgetType === '') {
                isValid = false;
                ShowNotification(3, 'Budget Type Required.');
            }

            if (isValid) {
                GetCeilingDetailsData();
            }
        };


        $('#details').on('blur', "td", function (e) {
            updateLineTotal($(this));
        });

    };

    function GenerateDatePicker() {
        $("#TransactionDate").kendoDatePicker({
            format: "yyyy-MM-dd",
            max: new Date()
        });
    };

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

    // Fetch grid data
    var GetGridDataList = function (getTransactionType, getMenuType, getBudgetType) {
        var gridDataSource = new kendo.data.DataSource({
            type: "json",
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            allowUnsort: true,
            autoSync: true,
            pageSize: 10,
            transport: {
                read: {
                    url: "/Ceiling/Ceiling/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false,
                    data: { TransactionType: getTransactionType, MenuType: getMenuType, BudgetType: getBudgetType }
                },
                parameterMap: function (options) {
                    if (options.sort) {
                        options.sort.forEach(function (param) {
                            if (param.field === "Id") {
                                param.field = "c.Id";
                            }
                            if (param.field === "Code") {
                                param.field = "c.Code";
                            }
                            if (param.field === "BudgetType") {
                                param.field = "c.BudgetType";
                            }
                            if (param.field === "YearName") {
                                param.field = "fy.YearName";
                            }
                            //if (param.field === "BudgetSetNo") {
                            //    param.field = "c.BudgetSetNo";
                            //}
                            //if (param.field === "TransactionDate") {
                            //    param.field = "c.TransactionDate";
                            //}
                            if (param.field === "IsActive") {
                                let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";
                                if (statusValue.startsWith("a")) {
                                    param.value = 1;
                                } else if (statusValue.startsWith("i")) {
                                    param.value = 0;
                                } else {
                                    param.value = null;
                                }
                                param.field = "c.IsActive";
                                param.operator = "eq";
                            }
                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {
                            if (param.field === "Id") {
                                param.field = "c.Id";
                            }
                            if (param.field === "Code") {
                                param.field = "c.Code";
                            }
                            if (param.field === "BudgetType") {
                                param.field = "c.BudgetType";
                            }
                            if (param.field === "YearName") {
                                param.field = "fy.YearName";
                            }
                            //if (param.field === "BudgetSetNo") {
                            //    param.field = "c.BudgetSetNo";
                            //}
                            //if (param.field === "TransactionDate") {
                            //    param.field = "c.TransactionDate";
                            //}
                            if (param.field === "IsActive") {
                                let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                                if (statusValue.startsWith("a")) {
                                    param.value = 1;
                                } else if (statusValue.startsWith("i")) {
                                    param.value = 0;
                                } else {
                                    param.value = null;
                                }

                                param.field = "c.IsActive";
                                param.operator = "eq";
                            }
                        });
                    }

                    return options;
                }
            },
            batch: true,
            schema: {
                data: "Items",
                total: "TotalCount"
            }
        });

        $("#GridDataList").kendoGrid({
            dataSource: gridDataSource,
            pageable: {
                refresh: true,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
                pageSizes: [10, 20, 50, "all"]
            },
            noRecords: true,
            messages: {
                noRecords: "No Record Found!"
            },
            scrollable: true,
            filterable: {
                extra: true,
                operators: {
                    string: {
                        startswith: "Starts with",
                        endswith: "Ends with",
                        contains: "Contains",
                        doesnotcontain: "Does not contain",
                        eq: "Is equal to",
                        neq: "Is not equal to",
                        gt: "Is greater than",
                        lt: "Is less than"
                    }
                }
            },
            sortable: true,
            resizable: true,
            reorderable: true,
            groupable: true,
            toolbar: ["excel", "pdf", "search"],
            excel: {
                fileName: "Ceilings.xlsx",
                filterable: true
            },
            pdf: {
                fileName: `Ceilings_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.pdf`,
                allPages: true,
                avoidLink: true,
                filterable: true
            },
            pdfExport: function (e) {
                $(".k-grid-toolbar").hide();
                $(".k-grouping-header").hide();
                $(".k-floatwrap").hide();

                var companyName = "Shampan BFRS System.";
                var fileName = `Ceilings_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.pdf`;

                e.sender.options.pdf = {
                    paperSize: "A4",
                    margin: { top: "4cm", left: "1cm", right: "1cm", bottom: "4cm" },
                    landscape: true,
                    allPages: true,
                    template: `
                            <div style="position: absolute; top: 1cm; left: 1cm; right: 1cm; text-align: center; font-size: 12px; font-weight: bold;">
                                <div>${companyName}</div>
                            </div> `
                };

                e.sender.options.pdf.fileName = fileName;

                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            },
            columns: [
                {
                    title: "Action",
                    width: 60,
                    template: function (dataItem) {
                        return `
                            <a href="/Ceiling/Ceiling/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                                <i class="fas fa-pencil-alt"></i>
                            </a>`;
                    }
                },
                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "Code", title: "Code", sortable: true, width: 200 },
                { field: "BudgetType", title: "Budget Type", sortable: true, width: 200 },
                { field: "YearName", title: "Year", sortable: true, width: 200 },
                //{ field: "BudgetSetNo", title: "Budget Set No", sortable: true, width: 200 },
                //{
                //    field: "TransactionDate",
                //    title: "Document Date",
                //    width: 200,
                //    sortable: true,
                //    template: "#= kendo.toString(kendo.parseDate(TransactionDate), 'dd-MMM-yyyy') #"
                //},
                {
                    field: "IsActive",
                    title: "Active",
                    sortable: true,
                    width: 100,
                    template: function (dataItem) {
                        return dataItem.IsActive ? "Yes" : "No";
                    }
                },
            ],
            editable: false,
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true
        });
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
        var details = [];

        var grid = $("#CeilingDetailsData").data("kendoGrid");
        if (grid) {

            var items = grid.dataSource.view();

            items.forEach(function (x, index) {

                details.push({
                    AccountId: x.AccountId,
                    AccountCode: x.AccountCode,
                    AccountName: x.AccountName,
                    PeriodSl: x.PeriodSl,
                    serial: x.serial,
                    January: x.January,
                    February: x.February,
                    March: x.March,
                    April: x.April,
                    May: x.May,
                    June: x.June,
                    July: x.July,
                    August: x.August,
                    September: x.September,
                    October: x.October,
                    November: x.November,
                    December: x.December,
                    LineTotal: x.LineTotal,
                    InputTotal: x.InputTotal
                });

            });
        }

        if (details.length === 0) {
            ShowNotification(3, "At least one item is required.");
            return;
        }

        model.CeilingDetailList = details;

        //for (var key in model) {
        //    formData.append(key, model[key]);
        //}

        //formData.append("IsActive", $('#IsActive').prop('checked'));
        //formData.append("IsChangePassword", $('#IsChangePassword').prop('checked'));

        var url = "/Ceiling/Ceiling/CreateEdit";
        CommonAjaxService.finalSave(url, model, saveDone, saveFail);
    }

    function Download() {
        var model = serializeInputs("frmEntry");

        var form = $('<form method="post" action="/Ceiling/Ceiling/BudgetFinalReport"></form>');

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

        //if (result.Status == 200) {
        //    ShowNotification(1, result.Message);
        //    $(".divSave").hide();
        //    $(".divUpdate").show();
        //    $("#Id").val(result.Data.Id);
        //    $("#Operation").val("update");
        //    $("#Code").val(result.Data.Code);

        //}
        //else {

        //}
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

    var GetCeilingDetailsData = function () {
        var yearId = $('#GLFiscalYearId').val() || 0;
        var budgetSetNo = $('#BudgetSetNo').val() || 0;
        var budgetType = $('#BudgetType').val() || '';

        if (parseInt(yearId) > 0 && parseInt(budgetSetNo) > 0 && budgetType !== '') {
            var gridDataSource = new kendo.data.DataSource({
                type: "json",
                serverPaging: false,
                serverSorting: false,
                serverFiltering: false,
                allowUnsort: true,
                autoSync: true,
                pageSize: 10,
                transport: {
                    read: {
                        url: "/Ceiling/Ceiling/GetAllSabreDataForDetails",
                        type: "POST",
                        dataType: "json",
                        cache: false,
                        data: { yearId: yearId, budgetSetNo: budgetSetNo, budgetType: budgetType }
                    },
                    parameterMap: function (options) {
                        if (options.sort) {
                            options.sort.forEach(function (param) {
                                if (param.field === "COACode") {
                                    param.field = "COAs.Code";
                                }
                                if (param.field === "COAName") {
                                    param.field = "COAs.Name";
                                }
                                if (param.field === "AccountCode") {
                                    param.field = "Sabres.Code";
                                }
                                if (param.field === "AccountName") {
                                    param.field = "Sabres.[Name]";
                                }
                                if (param.field === "January") {
                                    param.field = "b.A";
                                }
                                if (param.field === "February") {
                                    param.field = "b.B";
                                }
                                if (param.field === "March") {
                                    param.field = "b.C";
                                }
                                if (param.field === "April") {
                                    param.field = "b.D";
                                }
                                if (param.field === "May") {
                                    param.field = "b.E";
                                }
                                if (param.field === "June") {
                                    param.field = "b.F";
                                }
                                if (param.field === "July") {
                                    param.field = "b.G";
                                }
                                if (param.field === "August") {
                                    param.field = "b.H";
                                }
                                if (param.field === "September") {
                                    param.field = "b.I";
                                }
                                if (param.field === "October") {
                                    param.field = "b.J";
                                }
                                if (param.field === "November") {
                                    param.field = "b.K";
                                }
                                if (param.field === "December") {
                                    param.field = "b.L";
                                }

                            });
                        }
                        if ((options.filter && options.filter.filters)) {
                            options.filter.filters.forEach(function (param) {

                                if (filter.field === "COACode") {
                                    filter.field = "COAs.Code";
                                }
                                if (filter.field === "COAName") {
                                    filter.field = "COAs.Name";
                                }
                                if (filter.field === "AccountCode") {
                                    filter.field = "Sabres.Code";
                                }
                                if (filter.field === "AccountName") {
                                    filter.field = "Sabres.[Name]";
                                }
                                if (filter.field === "January") {
                                    filter.field = "b.A";
                                    options.filter.filters.forEach(function (res) {
                                        if (typeof res.value === 'string' && res.value.includes(',')) {
                                            res.value = parseFloat(res.value.replace(/,/g, '')) || 0;
                                        }
                                        else {
                                            res.value = parseFloat(res.value) || 0;
                                        }
                                    });
                                }
                                if (param.field === "February") {
                                    param.field = "b.B";
                                    options.filter.filters.forEach(function (res) {
                                        if (typeof res.value === 'string' && res.value.includes(',')) {
                                            res.value = parseFloat(res.value.replace(/,/g, '')) || 0;
                                        }
                                        else {
                                            res.value = parseFloat(res.value) || 0;
                                        }
                                    });
                                }
                                if (param.field === "March") {
                                    param.field = "b.C";
                                    options.filter.filters.forEach(function (res) {
                                        if (typeof res.value === 'string' && res.value.includes(',')) {
                                            res.value = parseFloat(res.value.replace(/,/g, '')) || 0;
                                        }
                                        else {
                                            res.value = parseFloat(res.value) || 0;
                                        }
                                    });
                                }
                                if (param.field === "April") {
                                    param.field = "b.D";
                                    options.filter.filters.forEach(function (res) {
                                        if (typeof res.value === 'string' && res.value.includes(',')) {
                                            res.value = parseFloat(res.value.replace(/,/g, '')) || 0;
                                        }
                                        else {
                                            res.value = parseFloat(res.value) || 0;
                                        }
                                    });
                                }
                                if (param.field === "May") {
                                    param.field = "b.E";
                                    options.filter.filters.forEach(function (res) {
                                        if (typeof res.value === 'string' && res.value.includes(',')) {
                                            res.value = parseFloat(res.value.replace(/,/g, '')) || 0;
                                        }
                                        else {
                                            res.value = parseFloat(res.value) || 0;
                                        }
                                    });
                                }
                                if (param.field === "June") {
                                    param.field = "b.F";
                                    options.filter.filters.forEach(function (res) {
                                        if (typeof res.value === 'string' && res.value.includes(',')) {
                                            res.value = parseFloat(res.value.replace(/,/g, '')) || 0;
                                        }
                                        else {
                                            res.value = parseFloat(res.value) || 0;
                                        }
                                    });
                                }
                                if (param.field === "July") {
                                    param.field = "b.G";
                                    options.filter.filters.forEach(function (res) {
                                        if (typeof res.value === 'string' && res.value.includes(',')) {
                                            res.value = parseFloat(res.value.replace(/,/g, '')) || 0;
                                        }
                                        else {
                                            res.value = parseFloat(res.value) || 0;
                                        }
                                    });
                                }
                                if (param.field === "August") {
                                    param.field = "b.H";
                                    options.filter.filters.forEach(function (res) {
                                        if (typeof res.value === 'string' && res.value.includes(',')) {
                                            res.value = parseFloat(res.value.replace(/,/g, '')) || 0;
                                        }
                                        else {
                                            res.value = parseFloat(res.value) || 0;
                                        }
                                    });
                                }
                                if (param.field === "September") {
                                    param.field = "b.I";
                                    options.filter.filters.forEach(function (res) {
                                        if (typeof res.value === 'string' && res.value.includes(',')) {
                                            res.value = parseFloat(res.value.replace(/,/g, '')) || 0;
                                        }
                                        else {
                                            res.value = parseFloat(res.value) || 0;
                                        }
                                    });
                                }
                                if (param.field === "October") {
                                    param.field = "b.J";
                                    options.filter.filters.forEach(function (res) {
                                        if (typeof res.value === 'string' && res.value.includes(',')) {
                                            res.value = parseFloat(res.value.replace(/,/g, '')) || 0;
                                        }
                                        else {
                                            res.value = parseFloat(res.value) || 0;
                                        }
                                    });
                                }
                                if (param.field === "November") {
                                    param.field = "b.K";
                                    options.filter.filters.forEach(function (res) {
                                        if (typeof res.value === 'string' && res.value.includes(',')) {
                                            res.value = parseFloat(res.value.replace(/,/g, '')) || 0;
                                        }
                                        else {
                                            res.value = parseFloat(res.value) || 0;
                                        }
                                    });
                                }
                                if (param.field === "December") {
                                    param.field = "b.L";
                                    options.filter.filters.forEach(function (res) {
                                        if (typeof res.value === 'string' && res.value.includes(',')) {
                                            res.value = parseFloat(res.value.replace(/,/g, '')) || 0;
                                        }
                                        else {
                                            res.value = parseFloat(res.value) || 0;
                                        }
                                    });
                                }


                            });
                        }
                        return options;
                    }
                },
                batch: true,
                schema: {
                    data: "Items",
                    total: "TotalCount",
                    model: {
                        fields: {
                            serial: { editable: false },
                            AccountCode: { editable: false },
                            AccountName: { editable: false },
                            InputTotal: { type: "number", defaultValue: 0, validation: { min: 0 } },
                            January: { type: "number", defaultValue: 0, validation: { min: 0 } },
                            February: { type: "number", defaultValue: 0, validation: { min: 0 } },
                            March: { type: "number", defaultValue: 0, validation: { min: 0 } },
                            April: { type: "number", defaultValue: 0, validation: { min: 0 } },
                            May: { type: "number", defaultValue: 0, validation: { min: 0 } },
                            June: { type: "number", defaultValue: 0, validation: { min: 0 } },
                            July: { type: "number", defaultValue: 0, validation: { min: 0 } },
                            August: { type: "number", defaultValue: 0, validation: { min: 0 } },
                            September: { type: "number", defaultValue: 0, validation: { min: 0 } },
                            October: { type: "number", defaultValue: 0, validation: { min: 0 } },
                            November: { type: "number", defaultValue: 0, validation: { min: 0 } },
                            December: { type: "number", defaultValue: 0, validation: { min: 0 } },
                            LineTotal: { type: "number", editable: false }
                        }
                    }
                },
                aggregate: [

                    { field: "InputTotal", aggregate: "sum" },
                    { field: "January", aggregate: "sum" },
                    { field: "February", aggregate: "sum" },
                    { field: "March", aggregate: "sum" },
                    { field: "April", aggregate: "sum" },
                    { field: "May", aggregate: "sum" },
                    { field: "June", aggregate: "sum" },
                    { field: "July", aggregate: "sum" },
                    { field: "August", aggregate: "sum" },
                    { field: "September", aggregate: "sum" },
                    { field: "October", aggregate: "sum" },
                    { field: "November", aggregate: "sum" },
                    { field: "December", aggregate: "sum" },
                    { field: "LineTotal", aggregate: "sum" }
                ]

            });

            $("#CeilingDetailsData").kendoGrid({
                dataSource: gridDataSource,
                pageable: {
                    refresh: true,
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true,
                    pageSizes: [10, 20, 50, "all"]
                },
                noRecords: true,
                messages: {
                    noRecords: "No Record Found!"
                },
                scrollable: true,
                filterable: {
                    extra: true,
                    operators: {
                        string: {
                            startswith: "Starts with",
                            endswith: "Ends with",
                            contains: "Contains",
                            doesnotcontain: "Does not contain",
                            eq: "Is equal to",
                            neq: "Is not equal to",
                            gt: "Is greater than",
                            lt: "Is less than"
                        }
                    }
                },
                sortable: true,
                resizable: true,
                reorderable: true,
                groupable: true,
                toolbar: ["excel"],
                editable: {
                    mode: "incell",
                    createAt: "bottom"
                },
                excel: {
                    fileName: "Ceiling Details.xlsx",
                    filterable: true
                },
                save: function (e) {
                    const grid = this;

                    if (e.values && e.values.InputTotal !== undefined) {

                        var dataItem = e.model;
                        var perMonth = parseFloat(e.values.InputTotal) / 12;

                        debugger;

                        // Set each month
                        dataItem.January = perMonth;
                        dataItem.February = perMonth;
                        dataItem.March = perMonth;
                        dataItem.April = perMonth;
                        dataItem.May = perMonth;
                        dataItem.June = perMonth;
                        dataItem.July = perMonth;
                        dataItem.August = perMonth;
                        dataItem.September = perMonth;
                        dataItem.October = perMonth;
                        dataItem.November = perMonth;
                        dataItem.December = perMonth;

                        //dataItem.set("LineTotal", perMonth * 12);
                    }
                    setTimeout(function () {
                        grid.dataSource.aggregate();
                        grid.refresh();
                        $('#CeilingDetailsData .k-grid-content').scrollLeft(horizontalScrollLeft);
                        $(e.container).find('input').focus();
                    }, 0);
                },
                //save: function (e) {
                //    const grid = this;
                //    setTimeout(function () {
                //        grid.dataSource.aggregate();
                //        grid.refresh();
                //        $('#CeilingDetailsData .k-grid-content').scrollLeft(horizontalScrollLeft);
                //        $(e.container).find('input').focus();
                //    }, 0);
                //},

                columns: [

                    { field: "AccountId", width: 50, hidden: true, sortable: true },
                    { field: "Serial", title: "SL", sortable: true, width: 70, editable: false },
                    { field: "COACode", title: "iBAS Code", sortable: true, width: 170, editable: false },
                    { field: "COAName", title: "iBAS Name", sortable: true, width: 170, editable: false },
                    { field: "AccountCode", title: "Sabre Code", sortable: true, width: 170, editable: false },
                    { field: "AccountName", title: "Sabre Name", width: 320, sortable: true, editable: false },
                    //{
                    //    field: "InputTotal",
                    //    title: "InputTotal",
                    //    editor: InputTotalEditor,
                    //    template: function (dataItem) {
                    //        return dataItem.InputTotal || "";
                    //    },
                    //    //footerTemplate: function () {

                    //    //    var data = $("#CeilingDetailsData").data("kendoGrid").dataSource.view();
                    //    //    var sum = 0;
                    //    //    for (var i = 0; i < data.length; i++) {
                    //    //        sum += (data[i].InputTotal || 0);
                    //    //    }
                    //    //    return kendo.toString(sum, "n2");
                    //    //},
                    //    width: 160
                    //},
                    {
                        field: "InputTotal", title: "Input Total", sortable: true, width: 160, hidden: true, aggregates: ["sum"], format: "{0:n2}", groupFooterTemplate: "#=kendo.toString(sum, 'n2')#", attributes: { style: "text-align: right;" }
                        , footerTemplate: function () {

                            var data = $("#CeilingDetailsData").data("kendoGrid").dataSource.view();
                            var sum = 0;
                            for (var i = 0; i < data.length; i++) {
                                sum += (data[i].InputTotal || 0);
                            }
                            return kendo.toString(sum, "n2");
                        }
                    },
                    {
                        field: "January", title: "January", sortable: true, width: 160, hidden: true, aggregates: ["sum"], format: "{0:n2}", groupFooterTemplate: "#=kendo.toString(sum, 'n2')#", attributes: { style: "text-align: right;" }
                        , footerTemplate: function () {

                            var data = $("#CeilingDetailsData").data("kendoGrid").dataSource.view();
                            var sum = 0;
                            for (var i = 0; i < data.length; i++) {
                                sum += (data[i].January || 0);
                            }
                            return kendo.toString(sum, "n2");
                        }

                    },
                    {
                        field: "February", title: "February", sortable: true, width: 160, hidden: true, aggregates: ["sum"], format: "{0:n2}", groupFooterTemplate: "#=kendo.toString(sum, 'n2')#", attributes: { style: "text-align: right;" }, footerTemplate: function () {

                            var data = $("#CeilingDetailsData").data("kendoGrid").dataSource.view();
                            var sum = 0;
                            for (var i = 0; i < data.length; i++) {
                                sum += (data[i].February || 0);
                            }
                            return kendo.toString(sum, "n2");
                        }
                    },
                    {
                        field: "March", title: "March", sortable: true, width: 160, hidden: true, aggregates: ["sum"], format: "{0:n2}", groupFooterTemplate: "#=kendo.toString(sum, 'n2')#", attributes: { style: "text-align: right;" }, footerTemplate: function () {

                            var data = $("#CeilingDetailsData").data("kendoGrid").dataSource.view();
                            var sum = 0;
                            for (var i = 0; i < data.length; i++) {
                                sum += (data[i].March || 0);
                            }
                            return kendo.toString(sum, "n2");
                        }
                    },
                    {
                        field: "April", title: "April", sortable: true, width: 160, hidden: true, aggregates: ["sum"], format: "{0:n2}", groupFooterTemplate: "#=kendo.toString(sum, 'n2')#", attributes: { style: "text-align: right;" }, footerTemplate: function () {

                            var data = $("#CeilingDetailsData").data("kendoGrid").dataSource.view();
                            var sum = 0;
                            for (var i = 0; i < data.length; i++) {
                                sum += (data[i].April || 0);
                            }
                            return kendo.toString(sum, "n2");
                        }
                    },
                    {
                        field: "May", title: "May", sortable: true, width: 160, hidden: true, aggregates: ["sum"], format: "{0:n2}", groupFooterTemplate: "#=kendo.toString(sum, 'n2')#", attributes: { style: "text-align: right;" }, footerTemplate: function () {

                            var data = $("#CeilingDetailsData").data("kendoGrid").dataSource.view();
                            var sum = 0;
                            for (var i = 0; i < data.length; i++) {
                                sum += (data[i].May || 0);
                            }
                            return kendo.toString(sum, "n2");
                        }
                    },
                    {
                        field: "June", title: "June", sortable: true, width: 160, hidden: true, aggregates: ["sum"], format: "{0:n2}", groupFooterTemplate: "#=kendo.toString(sum, 'n2')#", attributes: { style: "text-align: right;" }, footerTemplate: function () {

                            var data = $("#CeilingDetailsData").data("kendoGrid").dataSource.view();
                            var sum = 0;
                            for (var i = 0; i < data.length; i++) {
                                sum += (data[i].June || 0);
                            }
                            return kendo.toString(sum, "n2");
                        }
                    },
                    {
                        field: "July", title: "July", sortable: true, width: 160, hidden: true, aggregates: ["sum"], format: "{0:n2}", groupFooterTemplate: "#=kendo.toString(sum, 'n2')#", attributes: { style: "text-align: right;" }, footerTemplate: function () {

                            var data = $("#CeilingDetailsData").data("kendoGrid").dataSource.view();
                            var sum = 0;
                            for (var i = 0; i < data.length; i++) {
                                sum += (data[i].July || 0);
                            }
                            return kendo.toString(sum, "n2");
                        }
                    },
                    {
                        field: "August", title: "August", sortable: true, width: 160, hidden: true, aggregates: ["sum"], format: "{0:n2}", groupFooterTemplate: "#=kendo.toString(sum, 'n2')#", attributes: { style: "text-align: right;" }, footerTemplate: function () {

                            var data = $("#CeilingDetailsData").data("kendoGrid").dataSource.view();
                            var sum = 0;
                            for (var i = 0; i < data.length; i++) {
                                sum += (data[i].August || 0);
                            }
                            return kendo.toString(sum, "n2");
                        }
                    },
                    {
                        field: "September", title: "September", sortable: true, width: 160, hidden: true, aggregates: ["sum"], format: "{0:n2}", groupFooterTemplate: "#=kendo.toString(sum, 'n2')#", attributes: { style: "text-align: right;" }, footerTemplate: function () {

                            var data = $("#CeilingDetailsData").data("kendoGrid").dataSource.view();
                            var sum = 0;
                            for (var i = 0; i < data.length; i++) {
                                sum += (data[i].September || 0);
                            }
                            return kendo.toString(sum, "n2");
                        }
                    },
                    {
                        field: "October", title: "October", sortable: true, width: 160, hidden: true, aggregates: ["sum"], format: "{0:n2}", groupFooterTemplate: "#=kendo.toString(sum, 'n2')#", attributes: { style: "text-align: right;" }, footerTemplate: function () {

                            var data = $("#CeilingDetailsData").data("kendoGrid").dataSource.view();
                            var sum = 0;
                            for (var i = 0; i < data.length; i++) {
                                sum += (data[i].October || 0);
                            }
                            return kendo.toString(sum, "n2");
                        }
                    },
                    {
                        field: "November", title: "November", sortable: true, hidden: true, width: 160, aggregates: ["sum"], format: "{0:n2}", groupFooterTemplate: "#=kendo.toString(sum, 'n2')#", attributes: { style: "text-align: right;" }, footerTemplate: function () {

                            var data = $("#CeilingDetailsData").data("kendoGrid").dataSource.view();
                            var sum = 0;
                            for (var i = 0; i < data.length; i++) {
                                sum += (data[i].November || 0);
                            }
                            return kendo.toString(sum, "n2");
                        }
                    },
                    {
                        field: "December", title: "December", sortable: true, width: 160, hidden: true, aggregates: ["sum"], format: "{0:n2}", groupFooterTemplate: "#=kendo.toString(sum, 'n2')#", attributes: { style: "text-align: right;" }, footerTemplate: function () {

                            var data = $("#CeilingDetailsData").data("kendoGrid").dataSource.view();
                            var sum = 0;
                            for (var i = 0; i < data.length; i++) {
                                sum += (data[i].December || 0);
                            }
                            return kendo.toString(sum, "n2");
                        }
                    },
                    {
                        title: "Line Total", hidden: true,
                        template: function (dataItem) {

                            var total = (dataItem.January || 0) + (dataItem.February || 0) + (dataItem.March || 0) + (dataItem.April || 0)
                                + (dataItem.May || 0) + (dataItem.June || 0) + (dataItem.July || 0) + (dataItem.August || 0)
                                + (dataItem.September || 0) + (dataItem.October || 0) + (dataItem.November || 0) + (dataItem.December || 0);
                            return kendo.toString(total, "n2");
                        },
                        attributes: { style: "text-align:right;" },
                        footerTemplate: function () {
                            var data = $("#CeilingDetailsData").data("kendoGrid").dataSource.view();
                            var sum = 0;
                            for (var i = 0; i < data.length; i++) {
                                sum += (data[i].January || 0) + (data[i].February || 0) + (data[i].March || 0) + (data[i].April || 0)
                                    + (data[i].May || 0) + (data[i].June || 0) + (data[i].July || 0) + (data[i].August || 0)
                                    + (data[i].September || 0) + (data[i].October || 0) + (data[i].November || 0) + (data[i].December || 0);
                            }
                            return kendo.toString(sum, "n2");
                        },
                        width: 180, editable: false
                    },

                    { field: "AccountCode", title: "Sabre Code", sortable: true, width: 170, hidden: true, editable: false },
                ],
                footer: true,
                selectable: "row",
                navigatable: true,
                columnMenu: true
            });

            let horizontalScrollLeft = 0;
            $('#CeilingDetailsData .k-grid-content').on('scroll', function () {
                horizontalScrollLeft = $(this).scrollLeft();
            });
        }
        else {
            ShowNotification(3, 'Please Fillup Required Fields.');
        }

    };

    function InputTotalEditor(container, options) {
        var wrapper = $('<div class="input-group input-group-sm full-width">').appendTo(container);

        // Input field
        var input = $('<input type="text" class="form-control inputTotal"/>')
            .val(options.model.InputTotal || 0)
            .appendTo(wrapper);

        // Button with icon
        $('<div class="input-group-append">')
            .append(
                $('<button class="btn btn-light" type="button">')
                    .append('<i class="fa fa-calculator"></i>')
                    .on("mousedown", function (e) {
                        e.preventDefault(); // prevent input losing focus
                    })
                    .on("click", function () {

                        var grid = $("#CeilingDetailsData").data("kendoGrid");
                        var dataItem = options.model;

                        // Get input value directly
                        var inputVal = parseFloat(input.val()) || 0;
                        var perMonth = parseFloat((inputVal / 12).toFixed(2));

                        // Update months
                        dataItem.set("January", perMonth);
                        dataItem.set("February", perMonth);
                        dataItem.set("March", perMonth);
                        dataItem.set("April", perMonth);
                        dataItem.set("May", perMonth);
                        dataItem.set("June", perMonth);
                        dataItem.set("July", perMonth);
                        dataItem.set("August", perMonth);
                        dataItem.set("September", perMonth);
                        dataItem.set("October", perMonth);
                        dataItem.set("November", perMonth);
                        dataItem.set("December", perMonth);

                        dataItem.set("LineTotal", inputVal);
                        dataItem.set("InputTotal", inputVal);

                        input.val(inputVal);

                        setTimeout(function () {
                            grid.dataSource.aggregate();
                            grid.refresh();
                        }, 0);
                    })
            )
            .appendTo(wrapper);

        kendo.bind(wrapper, options.model);
    }

    $("#CeilingDetailsData").on("click", ".btnCalculate", function () {
        var grid = $("#CeilingDetailsData").data("kendoGrid");
        var row = $(this).closest("tr");
        var dataItem = grid.dataItem(row);

        var inputVal = parseFloat(row.find(".inputTotal").val()) || 0;
        var perMonth = parseFloat((inputVal / 12).toFixed(2));

        // Set monthly values
        dataItem.January = perMonth;
        dataItem.February = perMonth;
        dataItem.March = perMonth;
        dataItem.April = perMonth;
        dataItem.May = perMonth;
        dataItem.June = perMonth;
        dataItem.July = perMonth;
        dataItem.August = perMonth;
        dataItem.September = perMonth;
        dataItem.October = perMonth;
        dataItem.November = perMonth;
        dataItem.December = perMonth;

        // Set LineTotal
        dataItem.LineTotal = inputVal;

        // Update InputTotal in the model
        dataItem.InputTotal = inputVal;

        // Refresh grid and aggregates
        grid.dataSource.aggregate();
        grid.refresh();
    });


    return {
        init: init
    }
}(CommonService, CommonAjaxService);
