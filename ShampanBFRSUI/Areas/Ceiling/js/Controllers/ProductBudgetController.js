
var ProductBudgetController = function (CommonService, CommonAjaxService) {

    var init = function () {
        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';
        var getFiscalYearId = $("#GLFiscalYearId").val() || 0;
        var getProductGroupId = $("#ProductGroupId").val() || 0;

        var getTransactionType = $("#TransactionType").val() || '';

        //if (parseInt(getId) == 0 && getOperation == '') {
        //    GetGridDataList(getTransactionType, getMenuType, getBudgetType);
        //}

        //if (parseInt(getFiscalYearId) > 0 && parseInt(getBudgetSetNo) > 0 && getBudgetType !== '') {
        //    GetCeilingDetailsData();
        //};

        $("[data-bootstrap-switch]").bootstrapSwitch();

        GetFiscalYearComboBox();
        ProductGroupComboBox();
       
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

        function ProductGroupComboBox() {
            var ProductGroupComboBox = $("#ProductGroupId").kendoMultiColumnComboBox({
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
                        read: "/Common/Common/GetProductGroupList"
                    }
                },
                placeholder: "Select Product Group",
                value: "",
                dataBound: function (e) {
                    if (getProductGroupId) {
                        this.value(parseInt(getProductGroupId));
                    }
                }
            }).data("kendoMultiColumnComboBox");
        };


        $('#GLFiscalYearId, #ProductGroupId').on('change', validateAndFetchCeilingData);
        function validateAndFetchCeilingData() {

            alert(11111);

            var isValid = true;
            var yearId = $('#GLFiscalYearId').val() || 0;
            var budgetType = $('#ProductGroupId').val() || '';

            if (yearId === 'xx' || parseInt(yearId) <= 0) {
                isValid = false;
                ShowNotification(3, 'Fiscal Year Required.');
            }
            else if (parseInt(budgetType) <= 0) {
                isValid = false;
                ShowNotification(3, 'Product Group Required.');
            }
            
            if (isValid) {
                GetProductBudgetDetailsData();
            }
        };


        $('#details').on('blur', "td", function (e) {
            updateLineTotal($(this));
        });

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

    var GetProductBudgetDetailsData = function () {
        alert(22);
        var yearId = $('#GLFiscalYearId').val() || 0;
        var ProductGroupId = $('#ProductGroupId').val() || 0;

        if (parseInt(yearId) > 0 && parseInt(ProductGroupId) > 0) {
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
                        url: "/Ceiling/ProductBudget/GetProductBudgetDataForDetailsNew",
                        type: "POST",
                        dataType: "json",
                        cache: false,
                        data: { yearId: yearId, ProductGroupId: ProductGroupId }
                    },
                    parameterMap: function (options) {
                        if (options.sort) {
                            options.sort.forEach(function (param) {
                                if (param.field === "ProductCode") {
                                    param.field = "p.Code";
                                }
                                if (param.field === "ProductName") {
                                    param.field = "p.Name";
                                }
                                
                            });
                        }
                        if ((options.filter && options.filter.filters)) {
                            options.filter.filters.forEach(function (param) {

                                if (filter.field === "ProductCode") {
                                    filter.field = "p.Code";
                                }
                                if (filter.field === "ProductName") {
                                    filter.field = "p.Name";
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
                            ProductName: { editable: false },
                            BLQuantityMT: { type: "number", defaultValue: 0, validation: { min: 0 } },
                            
                        }
                    }
                },
                aggregate: [

                    { field: "BLQuantityMT", aggregate: "sum" },
                    
                ]

            });

            $("#ProductBudgetDetailsData").kendoGrid({
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
                    fileName: "ProductBudget Details.xlsx",
                    filterable: true
                },
                save: function (e) {
                    const grid = this;

                    //if (e.values && e.values.InputTotal !== undefined) {

                    //    var dataItem = e.model;
                    //    var perMonth = parseFloat(e.values.InputTotal) / 12;

                       
                    //    dataItem.January = perMonth;
                    //    dataItem.February = perMonth;
                    //    dataItem.March = perMonth;
                    //    dataItem.April = perMonth;
                    //    dataItem.May = perMonth;
                    //    dataItem.June = perMonth;
                    //    dataItem.July = perMonth;
                    //    dataItem.August = perMonth;
                    //    dataItem.September = perMonth;
                    //    dataItem.October = perMonth;
                    //    dataItem.November = perMonth;
                    //    dataItem.December = perMonth;

                    //    //dataItem.set("LineTotal", perMonth * 12);
                    //}
                    setTimeout(function () {
                        grid.dataSource.aggregate();
                        grid.refresh();
                        $('#ProductBudgetDetailsData .k-grid-content').scrollLeft(horizontalScrollLeft);
                        $(e.container).find('input').focus();
                    }, 0);
                },
                columns: [

                    { field: "ProductId", width: 50, hidden: true, sortable: true },
                    { field: "Serial", title: "SL", sortable: true, width: 70, editable: false },
                    { field: "ProductCode", title: "Product Code", sortable: true, width: 170, editable: false },
                    { field: "ProductName", title: "Product Name", sortable: true, width: 170, editable: false },
                    
                    {
                        field: "BLQuantityMT", title: "Input Total", sortable: true, width: 160, aggregates: ["sum"], format: "{0:n2}", groupFooterTemplate: "#=kendo.toString(sum, 'n2')#", attributes: { style: "text-align: right;" }
                        , footerTemplate: function () {

                            var data = $("#ProductBudgetDetailsData").data("kendoGrid").dataSource.view();
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

