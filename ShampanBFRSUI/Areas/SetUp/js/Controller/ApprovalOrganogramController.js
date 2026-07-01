var ApprovalOrganogramController = function (CommonService, CommonAjaxService) {

    var decimalPlace = 2;

    var init = function () {

        decimalPlace = $("#DecimalPlace").val() || 2;
        var getId = $("#Id").val() || 0;
        getModuleType = $("#Module").val() || 0;
        getTransactionType = $("#TransactionType").val() || 0;
        var getOperation = $("#Operation").val() || '';
       

        if (getOperation != "") {
            GetModuleComboBox();
            GetTransactionType();
        }

        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
      
        };
        GenerateDatepicker();
        var $table = $('#details');
        var table = initEditTable($table, { searchHandleAfterEdit: false });
        $('#addRows').on('click', function (e) {
            addRow($table);

        });


        $('.btnsave').on('click', function (e) {

            e.preventDefault();

            var form = $("#frmEntry");
            var mvcValid = form.valid();
            var customValid = CommonValidationHelper.CheckValidation("#frmEntry");

            if (!mvcValid || !customValid) {
                return false;
            }
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

        $('#btnPost').on('click', function () {

            Confirmation("Are you sure? Do You Want to Post Data?",
                function (result) {

                    if (result) {
                        SelectDataPost();
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

        var ApprovalOrganogramDetails = JSON.parse($("#detailsListJson").val() || "[]");

        var detailsGridDataSource = new kendo.data.DataSource({
            data: ApprovalOrganogramDetails,
            schema: {
                model: {
                    id: "Id",
                    fields: {
                        Id: { type: "number", defaultValue: 0 },
                        ApprovalOrganogramId: { type: "number", defaultValue: null },
                        UserId: { type: "number", defaultValue: 0 },
                        UserName: { type: "string", defaultValue: "" },
                        //ApprovalLevel: { type: "number", defaultValue: 0 }
                        ApprovalLevel: { type: "string", defaultValue: "1" }
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
                    field: "UserId",
                    title: "User Id",
                    editor: UserNameSelectorEditor,
                    template: function (dataItem) {
                        return dataItem.UserName || "";
                    },
                    width: 130
                },   
                {
                    field: "FullName",
                    title: "Full Name",
                    editable: false,
                    format: "{0:n2}",
                    attributes: { style: "text-align:right;" },
                    width: 150
                }, 
           
                {
                    field: "ApprovalLevel",
                    title: "Approval Level",
                    editor: ApprovalLevelEditor,
                    template: function (dataItem) {
                        return dataItem.ApprovalLevel || "";
                    },
                    width: 150
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
    var selectedModule = "";
    var selectedTransactionType = "";

    function GetModuleComboBox() {

        $("#Module").kendoMultiColumnComboBox({
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
                            EnumType: "Module"
                        },
                        dataType: "json",
                        success: function (response) {
                            console.log("Module loaded successfully:", response);
                        },
                        error: function (xhr, status, error) {
                            console.error("Error fetching Nature list:", error);
                            alert("Error fetching Nature list.");
                        }
                    }
                }
            },
            placeholder: "Select Module",
            value: "",
            dataBound: function () {

                if (getModuleType && getModuleType !== "0") {
                    this.value(getModuleType);
                    selectedModule = getModuleType;                    
                }
            },
            change: function () {
                selectedModule = this.value();
                moduleName = selectedModule;
                var transactionCombo = $("#TransactionType").data("kendoMultiColumnComboBox");

                transactionCombo.dataSource.read().then(function () {
                    transactionCombo.value(selectedModule);
                    transactionCombo.trigger("change");
                });
            }
        });
    }


    function GetTransactionType(moduleName) {

        $("#TransactionType").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Name",
            height: 400,
            columns: [
                { field: "Name", title: "Name", width: 150 }
            ],
            filter: "contains",
            filterFields: ["Name"],
            autoBind: true,
            dataSource: {
                transport: {
                    read: {
                        url: "/Common/Common/GetEnumTypeList",
                        data: function () {
                            return {
                                EnumType: "TransactionType",
                                Module: moduleName
                            };
                        },
                        dataType: "json"
                    }
                }
            },
            placeholder: "Select Transaction Type",
            value: "",
            dataBound: function () {
                debugger;
                var combo = this;
                var data = combo.dataSource.data();

                if (getTransactionType && getTransactionType !== "0") {
                    combo.value(getTransactionType);
                    selectedTransactionType = getTransactionType;
                }
            }
        });
    }

    // 👉 GRID EDITOR FUNCTION (PUT HERE)
    function ApprovalLevelEditor(container, options) {

        var input = $('<input name="' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                dataSource: [
                    { text: "1", value: "1" },
                    { text: "2", value: "2" },
                    { text: "3", value: "3" },
                    { text: "4", value: "4" },
                    { text: "5", value: "5" }
                ],
                dataTextField: "text",
                dataValueField: "value",
                value: options.model.ApprovalLevel || "1"
            });

        var ddl = input.data("kendoDropDownList");

        // 🔥 ensure default always set
        if (!options.model.ApprovalLevel || options.model.ApprovalLevel === "0") {
            ddl.value("1");
            options.model.set("ApprovalLevel", "1");
        }
    }
    function UserNameSelectorEditor(container, options) {
        var wrapper = $('<div class="input-group input-group-sm full-width">').appendTo(container);

        // Create input (you can bind value if needed)
        $('<input type="text" class="form-control" readonly />')
            .attr("data-bind", "value:UserName")
            .appendTo(wrapper);

        // Create button inside an addon span eii monir..Monir
        $('<div class="input-group-append">')
            .append(
                $('<button class="btn btn-outline-secondary" type="button">')
                    .append('<i class="fa fa-search"></i>')
                    .on("click", function () {
                        openUserNameModal(options.model);
                    })
            )
            .appendTo(wrapper);

        kendo.bind(container, options.model);
    }

    var selectedGridModel = null;

    function openUserNameModal(gridModel) {
        selectedGridModel = gridModel;

        $("#UserNameWindow").kendoWindow({
            title: "Select User Name ",
            modal: true,
            width: "900px",
            height: "550px",
            visible: false,
            close: function () {
                selectedGridModel = null;
            }
        }).data("kendoWindow").center().open();

        $("#UserNamegrid").kendoGrid({
            dataSource: {
                transport: {
                    read: {
                        url: "/Common/Common/UserNameList",
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
                { field: "UserName", title: "User Name", width: 180 },
                { field: "FullName", title: "Full Name", width: 180 }

            ],
            dataBound: function () {
                this.tbody.find("tr").on("dblclick", function () {
                    var grid = $("#UserNamegrid").data("kendoGrid");


                    var dataItem = grid.dataItem(this);
                    if (dataItem && selectedGridModel) {

                        selectedGridModel.set("UserId", dataItem.Id);
                        selectedGridModel.set("UserName", dataItem.UserName);
                        selectedGridModel.set("FullName", dataItem.FullName);
                        var window = $("#UserNameWindow").data("kendoWindow");
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

  
    //function GetBudgetTypeComboBox() {
    //    var BudgetTypeComboBox = $("#BudgetType").kendoMultiColumnComboBox({
    //        dataTextField: "Name",
    //        dataValueField: "Name",
    //        height: 400,
    //        columns: [
    //            { field: "Name", title: "Name", width: 150 }
    //        ],
    //        filter: "contains",
    //        filterFields: ["Name"],
    //        dataSource: {
    //            transport: {
    //                read: "/Common/Common/GetEnumTypeList?EnumType=BudgetType"
    //            }
    //        },
    //        placeholder: "Select Budget Type",
    //        value: "",
    //        dataBound: function (e) {
    //            if (getBudgetType) {
    //                this.value(getBudgetType);
    //            }
    //        }
    //    }).data("kendoMultiColumnComboBox");
    //};
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
        var url = "/SetUp/ApprovalOrganogram/MultiplePost";

        CommonAjaxService.multiplePost(url, model, postDone, fail);
    };




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
                    url: "/SetUp/ApprovalOrganogram/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false,
                    data: { }

                },
                parameterMap: function (options) {
                    if (options.sort) {
                        options.sort.forEach(function (param) {

                            if (param.field === "Id") {
                                param.field = "M.Id";
                            }
                        
                            if (param.field === "Module") {
                                param.field = "M.Module";
                            }
                            if (param.field === "TransactionType") {
                                param.field = "M.TransactionType";
                            }
                            

                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {

                            if (param.field === "Id") {
                                param.field = "M.Id";
                            }

                            if (param.field === "Module") {
                                param.field = "M.Module";
                            }
                            if (param.field === "TransactionType") {
                                param.field = "M.TransactionType";
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
                        ExpectedNumber: { type: "number", editable: true }
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
            excel: {
                fileName: `ApprovalOrganogram_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.xlsx`,
                filterable: true
            },
            pdf: {
                fileName: `ApprovalOrganogram_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
                allPages: true,
                avoidLink: true,
                filterable: true
            },
            pdfExport: function (e) {

                $(".k-grid-toolbar").hide();
                $(".k-grouping-header").hide();
                $(".k-floatwrap").hide();

                var companyName = "SHAMPAN Budget LTD.";

                var fileName = `ApprovalOrganogram_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`;

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
                    width: 10,
                    template: function (dataItem) {
                        console.log(dataItem);
                        return `
                    <a href="/SetUp/ApprovalOrganogram/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                        <i class="fas fa-pencil-alt"></i>
                    </a>`;
                    }
                },

                { field: "Id", width: 10, hidden: true, sortable: true },
                { field: "Module", title: 'Module', width: 90, sortable: true },
                { field: "TransactionType", title: "Transaction Type", hidden: true, width: 100 }

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
                
                // You can adjust this to match your server-side view model
                details.push({
                    ApprovalOrganogramId: item.Id,
                    UserId: item.UserId,
                    UserName: item.FullName,
                    //ApprovalLevel: item.ApprovalLevel  
                    ApprovalLevel: (!item.ApprovalLevel || item.ApprovalLevel === "0")? "1": item.ApprovalLevel
                });
            }
        }

        if (details.length === 0) {
            ShowNotification(3, "Please add details before saving.");
            return;
        }
        model.ApprovalOrganogramDetails = details;

        var url = "/SetUp/ApprovalOrganogram/CreateEdit";
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
                debugger;
                ShowNotification(1, result.Message);
                $("#LastModifiedBy").val(result.Data.LastModifiedBy);
                $("#LastModifiedOn").val(result.Data.LastModifiedOn);
            }
        }
        else if (result.Status == 400) {
            debugger;
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
        var url = "/SetUp/ApprovalOrganogram/MultiplePost";

        CommonAjaxService.deleteData(url, model, postDone, saveFail);
    }


    $('.btnPost').on('click', function () { //for create form
        Confirmation("Are you sure? Do You Want to Post Data?",
            function (result) {

                if (result) {
                    var model = serializeInputs("frmEntry");
                    if (model.IsPost == "True") {
                        ShowNotification(3, "Data has already been Posted.");
                    }
                    else {
                        model.IDs = model.Id;
                        var url = "/SetUp/ApprovalOrganogram/MultiplePost";
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
