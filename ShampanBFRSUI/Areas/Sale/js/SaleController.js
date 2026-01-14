var SaleController = function (CommonService, CommonAjaxService) {

    var init = function () {
        debugger;

        decimalPlace = $("#DecimalPlace").val() || 2;
        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';
        getFiscalYearId = $("#FiscalYearId").val() || 0;
        getBudgetType = $("#BudgetType").val() || '';

        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList(getBudgetType);

        };

        GetFiscalYear();
        GenerateDatepicker();

        var IsPost = $('#IsPost').val();
        if (IsPost === 'True') {
            Visibility(true);
        };

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
            '.td-PriceLTR, .td-ConversionFactor, .td-ProductionMT, .td-SalesExImport_LocalMT',
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

            GetGridDataList(getBudgetType);

        });

        //for kendo grid
        var SaleDetail = JSON.parse($("#detailsListJson").val() || "[]");

        var detailsGridDataSource = new kendo.data.DataSource({
            data: SaleDetail,
            schema: {
                model: {
                    id: "Id",
                    fields: {
                        Id: { type: "number", defaultValue: 0 },
                        SaleHeaderId: { type: "number", defaultValue: null },
                        ProductId: { type: "number", defaultValue: 0 },
                        ProductName: { type: "string", defaultValue: ''},
                        ConversionFactor: { type: "number", defaultValue: 0 },
                        ExchangeRateUsd: { type: "number", defaultValue: 0 },
                        ProductionMT: { type: "number", defaultValue: 0 },
                        PriceMT: { type: "number", defaultValue: 0 },
                        PriceLTR: { type: "number", defaultValue: 0 },
                        SalesExERLValue: { type: "number", defaultValue: 0 },
                        HandelingCharge: { type: "number", defaultValue: 0 },
                        SalesExImport_LocalMT: { type: "number", defaultValue: 0 },
                        SalesExImport_LocalValue: { type: "number", defaultValue: 0 },
                        TotalMT: { type: "number", defaultValue: 0 },
                        TotalValueTK_LAC: { type: "number", defaultValue: 0 }                

                    }
                }
            },
            change: function (e) {
                if (e.action === "itemchange") {

                    if (
                        e.field === "PriceLTR" ||
                        e.field === "ProductionMT" ||
                        e.field === "SalesExImport_LocalMT" ||
                        e.field === "ConversionFactor"
                    ) {
                        calculateRow(e.items[0]);
                    }
                }
            },
            aggregate: [
                { field: "Quantity", aggregate: "sum" },
                { field: "UnitPrice", aggregate: "sum" }

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
                    field: "ProductId",
                    title: "Product Name",
                    editor: productSelectorEditor,
                    template: function (dataItem) {
                        return dataItem.ProductName || "";
                    },
                    width: 180
                },

                {
                    field: "ProductionMT",
                    title: "Production MT",
                    format: "{0:n2}",
                    editable: false,
                    attributes: { style: "text-align:right;" },
                    width: 120
                },
                {
                    field: "ConversionFactor",
                    title: "Conversion Factor",
                    editable: false,
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 180
                },
                {
                    field: "PriceMT",
                    title: "Price MT",
                    editable: true,
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                   width: 120
                },
                {
                    field: "PriceLTR",
                    title: "Price LTR",
                    format: "{0:n2}",
                    editable: false,
                    attributes: { style: "text-align:right;" },
                    width: 120
                },
                {
                    field: "SalesExERLValue",
                    title: "Sales ExERL Value",
                    editable: true,
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 180
                },

                {
                    field: "SalesExImport_LocalValue",
                    title: "Sales ExImport_Local Value",
                    format: "{0:n2}",
                    editable: true,
                    attributes: { style: "text-align:right;" },
                    width: 180
                },
                
                
                {
                    field: "SalesExImport_LocalMT",
                    title: "Sales ExImport_Local MT",
                    format: "{0:n2}",
                    editable: false,
                    attributes: { style: "text-align:right;" },
                    width: 180
                },
                
                {
                    field: "TotalMT",
                    title: "Total MT",
                    editable: true,
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 120
                },
                          
                
                {
                    field: "TotalValueTK_LAC",
                    title: "Total Value TK_LAC",
                    editable: true,
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 180
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

    
            ]
        });


    };

    function productSelectorEditor(container, options) {
        debugger;
        var wrapper = $('<div class="input-group input-group-sm full-width">').appendTo(container);

        // Create input (you can bind value if needed)
        $('<input type="text" class="form-control" readonly />')
            .attr("data-bind", "value:ProductName")
            .appendTo(wrapper);

        // Create button inside an addon span eii monir..Monir
        $('<div class="input-group-append">')
            .append(
                $('<button class="btn btn-outline-secondary" type="button">')
                    .append('<i class="fa fa-search"></i>')
                    .on("click", function () {
                        debugger;
                        openProductModal(options.model);
                    })
            )
            .appendTo(wrapper);

        kendo.bind(container, options.model);
    }

    var selectedGridModel = null;
    function openProductModal(gridModel) {
        debugger;
        selectedGridModel = gridModel;

        $("#ProductWindow").kendoWindow({
            title: "Select Product Name ",
            modal: true,
            width: "900px",
            height: "550px",
            visible: false,
            close: function () {
                selectedGridModel = null;
            }
        }).data("kendoWindow").center().open();

        $("#Productgrid").kendoGrid({
            dataSource: {
                transport: {
                    read: {
                        url: "/Common/Common/ProductList",
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

                { field: "Code", title: "Code", width: 150 },
                { field: "Name", title: "Product Name", width: 120 },
                { field: "ConversionFactor", title: "Conversion Factor", width: 200 }
            ],
            dataBound: function () {
                this.tbody.find("tr").on("dblclick", function () {
                    var grid = $("#Productgrid").data("kendoGrid");

                    var dataItem = grid.dataItem(this);
                    debugger;
                    if (dataItem && selectedGridModel) {

                        selectedGridModel.set("ProductId", dataItem.Id);
                        selectedGridModel.set("ProductName", dataItem.Name);
                        //selectedGridModel.set("ConversionFactor", dataItem.ConversionFactor);

                        var window = $("#ProductWindow").data("kendoWindow");
                        if (window) window.close();
                    }
                });
            }
        });
    }


    function computeRowCalculation(cell) {

        var $row = cell.closest("tr");

        var conversionFactor = parseFloat($row.find(".td-ConversionFactor").text().replace(/,/g, '')) || 0;
        var productionMT = parseFloat($row.find(".td-ProductionMT").text().replace(/,/g, '')) || 0;
        var priceLTR = parseFloat($row.find(".td-PriceLTR").text().replace(/,/g, '')) || 0;
        var salesImportMT = parseFloat($row.find(".td-SalesExImport_LocalMT").text().replace(/,/g, '')) || 0;

        debugger;
        var priceMT = priceLTR * conversionFactor;
        var salesExERLValue = priceMT * productionMT;
        var salesExImportLocalValue = salesImportMT * priceMT;
        var totalMT = productionMT + salesImportMT;
        var totalValueTK_LAC = (salesExERLValue + salesExImportLocalValue) / 100000;


        $row.find(".td-PriceMT").text(priceMT.toFixed(decimalPlace));
        $row.find(".td-SalesExERLValue").text(salesExERLValue.toFixed(decimalPlace));
        $row.find(".td-SalesExImport_LocalValue").text(salesExImportLocalValue.toFixed(decimalPlace));
        $row.find(".td-TotalMT").text(totalMT.toFixed(decimalPlace));
        $row.find(".td-TotalValueTK_LAC").text(totalValueTK_LAC.toFixed(decimalPlace));
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
            value: new Date(), // Optional: Set initial date
            format: "yyyy-MM-dd" // Optional: Set the date format
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
        var url = "/Sale/Sale/MultiplePost";

        CommonAjaxService.multiplePost(url, model, postDone, fail);
    };


    
    var GetGridDataList = function (getBudgetType) {
        debugger;
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
                    url: "/Sale/Sale/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false,
                    data: { budgetType: getBudgetType }

                },
                parameterMap: function (options) {
                    if (options.sort) {
                        options.sort.forEach(function (param) {

                            if (param.field === "Code") {
                                param.field = "M.Code";
                            }
                            if (param.field === "YearName") {
                                param.field = "fy.YearName";
                            }
                            if (param.field === "BudgetType") {
                                param.field = "M.BudgetType";
                            }                           

                            if (param.field === "Status") {
                                param.field = "M.IsPost";

                                if (param.value) {
                                    const val = param.value.toString().toLowerCase();

                                    if (val.startsWith("p")) {
                                        param.value = 'Y';
                                    } else if (val.startsWith("n")) {
                                        param.value = 'N';
                                    }
                                }
                            }



                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {

                            if (param.field === "Code") {
                                param.field = "M.Code";
                            }
                            if (param.field === "YearName") {
                                param.field = "fy.YearName";
                            }
                            if (param.field === "BudgetType") {
                                param.field = "M.BudgetType";
                            }
                            //if (param.field === "TransactionDate") {
                            //    param.field = "M.TransactionDate";

                            //    if (param.value) {
                            //        let date = new Date(param.value); // parse it manually

                            //        if (!isNaN(date.getTime())) {
                            //            // Format to 'yyyy-MM-dd'
                            //            let year = date.getFullYear();
                            //            let month = (date.getMonth() + 1).toString().padStart(2, '0');
                            //            let day = date.getDate().toString().padStart(2, '0');
                            //            param.value = `${year}-${month}-${day}`;
                            //        }
                            //    }
                            //}

                            if (param.field === "Status") {
                                param.field = "M.IsPost";

                                if (param.value) {
                                    const val = param.value.toString().toLowerCase();

                                    if (val.startsWith("p")) {
                                        param.value = 'Y';
                                    } else if (val.startsWith("n")) {
                                        param.value = 'N';
                                    }
                                }
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
                    id: "Id",
                    fields: {
                        ConversionFactor: { type: "number", editable: true },
                        PriceLTR: { type: "number", editable: true },
                        ProductionMT: { type: "number", editable: true },                   
                        SalesExImport_LocalMT: { type: "number", editable: true },
                        PriceMT: { type: "number", editable: false },
                        SalesExERLValue: { type: "number", editable: false },
                        SalesExImport_LocalValue: { type: "number", editable: false },
                        TotalMT: { type: "number", editable: false },
                        TotalValueTK_LAC: { type: "number", editable: false }
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
            search: ["Code", "YearName", "BudgetType","Status"],

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
                                url: "/Sale/Sale/GetDetailDataById",
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
                        { field: "SaleHeaderId", hidden: true, title: "Sale Header Id", width: 120 },
                        { field: "ProductName", title: "Product Name", width: 120 },                     
                        { field: "ConversionFactor", title: "Conversion Factor", width: 120 },
                        { field: "ProductionMT", title: "Production MT", width: 120 },
                        { field: "PriceMT", title: "Price MT", width: 120 },
                        { field: "PriceLTR", title: "Price LTR", width: 120 },
                        { field: "SalesExERLValue", title: "Sales Ex ERL Value", width: 120 },
                        { field: "SalesExImport_LocalMT", title: "Sales Ex Import Local MT", width: 120 },
                        { field: "SalesExImport_LocalValue", title: "Sales Ex Import Local Value", width: 120 },
                        { field: "TotalMT", title: "Total MT", width: 120 },
                        { field: "TotalValueTK_LAC", title: "Total Value TK LAC", width: 120 }
                    ]
                });
            },
            excel: {
                fileName: `Sale_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.xlsx`,
                filterable: true
            },
            pdf: {
                fileName: `Sale_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
                allPages: true,
                avoidLink: true,
                filterable: true
            },
            pdfExport: function (e) {

                $(".k-grid-toolbar").hide();
                $(".k-grouping-header").hide();
                $(".k-floatwrap").hide();

                var companyName = "SHAMPAN Budget LTD.";

                var fileName = `Sale_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`;

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

                // Action
                {
                    title: "Action",
                    width: 60,
                    template: function (dataItem) {
                        return `
                <a href="/Sale/Sale/Edit/${dataItem.Id}"
                   class="btn btn-primary btn-sm">
                   <i class="fas fa-pencil-alt"></i>
                </a>`;
                    }
                },


                //{ field: "Id", hidden: true },
                { field: "Code", title: "Code", width: 100 },
                { field: "YearName", title: "Year Name", width: 100 },
                { field: "BudgetType", title: "Budget Type", width: 200 },
                {
                    field: "TransactionDate", hidden: true,
                    title: "Transaction Date",
                    width: 200,
                    template: '#= kendo.toString(kendo.parseDate(TransactionDate), "yyyy-MM-dd") #',
                    filterable: { ui: "datepicker" }
                },
                {
                    field: "Status", title: "Status", sortable: true, width: 130,
                    filterable: {
                        ui: function (element) {
                            element.kendoDropDownList({
                                dataSource: [
                                    { text: "Posted", value: "Y" },
                                    { text: "Not Posted", value: "N" }
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

        var conversionFactor = dataItem.ConversionFactor || 0;
        var priceLTR = dataItem.PriceLTR || 0;
        var productionMT = dataItem.ProductionMT || 0;
        var importMT = dataItem.SalesExImport_LocalMT || 0;

        var priceMT = priceLTR * conversionFactor;
        var salesExERLValue = priceMT * productionMT;
        var salesExImportLocalValue = importMT * priceMT;
        var totalMT = productionMT + importMT;
        var totalValueTK_LAC = (salesExERLValue + salesExImportLocalValue) / 100000;

        dataItem.set("PriceMT", priceMT);
        dataItem.set("SalesExERLValue", salesExERLValue);
        dataItem.set("SalesExImport_LocalValue", salesExImportLocalValue);
        dataItem.set("TotalMT", totalMT);
        dataItem.set("TotalValueTK_LAC", totalValueTK_LAC);
    }


    function save($table) {


        var model = serializeInputs("frmEntry");

        var details = [];
        var grid = $("#kDetails").data("kendoGrid");
        if (grid) {
            var dataItems = grid.dataSource.view();

            for (var i = 0; i < dataItems.length; i++) {
                var item = dataItems[i];

                // You can adjust this to match your server-side view model
                details.push({
                    SaleHeaderId: item.SaleHeaderId,
                    ProductId: item.ProductId,
                    ProductName: item.ProductName,
                    ConversionFactor: item.ConversionFactor,
                    ProductionMT: item.ProductionMT,
                    PriceMT: item.PriceMT,
                    PriceLTR: item.PriceLTR,

                    SalesExERLValue: item.SalesExERLValue,
                    SalesExImport_LocalMT: item.SalesExImport_LocalMT,
                    SalesExImport_LocalValue: item.SalesExImport_LocalValue,
                    TotalMT: item.TotalMT,
                    TotalValueTK_LAC: item.TotalValueTK_LAC

                });
            }
        }


        if (details.length === 0) {
            ShowNotification(3, "Save can not without details");
            return;
        }
        if (item.ProductName === 0 || item.ProductName === undefined || item.ProductName === null || item.ProductName === "") {
            ShowNotification(3, "Product Name is required.");
            return;
        }

        var details = [];
        var grid = $("#kDetails").data("kendoGrid");
        if (grid) {
            var dataItems = grid.dataSource.view();

            for (var i = 0; i < dataItems.length; i++) {
                var item = dataItems[i];

                // You can adjust this to match your server-side view model
                details.push({
                    SaleHeaderId: item.SaleHeaderId,
                    ProductId: item.ProductId,
                    ProductName: item.ProductName,
                    ConversionFactor: item.ConversionFactor,
                    ProductionMT: item.ProductionMT,
                    PriceMT: item.PriceMT,
                    PriceLTR: item.PriceLTR,

                    SalesExERLValue: item.SalesExERLValue,
                    SalesExImport_LocalMT: item.SalesExImport_LocalMT,
                    SalesExImport_LocalValue: item.SalesExImport_LocalValue,
                    TotalMT: item.TotalMT,
                    TotalValueTK_LAC: item.TotalValueTK_LAC

                });
            }
        }


        if (details.length === 0) {
            ShowNotification(3, "Save can not without details");
            return;
        }
        if (item.ProductName === 0 || item.ProductName === undefined || item.ProductName === null || item.ProductName === "") {
            ShowNotification(3, "Product Name is required.");
            return;
        }

        
        model.IsActive = $('#IsActive').prop('checked');
        model.SaleDetail = details; 

        var url = "/Sale/Sale/CreateEdit";
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
        var url = "/Sale/Sale/MultiplePost";

        CommonAjaxService.deleteData(url, model, postDone, saveFail);
    }


    


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
    form.action = '/Sale/Sale/ReportPreview';
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
