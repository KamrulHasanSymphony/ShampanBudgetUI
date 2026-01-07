var SalaryAllowanceController = function (CommonService, CommonAjaxService) {

    var decimalPlace = 2;
    var getFiscalYearId = 0;
    var getBudgetType = '';

    var init = function () {
        debugger;

        decimalPlace = $("#DecimalPlace").val() || 2;
        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';
        getFiscalYearId = $("#FiscalYearId").val() || 0;
        getBudgetType = $("#BudgetType").val() || '';

        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();

        };

        GetFiscalYear();
        //GetBudgetTypeComboBox();
        GenerateDatepicker();


        //$(document).on('click', '.edit-sale-order', function () {
        //    kendo.alert("You can't edit this order because it has already been delivered.");
        //});

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

        $('#btnPost').on('click', function () { 
            debugger;
            Confirmation("Are you sure? Do You Want to Post Data?",
                function (result) {

                    if (result) {
                        SelectDataPost();
                    }
                });
        });

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
                            var url = "/Sale/Sale/MultiplePost";
                            CommonAjaxService.multiplePost(url, model, postDone, fail);
                        }
                    }
                });
        });
       

        $('#details').on('blur',
            '.td-BasicWagesSalaries, .td-OtherCash',
            function () {
                computeRowCalculation($(this));
            }
        );


        $("#indexSearch").on('click', function () {
            var branchId = $("#Branchs").data("kendoMultiColumnComboBox").value();

            const gridElement = $("#GridDataList");
            if (gridElement.data("kendoGrid")) {
                gridElement.data("kendoGrid").destroy();
                gridElement.empty();
            }

            GetGridDataList();

        });


        //for kendo grid

        var SalaryAllowanceDetail = JSON.parse($("#detailsListJson").val() || "[]");

        var detailsGridDataSource = new kendo.data.DataSource({
            data: SalaryAllowanceDetail,
            schema: {
                model: {
                    id: "Id",
                    fields: {
                        Id: { type: "number", defaultValue: 0 },
                        SalaryAllowanceHeaderId: { type: "number", defaultValue: null },
                        PersonnelCategoriesId: { type: "number", defaultValue: 0 },
                        CategoryOfPersonnel: { type: "string", defaultValue: "" },          
                        TotalPostSanctioned: { type: "number", defaultValue: 0 },
                        ActualPresentStrength: { type: "number", defaultValue: 0 },
                        ExpectedNumber: { type: "number", defaultValue: 0 },
                        BasicWagesSalaries: { type: "number", defaultValue: 0 },
                        OtherCash: { type: "number", defaultValue: 0 },
                        TotalSalary: { type: "number", defaultValue: 0 },
                        SalesExERLValue: { type: "number", defaultValue: 0 },
                        PersonnelSentForTraining: { type: "number", defaultValue: 0 }
                      
                    }
                }
            },
            change: function (e) {
                if (e.action === "CategoryOfPersonnel") {

                    if (
                        e.field === "BasicWagesSalaries" ||
                        e.field === "OtherCash" ||
                        e.field === "TotalSalary" 
                    ) {
                        calculateRow(e.items[0]);
                    }
                }
            },
            aggregate: [
                { field: "BasicWagesSalaries", aggregate: "sum" },
                { field: "OtherCash", aggregate: "sum" },
                { field: "TotalSalary", aggregate: "sum" }

            ]
        });

        var rowNumber = 0;
        $("#kDetails").kendoGrid({
            dataSource: detailsGridDataSource,
            toolbar: [{ name: "create", text: "Add" }],
            editable: {
                mode: "incell",
                createAt: "bottom"
            },
            save: function (e) {
                const grid = this;
                setTimeout(function () {
                    grid.dataSource.aggregate();
                    grid.refresh();
                }, 0);
            },
            columns: [
                {
                    title: "Sl No",
                    width: 60,
                    template: function (dataItem) {
                        var grid = $("#kDetails").data("kendoGrid");
                        return grid.dataSource.indexOf(dataItem) + 1;
                    }
                },
                {
                    field: "PersonnelCategoriesId",
                    title: "Personnel Categories",
                    editor: PersonnelCategoriesSelectorEditor,
                    template: function (dataItem) {
                        return dataItem.CategoryOfPersonnel || "";
                    },
                    width: 120
                },
                
                {
                    field: "ActualPresentStrength",
                    title: "Actual Present Strength",
                    format: "{0:n2}",

                    attributes: { style: "text-align:right;" },
                    width: 120
                },
                {
                    field: "TotalPostSanctioned",
                    title: "Total Post Sanctioned",
                    format: "{0:n2}",

                    attributes: { style: "text-align:right;" },
                    width: 120
                },
                {
                    field: "ExpectedNumber",
                    title: "Expected Number",
                    editable: false,
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 120
                },
                {
                    field: "BasicWagesSalaries",
                    title: "Basic Wages Salaries",
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    footerTemplate: "<div style='text-align:right;font-weight:bold'>#= kendo.toString(sum, 'n2') #</div>",
                    width: 120
                },
                {
                    field: "OtherCash",
                    title: "Other Cash",
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    footerTemplate: "<div style='text-align:right;font-weight:bold'>#= kendo.toString(sum, 'n2') #</div>",
                    width: 120
                },
                {
                    field: "TotalSalary",
                    title: "Total Salary",
                    editable: true,
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    template: function (dataItem) {
                        var total = (dataItem.BasicWagesSalaries || 0) + (dataItem.OtherCash || 0);
                        return kendo.toString(total, "n2");
                    },
                    footerTemplate: function () {
                        var grid = $("#kDetails").data("kendoGrid");
                        var data = grid.dataSource.view(); // visible data (page) or use .data() for all
                        var sum = 0;
                        for (var i = 0; i < data.length; i++) {
                            sum += (data[i].BasicWagesSalaries || 0) + (data[i].OtherCash || 0);
                        }
                        return "<div style='text-align:right;font-weight:bold'>" + kendo.toString(sum, "n2") + "</div>";
                    },
                    width: 120
                },


                {
                    field: "PersonnelSentForTraining",
                    title: "Personnel Sent For Training",
                    editable: false,
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 120
                },
           
                {
                    command: [{
                        name: "destroy",
                        iconClass: "k-icon k-i-trash",
                        text: ""
                    }],
                    title: "&nbsp;",
                    width: 35
                }


            ],
        });


    };


    function PersonnelCategoriesSelectorEditor(container, options) {
        debugger;
        var wrapper = $('<div class="input-group input-group-sm full-width">').appendTo(container);

        // Create input (you can bind value if needed)
        $('<input type="text" class="form-control" readonly />')
            .attr("data-bind", "value:CategoryOfPersonnel")
            .appendTo(wrapper);

        // Create button inside an addon span eii monir..Monir
        $('<div class="input-group-append">')
            .append(
                $('<button class="btn btn-outline-secondary" type="button">')
                    .append('<i class="fa fa-search"></i>')
                    .on("click", function () {
                        debugger;
                        openPersonnelCategoriesModal(options.model);
                    })
            )
            .appendTo(wrapper);

        kendo.bind(container, options.model);
    }

    var selectedGridModel = null;

    function openPersonnelCategoriesModal(gridModel) {
        debugger;
        selectedGridModel = gridModel;

        $("#PersonnelCategoriesWindow").kendoWindow({
            title: "Select Personnel Categories Name ",
            modal: true,
            width: "900px",
            height: "550px",
            visible: false,
            close: function () {
                selectedGridModel = null;
            }
        }).data("kendoWindow").center().open();

        $("#PersonnelCategoriesgrid").kendoGrid({
            dataSource: {
                transport: {
                    read: {
                        url: "/Common/Common/PersonnelCategoriesList",
                        dataType: "json"
                    }
                },
                pageSize: 10
            },
            pageable: true,
            filterable: true,
            selectable: "row",
            toolbar: ["search"],
            searchable: true,
            columns: [
                { field: "Id", title: "Id", hidden: true, width: 60 },
                { field: "SL", title: "SL", width: 60 },
                { field: "CategoryOfPersonnel", title: "Category Of Personnel", width: 180 }
            
            ],
            dataBound: function () {
                this.tbody.find("tr").on("dblclick", function () {
                    var grid = $("#PersonnelCategoriesgrid").data("kendoGrid");
 

                    var dataItem = grid.dataItem(this);
                    debugger;
                    if (dataItem && selectedGridModel) {

                        selectedGridModel.set("PersonnelCategoriesId", dataItem.Id);
                        selectedGridModel.set("SL", dataItem.SL);
                        selectedGridModel.set("CategoryOfPersonnel", dataItem.CategoryOfPersonnel);
                        var window = $("#PersonnelCategoriesWindow").data("kendoWindow");
                        if (window) window.close();
                    }
                });
            }
        });
    }

    function computeRowCalculation(cell) {

        var $row = cell.closest("tr");

        var BasicWagesSalaries = parseFloat($row.find(".td-BasicWagesSalaries").text().replace(/,/g, '')) || 0;
        var otherCash = parseFloat($row.find(".td-otherCash").text().replace(/,/g, '')) || 0;

   
        var TotalSalary = BasicWagesSalaries + otherCash;

        $row.find(".td-PriceMT").text(BasicWagesSalaries.toFixed(decimalPlace));
        $row.find(".td-SalesExERLValue").text(otherCash.toFixed(decimalPlace));

    }
 
   
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
            value: new Date(), 
            format: "yyyy-MM-dd" 
        });
    }

    function SelectDataPost() {


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
        var filteredData = [];
        var dataSource = $("#GridDataList").data("kendoGrid").dataSource;
        var rowData = dataSource.view().filter(x => IDs.includes(x.Id));
        filteredData = rowData.filter(x => x.IsPost == true && IDs.includes(x.Id));

        if (filteredData.length > 0) {
            ShowNotification(3, "Data has already been Posted.");
            return;
        }
        var url = "/SalaryAllowance/SalaryAllowance/MultiplePost";

        CommonAjaxService.multiplePost(url, model, postDone, fail);
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


            schema: {
                data: "Items",
                total: "TotalCount",
                model: {
                    id: "Id",
                    fields: {
                        TotalPostSanctioned: { type: "number", editable: true },
                        ActualPresentStrength: { type: "number", editable: true },
                        ExpectedNumber: { type: "number", editable: true },
                        BasicWagesSalaries: { type: "number", editable: false },
                        OtherCash: { type: "number", editable: false },
                        TotalSalary: { type: "number", editable: false },
                        PersonnelSentForTraining: { type: "number", editable: false }

                    }
                }
            },
            change: function (e) {
                if (e.action === "itemchange") {
                    calculateRow(e.items[0]);
                }
            },
            editable: true
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
                    width: 30,
                    template: function (dataItem) {
                        console.log(dataItem);
                        return `
                    <a href="/SalaryAllowance/SalaryAllowance/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                        <i class="fas fa-pencil-alt"></i>
                    </a>`;
                    }
                },

                { field: "Id", width: 10, hidden: true, sortable: true },
                { field: "Code", title: 'Code', width: 45, sortable: true },
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

        $("#GridDataList").on("click", ".k-header .k-checkbox", function () {
            var isChecked = $(this).is(":checked");
            var grid = $("#GridDataList").data("kendoGrid");
            if (isChecked) {
                grid.tbody.find(".k-checkbox").prop("checked", true);
            } else {
                grid.tbody.find(".k-checkbox").prop("checked", false);
            }
        }); 

    };
    function calculateRow(dataItem) {

        var basicWagesSalaries = dataItem.BasicWagesSalaries || 0;
        var otherCash = dataItem.OtherCash || 0;
        var totalSalary = otherCash + basicWagesSalaries;
        
        dataItem.set("TotalSalary", totalSalary);
        
        
    }


    function save($table) {

        debugger;

        var model = serializeInputs("frmEntry");


        var details = [];
        var grid = $("#kDetails").data("kendoGrid");
        if (grid) {
            var dataItems = grid.dataSource.view();

            for (var i = 0; i < dataItems.length; i++) {
                var item = dataItems[i];
                calculateRow(item);
                // You can adjust this to match your server-side view model
                details.push({
                    SalaryAllowanceHeaderId: item.get("SalaryAllowanceHeaderId"),
                    PersonnelCategoriesId: item.get("PersonnelCategoriesId"),
                    PersonnelCategoriesName: item.get("CategoryOfPersonnel"),
                    TotalPostSanctioned: item.get("TotalPostSanctioned"),
                    ActualPresentStrength: item.get("ActualPresentStrength"),
                    ExpectedNumber: item.get("ExpectedNumber"),
                    BasicWagesSalaries: item.get("BasicWagesSalaries"),
                    OtherCash: item.get("OtherCash"),
                    TotalSalary: item.get("TotalSalary"),
                    PersonnelSentForTraining: item.get("PersonnelSentForTraining")
                });
            }
        }

        console.log(details);

        if (details.length === 0) {
            ShowNotification(3, "Save can not without details");
            return;
        }
        if (item.CategoryOfPersonnel === 0 || item.CategoryOfPersonnel === undefined || item.CategoryOfPersonnel === null || item.CategoryOfPersonnel === "") {
            ShowNotification(3, "PersonnelCategories Name is required.");
            return;
        }
        var details = [];
        console.log(details);
        var grid = $("#kDetails").data("kendoGrid");
        if (grid) {
            var dataItems = grid.dataSource.view();

            for (var i = 0; i < dataItems.length; i++) {
                var item = dataItems[i];
                calculateRow(item);
                // You can adjust this to match your server-side view model
                details.push({
                    SalaryAllowanceHeaderId: item.get("SalaryAllowanceHeaderId"),
                    PersonnelCategoriesId: item.get("PersonnelCategoriesId"),
                    PersonnelCategoriesName: item.get("CategoryOfPersonnel"),
                    TotalPostSanctioned: item.get("TotalPostSanctioned"),
                    ActualPresentStrength: item.get("ActualPresentStrength"),
                    ExpectedNumber: item.get("ExpectedNumber"),
                    BasicWagesSalaries: item.get("BasicWagesSalaries"),
                    OtherCash: item.get("OtherCash"),
                    TotalSalary: item.get("TotalSalary"),
                    PersonnelSentForTraining: item.get("PersonnelSentForTraining")
                });
            }
        }
        if (details.length === 0) {
            ShowNotification(3, "Save can not without details");
            return;
        }
        if (item.ProductName === 0 || item.CategoryOfPersonnel === undefined || item.CategoryOfPersonnel === null || item.CategoryOfPersonnel === "") {
            ShowNotification(3, "Personnel Categories Name  is required.");
            return;
        }

        console.log(details);
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
