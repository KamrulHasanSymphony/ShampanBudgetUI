var ChargeHeaderController = function (CommonService, CommonAjaxService) {

    var getChargeGroup = 0;

    var init = function () {
        debugger;

        decimalPlace = $("#DecimalPlace").val() || 2;
        var getId = $("#Id").val() || 0;
        getChargeGroup = $("#ChargeGroup").val() || 0;
        var getOperation = $("#Operation").val() || '';

        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
            
        };

        GetChargeGroup();

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
                        SelectData();
                    }
                });
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
        //new kendo grid


        var detailsList = JSON.parse($("#detailsListJson").val() || "[]");

        var detailsGridDataSource = new kendo.data.DataSource({
            data: detailsList,
            schema: {
                model: {
                    id: "Id",
                    fields: {
                        Id: { type: "number", defaultValue: 0 },
                        ChargeHeaderId: { type: "number", defaultValue: null },
                        ProductId: { type: "number", defaultValue:0 },
                        CIFCharge: { type: "number", defaultValue: 0 },
                        ExchangeRateUsd: { type: "number", defaultValue:0 },
                        InsuranceRate: { type: "number", defaultValue: 0 },
                        BankCharge: { type: "number", defaultValue: 0 },

                        OceanLoss: { type: "number", defaultValue: 0 },
                        CPACharge: { type: "number", defaultValue: 0 },
                        HandelingCharge: { type: "number", defaultValue: 0 },
                        LightCharge: { type: "number", defaultValue: 0 },
                        Survey: { type: "number", defaultValue: 0 },
                        CostLiterExImport: { type: "number", defaultValue: 0 },

                        ExERLRate: { type: "number", defaultValue: 0 },
                        DutyPerLiter: { type: "number", defaultValue: 0 },
                        Refined: { type: "number", defaultValue: 0 },
                        Crude: { type: "number", defaultValue: 0 },
                        SDRate: { type: "number", defaultValue: 0 },
                        DutyInTariff: { type: "number", defaultValue: 0 },

                        ATRate: { type: "number", defaultValue: 0 },
                        AITRate: { type: "number", defaultValue: 0 },
                        VATRate: { type: "number", defaultValue: 0 },
                        ConversionFactorFixedValue: { type: "number", defaultValue: 0 },
                        VATRateFixed: { type: "number", defaultValue: 0 },
                        RiverDues: { type: "number", defaultValue: 0 },

                        TariffRate: { type: "number", defaultValue: 0 },
                        FobPriceBBL: { type: "number", defaultValue: 0 },
                        FreightUsd: { type: "number", defaultValue: 0 },
                        ServiceCharge: { type: "number", defaultValue: 0 },
                        ProcessFee: { type: "number", defaultValue: 0 },
                        RcoTreatmentFee: { type: "number", defaultValue: 0 },

                        AbpTreatmentFee: { type: "number", defaultValue: 0 },
                        ProcessFeeRate: { type: "number", defaultValue: 0 },
                        RcoTreatmentFeeRate: { type: "number", defaultValue: 0 },
                        AbpTreatmentFeeRate: { type: "number", defaultValue: 0 },
                        ProductImprovementFee: { type: "number", defaultValue: 0 }

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
                    width: 120
                },        
                {
                    field: "CIFCharge",
                    title: "CIF Charge",
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 120
                },
                {
                    field: "ExchangeRateUsd",
                    title: "Exchange Rate Usd",
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 120
                },
                {
                    field: "InsuranceRate",
                    title: "Insurance Rate",
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 120
                },
                {
                    field: "BankCharge",
                    title: "Bank Charge",
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 120

                },
                {
                    field: "OceanLoss",
                    title: "Ocean Loss",
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 120
                },
                {
                    field: "HandelingCharge",
                    title: "Handeling Charge",
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 120
                },
                {
                    field: "LightCharge",
                    title: "Light Charge",
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 120
                },
                {
                    field: "Survey",
                    title: "Survey",
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 120
                },
                {
                    field: "CostLiterExImport",
                    title: "Cost Liter ExImport",
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 120
                },
                {
                    field: "ExERLRate",
                    title: "ExERL Rate",
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 120
                },
                {
                    field: "DutyPerLiter",
                    title: "Duty Per Liter",
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 120
                },
                {
                    field: "Refined",
                    title: "Refined",
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 120
                },
                {
                    field: "Crude",
                    title: "Crude",
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 120
                },
                {
                    field: "SDRate",
                    title: "SD Rate",
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 120
                },
                {
                    field: "DutyInTariff",
                    title: "Duty In Tariff",
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 120
                },
                {
                    field: "ATRate",
                    title: "AT Rate",
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 120
                },
                {
                    field: "AITRate",
                    title: "AIT Rate",
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 120
                },
                {
                    field: "VATRate",
                    title: "VAT Rate",
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 120
                },
                {
                    field: "ConversionFactorFixedValue",
                    title: "Conversion Factor Fixed Value",
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 120
                },
                {
                    field: "VATRateFixed",
                    title: "VAT Rate Fixed",
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 120
                },
                {
                    field: "RiverDues",
                    title: "River Dues",
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 120
                },
                {
                    field: "TariffRate",
                    title: "Tariff Rate",
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 120
                },
                {
                    field: "FobPriceBBL",
                    title: "Fob Price BBL",
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 120
                },
                {
                    field: "FreightUsd",
                    title: "Freight Usd",
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 120
                },
                {
                    field: "ServiceCharge",
                    title: "Service Charge",
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 120
                },
                {
                    field: "ProcessFee",
                    title: "Process Fee",
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 120
                },
                {
                    field: "RcoTreatmentFee",
                    title: "Rco Treatment Fee",
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 120
                },


                {
                    field: "AbpTreatmentFee",
                    title: "Abp Treatment Fee",
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 120
                },
                {
                    field: "ProcessFeeRate",
                    title: "Process Fee Rate",
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 120
                },
                {
                    field: "RcoTreatmentFeeRate",
                    title: "Rco Treatment Fee Rate",
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 120
                },
                {
                    field: "AbpTreatmentFeeRate",
                    title: "Abp Treatment FeeRate",
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 120
                },
                {
                    field: "ProductImprovementFee",
                    title: "Product Improvement Fee",
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
            ]
        });



    };

    function GetChargeGroup() {
        var COAGroupComboBox = $("#ChargeGroup").kendoMultiColumnComboBox({
            dataTextField: "ChargeGroupText",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "ChargeGroupText", title: "Charge Group Text", width: 150 },
            ],
            filter: "contains",
            filterFields: ["ChargeGroupValue", "ChargeGroupText"],
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
                        selectedGridModel.set("ConversionFactor", dataItem.ConversionFactor);

                        var window = $("#ProductWindow").data("kendoWindow");
                        if (window) window.close();
                    }
                });
            }
        });
    }

    var GetGridDataList = function () {

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
                    url: "/SetUp/ChargeHeader/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false,
                    data: {}

                },
                parameterMap: function (options) {
                    if (options.sort) {
                        options.sort.forEach(function (param) {

                            if (param.field === "Id") {
                                param.field = "H.Id";
                            }
                            if (param.field === "ChargeGroup") {
                                param.field = "H.ChargeGroup";
                            }

                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {

                            if (param.field === "Id") {
                                param.field = "H.Id";
                            }
                            if (param.field === "ChargeGroup") {
                                param.field = "H.ChargeGroup";
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
            search: ["ChargeGroup"],

            detailInit: function (e) {

                console.log("Master ID:", e.data);

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
                                url: "/SetUp/ChargeHeader/GetChargeDetailDataById",
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
                        { field: "ChargeHeaderId",hidden:true, title: "Charge Header Id", width: 120 },
                        { field: "ProductName", title: "Product Name", width: 120 },
                        { field: "CIFCharge", title: "CIF Charge", width: 120 },
                        { field: "ExchangeRateUsd", title: "Exchange Rate USD", width: 120 },
                        { field: "InsuranceRate", title: "Insurance Rate", width: 120 },
                        { field: "BankCharge", title: "Bank Charge", width: 120 },
                        { field: "OceanLoss", title: "Ocean Loss", width: 120 },
                        { field: "CPACharge", title: "CPA Charge", width: 120 },
                        { field: "HandelingCharge", title: "Handling Charge", width: 120 },
                        { field: "LightCharge", title: "Light Charge", width: 120 },
                        { field: "Survey", title: "Survey", width: 120 },
                        { field: "CostLiterExImport", title: "Cost Liter Ex Import", width: 120 },
                        { field: "ExERLRate", title: "Ex ERL Rate", width: 120 },
                        { field: "DutyPerLiter", title: "Duty Per Liter", width: 120 },
                        { field: "Refined", title: "Refined", width: 120 },
                        { field: "Crude", title: "Crude", width: 120 },
                        { field: "SDRate", title: "SD Rate", width: 120 },
                        { field: "DutyInTariff", title: "Duty In Tariff", width: 120 },
                        { field: "ATRate", title: "AT Rate", width: 120 },
                        { field: "AITRate", title: "AIT Rate", width: 120 },
                        { field: "VATRate", title: "VAT Rate", width: 120 },
                        { field: "ConversionFactorFixedValue", title: "Conversion Factor", width: 120 },
                        { field: "VATRateFixed", title: "VAT Rate Fixed", width: 120 },
                        { field: "RiverDues", title: "River Dues", width: 120 },

                        { field: "TariffRate", title: "Tariff Rate", width: 120 },
                        { field: "FobPriceBBL", title: "Fob Price BBL", width: 120 },
                        { field: "FreightUsd", title: "Freight Usd", width: 120 },
                        { field: "ServiceCharge", title: "Service Charge", width: 120 },
                        { field: "ProcessFee", title: "Process Fee", width: 120 },
                        { field: "RcoTreatmentFee", title: "Rco Treatment Fee", width: 120 },
                        { field: "AbpTreatmentFee", title: "Abp Treatment Fee", width: 120 }


                    ]
                });
            },
            excel: {
                fileName: `ChargeHeader_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.xlsx`,
                filterable: true
            },
            pdf: {
                fileName: `ChargeHeader_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
                allPages: true,
                avoidLink: true,
                filterable: true
            },
            pdfExport: function (e) {

                $(".k-grid-toolbar").hide();
                $(".k-grouping-header").hide();
                $(".k-floatwrap").hide();

                var companyName = "SHAMPAN Budget LTD.";

                var fileName = `ChargeHeader_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`;

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
                    selectable: true, width: 40
                },

                {

                    title: "Action",
                    width: 50,
                    template: function (dataItem) {
                        console.log(dataItem);
                        return `
                    <a href="/SetUp/ChargeHeader/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                        <i class="fas fa-pencil-alt"></i>
                    </a>`;
                    }
                },

                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "ChargeGroup", width: 750, sortable: true }
  
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
                    ProductId: item.ProductId,
                    ProductName: item.ProductName,
                    CIFCharge: item.CIFCharge,
                    ExchangeRateUsd: item.ExchangeRateUsd,
                    InsuranceRate: item.InsuranceRate,
                    BankCharge: item.BankCharge,

                    OceanLoss: item.OceanLoss,
                    CPACharge: item.CPACharge,
                    HandelingCharge: item.HandelingCharge,
                    LightCharge: item.LightCharge,
                    Survey: item.Survey,

                    CostLiterExImport: item.CostLiterExImport,
                    ExERLRate: item.ExERLRate,
                    DutyPerLiter: item.DutyPerLiter,
                    Refined: item.Refined,
                    Crude: item.Crude,

                    SDRate: item.SDRate,
                    DutyInTariff: item.DutyInTariff,
                    ATRate: item.ATRate,
                    AITRate: item.AITRate,
                    VATRate: item.VATRate,

                    ConversionFactorFixedValue: item.ConversionFactorFixedValue,
                    VATRateFixed: item.VATRateFixed,
                    RiverDues: item.RiverDues,
                    TariffRate: item.TariffRate,
                    FobPriceBBL: item.FobPriceBBL,

                    FreightUsd: item.FreightUsd,
                    ServiceCharge: item.ServiceCharge,
                    ProcessFee: item.ProcessFee,
                    RcoTreatmentFee: item.RcoTreatmentFee,
                    AbpTreatmentFee: item.AbpTreatmentFee,

                    ProcessFeeRate: item.ProcessFeeRate,
                    RcoTreatmentFeeRate: item.RcoTreatmentFeeRate,
                    AbpTreatmentFeeRate: item.AbpTreatmentFeeRate,
                    ProductImprovementFee: item.ProductImprovementFee



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
        model.ChargeDetails = details;

        var url = "/SetUp/ChargeHeader/CreateEdit";
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
                unpostedIDs.push(dataItem.ID);
            }
        });
        if (unpostedIDs.length === 0) {
            ShowNotification(3, "All selected data has already been Posted.");
            return;
        }

        var model = { IDs: unpostedIDs };
        var url = "/SetUp/ChargeHeader/MultiplePost";

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
                        model.IDs = model.ID;
                        var url = "/SetUp/ChargeHeader/MultiplePost";
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
    form.action = '/SetUp/ChargeHeader/ReportPreview';
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
