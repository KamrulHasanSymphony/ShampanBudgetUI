
var BudgetController = function (CommonService, CommonAjaxService) {

    var getFiscalYearId = 0;
    var getBudgetType = 0;
    var getTransactionType = '';


    var init = function () {
        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';
        getFiscalYearId = $("#FiscalYearId").val() || 0;
        getBudgetType = $("#BudgetType").val() || 0;
        getTransactionType = $("#TransactionType").val() || '';


        if (parseInt(getFiscalYearId) != 0 && getOperation != '') {
            validateAndFetchBudgetData();
        }

        if (parseInt(getId) == 0 && getBudgetType != '') {

            GetGridDataList(getTransactionType, getBudgetType);
        }

        $("[data-bootstrap-switch]").bootstrapSwitch();
        debugger;
        GetFiscalYearComboBox();

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

       

        function validateAndFetchBudgetData() {

            GetBudgetDetailsData();

            
        };


        $('#details').on('blur', "td", function (e) {
            updateLineTotal($(this));
        });
      

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
                    title: "Action",
                    width: 60,
                    template: function (dataItem) {
                        return `
        <a href="/Ceiling/Budget/Edit?yearId=${dataItem.GLFiscalYearId}&budgetType=${dataItem.BudgetType}&branchId=${dataItem.BranchId}"
           class="btn btn-primary btn-sm mr-2 edit">
            <i class="fas fa-pencil-alt"></i>
        </a>`;
                    }
                },
                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "Code", title: "iBASCode", sortable: true, width: 200 },
                { field: "Name", title: "iBASName", sortable: true, width: 200 },
                { field: "Code", title: "SabreCode", sortable: true, width: 200 },
                { field: "Name", title: "SabreName", sortable: true, width: 200 }

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

        //var isActiveValue = $('#IsActive').prop('checked');
        //model.IsActive = isActiveValue;

        var result = validator.form();

        if (!result) {
            if (!result) {
                validator.focusInvalid();
            }
            return;
        }
        var DetailList = [];

        var grid = $("#BudgetDetailsData").data("kendoGrid");
        if (grid) {

            var items = grid.dataSource.view();

            items.forEach(function (x, index) {

                DetailList.push({
                    FiscalYearId: model.FiscalYearId,
                    SabreCode: x.SabreCode,
                    SabreName: x.SabreName,
                    InputTotal: x.InputTotal,
                });

            });
        }

        if (DetailList.length === 0) {
            ShowNotification(3, "At least one item is required.");
            return;
        }

        model.DetailList = DetailList;

        //var dataToSend = {
        //    model: model,
        //    DetailList: DetailList
        //};

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

                        }
                    }
                },
                aggregate: [

                    { field: "BLQuantityMT", aggregate: "sum" },

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
                                sum += (data[i].BLQuantityMT || 0);
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

