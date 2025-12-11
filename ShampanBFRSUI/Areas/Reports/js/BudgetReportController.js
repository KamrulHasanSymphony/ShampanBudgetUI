var BudgetReportController = function (CommonService, CommonAjaxService) {
    debugger;
    var getReportType = $("#ReportType").val() || 0;

    var init = function () {
        var getFiscalYearId = $("#GLFiscalYearId").val() || 0;
        //var getReportType = $("#ReportType").val() || 0;
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


        $('#ReportType').on('change', validateAndFetchCeilingData);
        function validateAndFetchCeilingData() {
            debugger;
            var isValid = true;
            var yearId = $('#GLFiscalYearId').val() || 0;
            //var budgetSetNo = $('#BudgetSetNo').val() || 0;
            //var budgetType = $('#BudgetType').val() || '';
            var ReportType = $('#ReportType').val() || '';

            if (yearId === 'xx' || parseInt(yearId) <= 0) {
                isValid = false;
                ShowNotification(3, 'Fiscal Year Required.');
            }
            //else if (parseInt(budgetSetNo) <= 0) {
            //    isValid = false;
            //    ShowNotification(3, 'Budget Set Required.');
            //}
            //else if (budgetType === 'xx' || budgetType === '') {
            //    isValid = false;
            //    ShowNotification(3, 'Budget Type Required.');
            //}

            if (isValid) {
                GetCeilingDetailsData();
            }
        };

    };

    //End init

    var GetCeilingDetailsData = function () {
        debugger;
        var yearId = $('#GLFiscalYearId').val() || 0;
        //var budgetSetNo = $('#BudgetSetNo').val() || 0;
        var getReportType = $('#BudgetType').val() || '';

        //if (parseInt(yearId) > 0 && parseInt(budgetSetNo) > 0 && budgetType !== '') {
        if (parseInt(yearId) > 0) {
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
                        data: { yearId: yearId, ReportType: ReportType }
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

                columns: [

                    { field: "AccountId", width: 50, hidden: true, sortable: true },
                    { field: "Serial", title: "SL", sortable: true, width: 70, editable: false },
                    { field: "COACode", title: "iBAS Code", sortable: true, width: 170, editable: false },
                    { field: "COAName", title: "iBAS Name", sortable: true, width: 170, editable: false },
                    { field: "AccountCode", title: "Sabre Code", sortable: true, width: 170, editable: false },
                    { field: "AccountName", title: "Sabre Name", width: 320, sortable: true, editable: false },

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

    function GetReportType() {
        debugger;
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
