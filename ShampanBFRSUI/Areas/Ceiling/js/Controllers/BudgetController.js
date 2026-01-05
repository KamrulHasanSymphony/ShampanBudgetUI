
var BudgetController = function (CommonService, CommonAjaxService) {

    var getBudgetType = 0;
    var getTransactionType = '';


    var init = function () {
        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';
        getFiscalYearId = $("#FiscalYearId").val() || 0;
        getBudgetType = $("#BudgetType").val() || 0;
        getTransactionType = $("#TransactionType").val() || '';

        GetFiscalYearComboBox();
        //if (parseInt(getFiscalYearId) != 0 && getOperation != '') {
        //    validateAndFetchBudgetData();
        //}

        if (parseInt(getId) == 0 && getBudgetType != '') {

            GetGridDataList(getTransactionType, getBudgetType);
        }

        if (getOperation == 'update') {
            GetEditGridDataList();
        }

        console.log(getFiscalYearId);
        $("[data-bootstrap-switch]").bootstrapSwitch();
        debugger;

        

        // Save button click handler
        $('.btnsave').click('click', function () {
            debugger;
            var getId = $('#Id').val();
            var status = "Save";
            if (parseInt(getId) > 0) {
                status = "Update";
            }
            
            Confirmation("Are you sure? Do You Want to " + status + " Data?", function (result) {
                if (result) {
                    debugger;
                    save();
                }
            });
        });

        $('.btnLoad').click('click', function () {
            validateAndFetchBudgetData();
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

        $('#btnPost').on('click', function () {
            debugger;

            Confirmation("Are you sure? Do You Want to Post Data?",
                function (result) {
                    if (result) {
                        debugger;
                        SelectDataPost();
                    }
                });
        });

        $('.btnPost').on('click', function () {

            Confirmation("Are you sure? Do You Want to Post Data?",
                function (result) {

                    if (result) {
                        var model = serializeInputs("frmEntry");
                        if (model.IsPost == "True") {
                            ShowNotification(3, "Data has already been Posted.");
                        }
                        else {
                            model.IDs = model.Id;
                            var url = "/Ceiling/Budget/MultiplePost";
                            CommonAjaxService.multiplePost(url, model, postDone, fail);
                        }
                    }
                });
        });



        function GetFiscalYearComboBox() {
            debugger;
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
        

   

        function validateAndFetchBudgetData() {

            GetBudgetDetailsData();

            
        };


        $('#details').on('blur', "td", function (e) {
            updateLineTotal($(this));
        });
      

    };

    function SelectDataPost() {
        debugger;

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
        var url = "/Ceiling/Budget/MultiplePost";

        CommonAjaxService.multiplePost(url, model, postDone, fail);
    };


    var GetGridDataList = function (getTransactionType, getBudgetType) {
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
                    url: "/Ceiling/Budget/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false,
                    data: { TransactionType: getTransactionType, BudgetType: getBudgetType }
                },
                parameterMap: function (options) {
                    if (options.sort) {
                        options.sort.forEach(function (param) {
                            if (param.field === "SabreId") {
                                param.field = "Sabres.Id";
                            }
                            if (param.field === "iBASCode") {
                                param.field = "COAs.Code";
                            }
                            if (param.field === "iBASName") {
                                param.field = "COAs.Name";
                            }
                            if (param.field === "SabreCode") {
                                param.field = "Sabres.Code";
                            }
                            if (param.field === "SabreName") {
                                param.field = "Sabres.[Name]";
                            }
                            //if (param.field === "BudgetSetNo") {
                            //    param.field = "c.BudgetSetNo";
                            //}
                            //if (param.field === "TransactionDate") {
                            //    param.field = "c.TransactionDate";
                            //}
                            //if (param.field === "IsActive") {
                            //    let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";
                            //    if (statusValue.startsWith("a")) {
                            //        param.value = 1;
                            //    } else if (statusValue.startsWith("i")) {
                            //        param.value = 0;
                            //    } else {
                            //        param.value = null;
                            //    }
                            //    param.field = "c.IsActive";
                            //    param.operator = "eq";
                            //}
                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {
                            if (param.field === "SabreId") {
                                param.field = "Sabres.Id";
                            }
                            if (param.field === "iBASCode") {
                                param.field = "COAs.Code";
                            }
                            if (param.field === "iBASName") {
                                param.field = "COAs.Name";
                            }
                            if (param.field === "SabreCode") {
                                param.field = "Sabres.Code";
                            }
                            if (param.field === "SabreName") {
                                param.field = "Sabres.[Name]";
                            }
                            //if (param.field === "BudgetSetNo") {
                            //    param.field = "c.BudgetSetNo";
                            //}
                            //if (param.field === "TransactionDate") {
                            //    param.field = "c.TransactionDate";
                            //}
                            //if (param.field === "IsActive") {
                            //    let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                            //    if (statusValue.startsWith("a")) {
                            //        param.value = 1;
                            //    } else if (statusValue.startsWith("i")) {
                            //        param.value = 0;
                            //    } else {
                            //        param.value = null;
                            //    }

                            //    param.field = "c.IsActive";
                            //    param.operator = "eq";
                            //}
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
                                url: "/Ceiling/Budget/GetDetailDataById",
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
                        { field: "Id", hidden: true, sortable: true, width: 50 },
                        { field: "iBASCode", title: "iBAS Code", sortable: true, width: 150 },
                        { field: "iBASName", title: "iBAS Name", sortable: true, width: 150 },
                        { field: "SabreCode", title: "Sabre Code", sortable: true, width: 150 },
                        { field: "SabreName", title: "Sabre Name", sortable: true, width: 200 },
                        { field: "InputTotal", title: "Input Total", sortable: true, width: 120, format: "{0:n2}" }
                    ]
                });
            },
            excel: {
                fileName: "Budgets.xlsx",
                filterable: true
            },
            pdf: {
                fileName: `Budgets_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.pdf`,
                allPages: true,
                avoidLink: true,
                filterable: true
            },
            pdfExport: function (e) {
                $(".k-grid-toolbar").hide();
                $(".k-grouping-header").hide();
                $(".k-floatwrap").hide();

                var companyName = "Shampan BFRS System.";
                var fileName = `Budgets_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.pdf`;

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
                    selectable: true, width: 40
                },

                {
                    title: "Action",
                    width: 60,
                    template: function (dataItem) {
                        return `
        <a href="/Ceiling/Budget/Edit?id=${dataItem.Id}"
           class="btn btn-primary btn-sm mr-2 edit">
            <i class="fas fa-pencil-alt"></i>
        </a>`;
                    }
                },
                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "Code", title: "Code", sortable: true, width: 200 },
                { field: "BudgetType", title: "Budget Type", sortable: true, width: 200 },
                /*{ field: "IsPost", title: "Post", sortable: true, width: 200 }*/
                {
                    field: "Status",
                    title: "Status",
                    width: 100,
                    filterable: {
                        ui: function (element) {
                            element.kendoDropDownList({
                                dataSource: [
                                    { text: "Yes", value: "1" },
                                    { text: "No", value: "0" }
                                ],
                                dataTextField: "text",
                                dataValueField: "value",
                                optionLabel: "Select"
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

    var GetEditGridDataList = function () {
        // Parse the local JSON data
        debugger;
        var detailsList = JSON.parse($("#detailsListJson").val() || "[]");

        var gridDataSource = new kendo.data.DataSource({
            data: detailsList,
            pageSize: 10,
            schema: {
                model: {
                    id: "Id",
                    fields: {
                        InputTotal: { type: "number" }
                    }
                }
            },
            aggregate: [
                { field: "InputTotal", aggregate: "sum" }
            ],
            change: function (e) {
                if (e.action === "itemchange" && e.field === "InputTotal") {
                    // Recalculate aggregates
                    this.fetch();
                }
            }
        });

        $("#updtBudgetDetailsData").kendoGrid({
            dataSource: gridDataSource,
            pageable: {
                refresh: true,
                pageSizes: [10, 20, 50, "all"]
            },
            noRecords: true,
            messages: { noRecords: "No Record Found!" },
            scrollable: true,
            filterable: true,
            sortable: true,
            resizable: true,
            reorderable: true,
            groupable: true,
            toolbar: ["excel", "pdf", "search"],
            columns: [
                { field: "Id", width: 50, hidden: true },
                { field: "iBASCode", title: "iBAS Code", width: 200, editable: true },
                { field: "iBASName", title: "iBAS Name", width: 200, editable: true },
                { field: "SabreCode", title: "Sabre Code", width: 200, editable: true },
                { field: "SabreName", title: "Sabre Name", width: 200, editable: true },
                {
                    field: "InputTotal",
                    title: "Input Total",
                    width: 200,
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    footerTemplate: "<div style='text-align:right;font-weight:bold'>#= kendo.toString(sum, 'n2') #</div>",
                    editor: numericEditor
                    //editable: false
                },
                { field: "BudgetHeaderId", width: 50, hidden: true, editable: true },
                { field: "SabreId", width: 50, hidden: true, editable: true },
                { field: "M1", width: 50, hidden: true, editable: true },
                { field: "M2", width: 50, hidden: true, editable: true },
                { field: "M3", width: 50, hidden: true, editable: true },
                { field: "M4", width: 50, hidden: true, editable: true },
                { field: "M5", width: 50, hidden: true, editable: true },
                { field: "M6", width: 50, hidden: true, editable: true },
                { field: "M7", width: 50, hidden: true, editable: true },
                { field: "M8", width: 50, hidden: true, editable: true },
                { field: "M9", width: 50, hidden: true, editable: true },
                { field: "M10", width: 50, hidden: true, editable: true },
                { field: "M11", width: 50, hidden: true, editable: true },
                { field: "M12", width: 50, hidden: true, editable: true },
                { field: "Q1", width: 50, hidden: true, editable: true },
                { field: "Q2", width: 50, hidden: true, editable: true },
                { field: "Q3", width: 50, hidden: true, editable: true },
                { field: "Q4", width: 50, hidden: true, editable: true },
                { field: "H1", width: 50, hidden: true, editable: true },
                { field: "H2", width: 50, hidden: true, editable: true },
                { field: "Yearly", width: 50, hidden: true, editable: true }
            ],
            editable: "incell",
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true
        });
        function numericEditor(container, options) {
            $('<input name="' + options.field + '" />')
                .appendTo(container)
                .kendoNumericTextBox({
                    format: "n2",
                    decimals: 2,
                    change: function (e) {
                        // Trigger DataSource change to recalc aggregates
                        gridDataSource.fetch();
                    }
                });
        }
       
    };

    // Save the form data
    function save() {
        debugger;

        var validator = $("#frmEntry").validate();
        var formData = new FormData();
        var model = serializeInputs("frmEntry");
        if (model.IsPost == 'True') {
            ShowNotification(2, "Post operation is already done, Do not update this entry");
            return;
        }
        
        //var isActiveValue = $('#IsActive').prop('checked');
        //model.IsActive = isActiveValue;

        //var result = validator.form();

        //if (!result) {
        //    if (!result) {
        //        validator.focusInvalid();
        //    }
        //    return;
        //}
        var operation = $("#Operation").val();
        var DetailList = [];
        if (operation == 'update') {
            var grid = $("#updtBudgetDetailsData").data("kendoGrid");

            debugger;
            if (grid) {

                var items = grid.dataSource.view();

                items.forEach(function (x, index) {

                    DetailList.push({
                        SabreId: x.SabreId,
                        InputTotal: x.InputTotal,
                        M1: 0,
                        M2: 0,
                        M3: 0,
                        M4: 0,
                        M5: 0,
                        M6: 0,
                        M7: 0,
                        M8: 0,
                        M9: 0,
                        M10: 0,
                        M11: 0,
                        M12: 0,
                        Q1: 0,
                        Q2: 0,
                        Q3: 0,
                        Q4: 0,
                        H1: 0,
                        H2: 0,
                        Yearly: x.InputTotal,
                        IsPost: false,

                    });

                });
            }
        }
        else
        {
            var grid = $("#BudgetDetailsData").data("kendoGrid");

            debugger;
            if (grid) {

                var items = grid.dataSource.view();

                items.forEach(function (x, index) {

                    DetailList.push({
                        SabreId: x.SabreId,
                        InputTotal: x.InputTotal,
                        M1: 0,
                        M2: 0,
                        M3: 0,
                        M4: 0,
                        M5: 0,
                        M6: 0,
                        M7: 0,
                        M8: 0,
                        M9: 0,
                        M10: 0,
                        M11: 0,
                        M12: 0,
                        Q1: 0,
                        Q2: 0,
                        Q3: 0,
                        Q4: 0,
                        H1: 0,
                        H2: 0,
                        Yearly: x.InputTotal,
                        IsPost: false,

                    });

                });
            }
        }
        

        if (DetailList.length === 0) {
            ShowNotification(3, "At least one item is required.");
            return;
        }

        model.DetailList = DetailList;



        var url = "/Ceiling/Budget/CreateEdit";
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
    function postDone(result) {

        var grid = $('#GridDataList').data('kendoGrid');
        if (grid) {
            grid.dataSource.read();
        }
        if (result.Status == 200) {
            ShowNotification(1, result.Message);
            $(".btnsave").hide();
            $(".btnPost").hide();
            $(".sslPush").show();
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
    

    var GetBudgetDetailsData = function () {
        var yearId = $('#FiscalYearId').val() || 0;
        var BudgetType = $('#BudgetType').val() || '';

        if (BudgetType != "") {
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
                        url: "/Ceiling/Budget/GetBudgetDataForDetailsNew",
                        type: "POST",
                        dataType: "json",
                        cache: false,
                        data: { yearId: yearId, BudgetType: BudgetType }
                    },
                    parameterMap: function (options) {
                        if (options.sort) {
                            options.sort.forEach(function (param) {
                                if (param.field === "SabreId") {
                                    param.field = "Sabres.Id";
                                }
                                if (param.field === "iBASCode") {
                                    param.field = "COAs.Code";
                                }
                                if (param.field === "iBASName") {
                                    param.field = "COAs.Name";
                                }
                                if (param.field === "SabreCode") {
                                    param.field = "Sabres.Code";
                                }
                                if (param.field === "SabreName") {
                                    param.field = "Sabres.[Name]";
                                }

                            });
                        }
                        if ((options.filter && options.filter.filters)) {
                            options.filter.filters.forEach(function (param) {

                                if (param.field === "SabreId") {
                                    param.field = "Sabres.Id";
                                }
                                if (param.field === "iBASCode") {
                                    param.field = "COAs.Code";
                                }
                                if (param.field === "iBASName") {
                                    param.field = "COAs.Name";
                                }
                                if (param.field === "SabreCode") {
                                    param.field = "Sabres.Code";
                                }
                                if (param.field === "SabreName") {
                                    param.field = "Sabres.[Name]";
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
                            ProductCode: { editable: false },
                            ProductCode: { editable: false },
                            BLQuantityMT: { type: "number", defaultValue: 0, validation: { min: 0 } },
                            InputTotal: { type: "number", defaultValue: 0, validation: { min: 0 } },

                        }
                    }
                },
                aggregate: [

                    { field: "BLQuantityMT", aggregate: "sum" },
                    { field: "InputTotal", aggregate: "sum" },

                ]

            });

            $("#BudgetDetailsData").kendoGrid({
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
                    fileName: "Budget Details.xlsx",
                    filterable: true
                },
                save: function (e) {
                    const grid = this;

                    setTimeout(function () {
                        grid.dataSource.aggregate();
                        grid.refresh();
                        $('#BudgetDetailsData .k-grid-content').scrollLeft(horizontalScrollLeft);
                        $(e.container).find('input').focus();
                    }, 0);
                },
                columns: [

                    { field: "Serial", title: "SL", sortable: true, width: 60, editable: false },  
                    { field: "SabreId", hidden:true, sortable: true, width: 60, editable: false },  
                    { field: "iBASCode", title: "iBAS Code", sortable: true, width: 170, editable: false },
                    { field: "iBASName", title: "iBAS Name", sortable: true, width: 170, editable: false },
                    { field: "SabreCode", title: "Sabre Code", sortable: true, width: 170, editable: false },
                    { field: "SabreName", title: "Sabre Name", sortable: true, width: 170, editable: false },

                    {
                        field: "InputTotal", title: "Input Value", sortable: true, width: 160, aggregates: ["sum"], format: "{0:n2}", groupFooterTemplate: "#=kendo.toString(sum, 'n2')#", attributes: { style: "text-align: right;" }
                        , footerTemplate: function () {

                            var data = $("#BudgetDetailsData").data("kendoGrid").dataSource.view();
                            var sum = 0;
                            for (var i = 0; i < data.length; i++) {
                                sum += (data[i].InputTotal || 0);
                            }
                            return kendo.toString(sum, "n2");
                        }
                    },

                ],
                footer: true,
                selectable: "row",
                navigatable: true,
                columnMenu: true
            });

            let horizontalScrollLeft = 0;
            $('#BudgetDetailsData .k-grid-content').on('scroll', function () {
                horizontalScrollLeft = $(this).scrollLeft();
            });
        }
        else {
            ShowNotification(3, 'Please Fillup Required Fields.');
        }

    };

    return {
        init: init
    }
}(CommonService, CommonAjaxService);

