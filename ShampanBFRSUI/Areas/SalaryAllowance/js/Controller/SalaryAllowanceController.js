var SalaryAllowanceController = function (CommonService, CommonAjaxService) {

    var getChargeGroup = 0;

    var init = function () {
        debugger;

        decimalPlace = $("#DecimalPlace").val() || 2;
        var getId = $("#Id").val() || 0;
        getChargeGroup = $("#ChargeGroup").val() || 0;
        var getOperation = $("#Operation").val() || '';
        getFiscalYearId = $("#FiscalYearId").val() || 0;
        getBudgetType = $("#BudgetType").val() || '';

        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();

        };

        GetFiscalYear();
        //GetBudgetTypeComboBox();
        GenerateDatepicker();


        $(document).on('click', '.edit-sale-order', function () {
            kendo.alert("You can't edit this order because it has already been delivered.");
        });

        var $table = $('#details');

        var table = initEditTable($table, { searchHandleAfterEdit: false });


        $('#addRows').on('click', function (e) {
            debugger;
            addRow($table);

        });

        $('.btnsave').click('click', function () {
            debugger;
            var getId = $('#Id').val();
            var status = "Save";
            if (parseInt(getId) > 0) {
                status = "Update";
            }

            Confirmation("Are you sure? Do You Want to " + status + " Data?",
                function (result) {
                    if (result) {
                        save($table);
                    }
                });
        });

        $('#btnPost').on('click', function () { //For Index
            debugger;
            Confirmation("Are you sure? Do You Want to Post Data?",
                function (result) {

                    if (result) {
                        SelectData();
                    }
                });
        });


        //make modal
        $('#details').on('click', 'input.txtPersonnelCategoriesName', function () {
            debugger;
            var originalRow = $(this);
            debugger;

            originalRow.closest("td").find("input").data('touched', true);

            CommonService.personnelCategoriesNameModal(
                function success(result) {
                },
                function fail(error) {
                    originalRow.closest("td").find("input").data("touched", false).focus();
                },
                function dblClick(row) {
                    personnelCategoriesNameModalDblClick(row, originalRow);
                },
                function closeCallback() {
                    originalRow.closest("td").find("input").data("touched", false).focus();
                }
            );
        });
        $('#details').on('blur', ".td-BasicWagesSalaries", function (event) {
            computeSubTotal($(this), '');
        });
        $('#details').on('blur', ".td-OtherCash", function (event) {
            computeSubTotal($(this), '');
        });


        $("#indexSearch").on('click', function () {
            var branchId = $("#Branchs").data("kendoMultiColumnComboBox").value();

            const gridElement = $("#GridDataList");
            if (gridElement.data("kendoGrid")) {
                gridElement.data("kendoGrid").destroy();
                gridElement.empty();
            }

            GetGridDataList();

        });



    };
    function computeSubTotal(row, param) {
        debugger;
        var salary = parseFloat(row.closest("tr").find("td.td-BasicWagesSalaries").text().replace(/,/g, '')) || 0;
        var otherCash = parseFloat(row.closest("tr").find("td.td-OtherCash").text().replace(/,/g, '')) || 0;

        if (!isNaN(salary + otherCash)) {

            var SubTotal = Number(parseFloat(salary + otherCash).toFixed(parseInt(decimalPlace)));
            row.closest("tr").find("td.td-TotalSalary").text(SubTotal.toLocaleString('en', { minimumFractionDigits: parseInt(decimalPlace) }));

        }
    };
    function GetFiscalYear() {
        //make dropdown
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
    }
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
    function GenerateDatepicker() {
        $("#TransactionDate").kendoDatePicker({
            value: new Date(), // Optional: Set initial date
            format: "yyyy-MM-dd" // Optional: Set the date format
        });
    }
    function personnelCategoriesNameModalDblClick(row, originalRow) {
        debugger;

        var dataTable = $("#modalData").DataTable();
        var rowData = dataTable.row(row).data();

        var Id = rowData.Id;
        var SL = rowData.SL;
        var CategoryOfPersonnel = rowData.CategoryOfPersonnel;



        var $currentRow = originalRow.closest('tr');

        $currentRow.find('.td-PersonnelCategoriesName').text(CategoryOfPersonnel);
        //$currentRow.find('.td-Code').text(Code);
        $currentRow.find('.td-PersonnelCategoriesId').text(Id);


        $("#partialModal").modal("hide");
        originalRow.closest("td").find("input").data("touched", false).focus();

    };


    var GetGridDataList = function () {
        debugger;
        var budgetType = getBudgetType;
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
                    url: "/SalaryAllowance/SalaryAllowance/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false,
                    data: { budgetType: budgetType }

                },
                parameterMap: function (options) {
                    if (options.sort) {
                        options.sort.forEach(function (param) {

                            if (param.field === "Id") {
                                param.field = "M.Id";
                            }
                            if (param.field === "FiscalYearId") {
                                param.field = "M.FiscalYearId";
                            }
                            if (param.field === "BudgetType") {
                                param.field = "M.BudgetType";
                            }
                            if (param.field === "TransactionDate") {
                                param.field = "M.TransactionDate";

                                if (param.value) {
                                    let date = new Date(param.value); // parse it manually

                                    if (!isNaN(date.getTime())) {
                                        // Format to 'yyyy-MM-dd'
                                        let year = date.getFullYear();
                                        let month = (date.getMonth() + 1).toString().padStart(2, '0');
                                        let day = date.getDate().toString().padStart(2, '0');
                                        param.value = `${year}-${month}-${day}`;
                                    }
                                }
                            }


                            if (param.field === "Status") {
                                let statusValue = (param.value || "").toString().trim().toLowerCase();

                                if (statusValue === "1" || statusValue === "posted") {
                                    param.value = 1;
                                } else if (statusValue === "0" || statusValue === "not posted") {
                                    param.value = 0;
                                } else {
                                    param.value = null;
                                }

                                param.field = "M.IsPost";
                                param.operator = "eq";
                            }



                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {

                            if (param.field === "Id") {
                                param.field = "M.Id";
                            }
                            if (param.field === "FiscalYearId") {
                                param.field = "M.FiscalYearId";
                            }
                            if (param.field === "BudgetType") {
                                param.field = "M.BudgetType";
                            }
                            if (param.field === "TransactionDate") {
                                param.field = "M.TransactionDate";

                                if (param.value) {
                                    let date = new Date(param.value); // parse it manually

                                    if (!isNaN(date.getTime())) {
                                        // Format to 'yyyy-MM-dd'
                                        let year = date.getFullYear();
                                        let month = (date.getMonth() + 1).toString().padStart(2, '0');
                                        let day = date.getDate().toString().padStart(2, '0');
                                        param.value = `${year}-${month}-${day}`;
                                    }
                                }
                            }

                            if (param.field === "Status") {
                                let statusValue = (param.value || "").toString().trim().toLowerCase();

                                if (statusValue === "1" || statusValue === "posted") {
                                    param.value = 1;
                                } else if (statusValue === "0" || statusValue === "not posted") {
                                    param.value = 0;
                                } else {
                                    param.value = null;
                                }

                                param.field = "M.IsPost";
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
            },
            model: {

                fields: {
                    RequisitionDate: { type: "date" }
                }
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
            search: [""],

            detailInit: function (e) {

                console.log("Master ID:", e.data.Id);

                $("<div/>").appendTo(e.detailCell).kendoGrid({
                    dataSource: {
                        type: "json",
                        serverPaging: true,
                        serverSorting: true,
                        serverFiltering: true,
                        allowUnsort: true,
                        pageSize: 10,

                        transport: {
                            read: {
                                url: "/SalaryAllowance/SalaryAllowance/GetDetailDataById",
                                type: "GET",
                                dataType: "json",
                                cache: false,
                                data: { masterId: e.data.Id }
                            },
                            parameterMap: function (options) {
                                return options;
                            }
                        },
                        batch: true,
                        schema: {
                            data: "Items",
                            total: "TotalCount"
                        },
                        requestEnd: function (e) {
                            console.log("Response Data:", e.response); // Log server response
                        }
                    },
                    scrollable: false,
                    sortable: true,
                    pageable: false,
                    noRecords: true,
                    messages: {
                        noRecords: "No Record Found!"
                    },

                    columns: [
                        { field: "Id", hidden: true, width: 50 },
                        { field: "SalaryAllowanceHeaderId", hidden: true, title: "Salary Allowance Header Id", width: 120 },
                        { field: "PersonnelCategoriesName", title: "Personnel Categories Name", width: 120 },
                        { field: "PersonnelCategoriesId", hidden: true, title: "Personnel Categories Id", width: 120 },
                        { field: "TotalPostSanctioned", title: "Total Post Sanctioned", width: 120 },
                        { field: "ActualPresentStrength", title: "Actual Present Strength", width: 120 },
                        { field: "ExpectedNumber", title: "Expected Number", width: 120 },
                        { field: "BasicWagesSalaries", title: "Basic Wages Salaries", width: 120 },
                        { field: "OtherCash", title: "Other Cash", width: 120 },
                        { field: "TotalSalary", title: "Total Salary", width: 120 },
                        { field: "PersonnelSentForTraining", title: "Personnel Sent For Training", width: 120 }
                    ]
                });
            },
            excel: {
                fileName: `SalaryAllowance_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.xlsx`,
                filterable: true
            },
            pdf: {
                fileName: `SalaryAllowance_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
                allPages: true,
                avoidLink: true,
                filterable: true
            },
            pdfExport: function (e) {

                $(".k-grid-toolbar").hide();
                $(".k-grouping-header").hide();
                $(".k-floatwrap").hide();

                var companyName = "SHAMPAN Budget LTD.";

                var fileName = `SalaryAllowance_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`;

                e.sender.options.pdf = {
                    paperSize: "A4",
                    margin: { top: "4cm", left: "1cm", right: "1cm", bottom: "4cm" },
                    landscape: true,
                    allPages: true,
                    template: `
        <div style="position: absolute; top: 1cm; left: 1cm; right: 1cm; text-align: center; font-size: 12px; font-weight: bold;">
            <div>${companyName}</div>
        </div>`
                };

                e.sender.options.pdf.fileName = fileName;

                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            },
            columns: [

                {

                    title: "Action",
                    width: 45,
                    template: function (dataItem) {
                        console.log(dataItem);
                        return `
                    <a href="/SalaryAllowance/SalaryAllowance/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                        <i class="fas fa-pencil-alt"></i>
                    </a>`;
                    }
                },

                { field: "Id", width: 10, hidden: true, sortable: true },
                { field: "Code", title: 'Code', width: 70, sortable: true },
                { field: "FiscalYear", hidden: true, title: 'FiscalYear', width: 50, sortable: true },
                { field: "BudgetType", title: 'Budget Type', width: 50, sortable: true },
                {
                    field: "TransactionDate", title: "Transaction Date", sortable: true, hidden: true, width: 120, template: '#= kendo.toString(kendo.parseDate(TransactionDate), "yyyy-MM-dd") #',
                    filterable:
                    {
                        ui: "datepicker"
                    }
                },

                {
                    field: "Status", title: "Status", sortable: true, width: 50,
                    filterable: {
                        ui: function (element) {
                            element.kendoDropDownList({
                                dataSource: [
                                    { text: "Yes", value: "1" },
                                    { text: "No", value: "0" }
                                ],
                                dataTextField: "text",
                                dataValueField: "value",
                                optionLabel: "Select Option"
                            });
                        }
                    }
                },


            ],
            editable: false,
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true
        });

    };

    //        columns: [

    //            {
    //                selectable: true,
    //                width: 35
    //            },

    //            {
    //                title: "Action",
    //                width: 80,
    //                sortable: false,
    //                filterable: false,
    //                template: function (dataItem) {
    //                    return `
    //            <a href="/SalaryAllowance/SalaryAllowance/Edit/${dataItem.Id}"
    //               class="btn btn-primary btn-sm edit"
    //               title="Edit">
    //                <i class="fas fa-pencil-alt"></i>
    //            </a>
    //        `;
    //                }
    //            },

    //            { field: "Id", hidden: true },

    //            { field: "Code", title: "Code", width: 120 },

    //            { field: "FiscalYear", title: "Fiscal Year", hidden: true },

    //            { field: "BudgetType", title: "Budget Type", width: 120 },

    //            {
    //                field: "TransactionDate",
    //                title: "Transaction Date",
    //                hidden: true,
    //                width: 140,
    //                template: "#= TransactionDate ? kendo.toString(kendo.parseDate(TransactionDate), 'yyyy-MM-dd') : '' #"
    //            },

    //            {
    //                field: "Status",
    //                title: "Status",
    //                width: 120,
    //                filterable: {
    //                    ui: function (element) {
    //                        element.kendoDropDownList({
    //                            dataSource: [
    //                                { text: "Posted", value: "Posted" },
    //                                { text: "Not Posted", value: "Not Posted" }
    //                            ],
    //                            dataTextField: "text",
    //                            dataValueField: "value",
    //                            optionLabel: "All"
    //                        });
    //                    }
    //                }
    //            }
    //        ],
    //        editable: false,
    //        selectable: "multiple,row",
    //        navigatable: true,
    //        columnMenu: true


    //        });


    //    $("#GridDataList").on("click", ".k-header .k-checkbox", function () {
    //        var isChecked = $(this).is(":checked");
    //        var grid = $("#GridDataList").data("kendoGrid");
    //        if (isChecked) {
    //            grid.tbody.find(".k-checkbox").prop("checked", true);
    //        } else {
    //            grid.tbody.find(".k-checkbox").prop("checked", false);
    //        }
    //    });
    //};


    function save($table) {

        debugger;
        //-
        //var grid = $("#GridDataList").data("kendoGrid");


        var model = serializeInputs("frmEntry");

        if (!hasLine($table)) {
            ShowNotification(3, "Can not save without details.");
            return;
        }

        var details = serializeTable($table);

        //var isValidDetails = true;
        //var errorMessage = "";

        //$(details).each(function (index, row) {
        //    if (!row.ProductId || parseInt(row.ProductId) <= 0) {
        //        isValidDetails = false;
        //        errorMessage = "Product Name is required at row " + (index + 1);
        //        return false;
        //    }

        //});

        //if (!isValidDetails) {
        //    ShowNotification(3, errorMessage);
        //    return;
        //}

        model.IsActive = $('#IsActive').prop('checked');
        model.SalaryAllowanceDetail = details; 

        var url = "/SalaryAllowance/SalaryAllowance/CreateEdit";
        CommonAjaxService.finalSave(url, model, saveDone, saveFail);
    }

    function saveDone(result) {
        if (result.Status == 200) {
            if (result.Data.Operation == "add") {
                ShowNotification(1, result.Message);
                $(".divSave").hide();
                $(".divUpdate").show();
                $(".auditshow").show();
                $("#Code").val(result.Data.Code);
                $("#Id").val(result.Data.Id);
                $("#Operation").val("update");
                $("#CreatedBy").val(result.Data.CreatedBy);
                $("#CreatedOn").val(result.Data.CreatedOn);


            }
            else {
                ShowNotification(1, result.Message);
                $("#LastModifiedBy").val(result.Data.LastModifiedBy);
                $("#LastModifiedOn").val(result.Data.LastModifiedOn);
            }
        }
        else if (result.Status == 400) {
            ShowNotification(3, result.Message);
        }
        else {
            ShowNotification(2, result.Message);
        }
    };

    function saveFail(result) {


        ShowNotification(3, "Enter master data first!");
    };


    function SelectData() {
        var grid = $("#GridDataList").data("kendoGrid");
        var selectedRows = grid.select();

        if (selectedRows.length === 0) {
            ShowNotification(3, "You are requested to Select checkbox!");
            return;
        }

        var unpostedIDs = [];
        var postedItems = [];

        selectedRows.each(function () {
            var dataItem = grid.dataItem(this);
            debugger;

            if (dataItem.Status == "Posted") {
                postedItems.push(dataItem);
            } else {
                unpostedIDs.push(dataItem.Id);
            }
        });
        if (unpostedIDs.length === 0) {
            ShowNotification(3, "All selected data has already been Posted.");
            return;
        }

        var model = { IDs: unpostedIDs };
        var url = "/SalaryAllowance/SalaryAllowance/MultiplePost";

        CommonAjaxService.deleteData(url, model, postDone, saveFail);
    }


    $('.btnPost').on('click', function () { //for create form
        Confirmation("Are you sure? Do You Want to Post Data?",
            function (result) {
                debugger;

                if (result) {
                    var model = serializeInputs("frmEntry");
                    if (model.IsPost == "True") {
                        ShowNotification(3, "Data has already been Posted.");
                    }
                    else {
                        model.IDs = model.Id;
                        var url = "/SalaryAllowance/SalaryAllowance/MultiplePost";
                        CommonAjaxService.multiplePost(url, model, postDone, fail);
                    }
                }
            });
    });


    function postDone(result) {

        var grid = $('#GridDataList').data('kendoGrid');
        if (grid) {
            grid.dataSource.read();
        }
        if (result.Status == 200) {
            ShowNotification(1, result.Message);
            $(".btnsave").show();
            $(".btnPost").show();

        }
        else if (result.Status == 400) {
            ShowNotification(3, result.Message);
        }
        else {
            ShowNotification(2, result.Message);
        }
    };

    function fail(err) {
        console.log(err);
        ShowNotification(3, "Something gone wrong");
    };

    function Visibility(action) {
        $('#frmEntry').find(':input').prop('readonly', action);
        $('#frmEntry').find('table, table *').prop('disabled', action);
        $('#frmEntry').find(':input[type="button"]').prop('disabled', action);
        $('#frmEntry').find(':input[type="checkbox"]').prop('disabled', action);
        $('#frmEntry').find('select').prop('disabled', action);
    };

    return {
        init: init
    }


}(CommonService, CommonAjaxService);

function ReportPreview(id) {

    const form = document.createElement('form');
    form.method = 'post';
    form.action = '/SalaryAllowance/SalaryAllowance/ReportPreview';
    form.target = '_blank';
    const inputVal = document.createElement('input');
    inputVal.type = 'hidden';
    inputVal.name = 'Id';
    inputVal.value = id;

    form.appendChild(inputVal);

    document.body.appendChild(form);

    form.submit();
    form.remove();

};
