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



        $('#details').on('click', 'input.txtProductName', function () {
            debugger;
            var originalRow = $(this);
            debugger;

            originalRow.closest("td").find("input").data('touched', true);

            CommonService.productNameModal(
                function success(result) {
                },
                function fail(error) {
                    originalRow.closest("td").find("input").data("touched", false).focus();
                },
                function dblClick(row) {
                    productNameModalDblClick(row, originalRow);
                },
                function closeCallback() {
                    originalRow.closest("td").find("input").data("touched", false).focus();
                }
            );
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

    function GetChargeGroup() {
        var COAGroupComboBox = $("#ChargeGroup").kendoMultiColumnComboBox({
            dataTextField: "ChargeGroupText",
            dataValueField: "ChargeGroupValue",
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


    function productNameModalDblClick(row, originalRow) {
        debugger;

        var dataTable = $("#modalData").DataTable();
        var rowData = dataTable.row(row).data();

        var Id = rowData.Id;
        var Code = rowData.Code;
        var ProductName = rowData.Name;
        var ConversionFactor = rowData.ConversionFactor != null
            ? Number(rowData.ConversionFactor)
            : 0;


        var $currentRow = originalRow.closest('tr');

        $currentRow.find('.td-ConversionFactor').text(ConversionFactor);
        $currentRow.find('.td-ProductName').text(ProductName);
        $currentRow.find('.td-Code').text(Code);
        $currentRow.find('.td-ProductId').text(Id);


        $("#partialModal").modal("hide");
        originalRow.closest("td").find("input").data("touched", false).focus();

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
                        { field: "ChargeHeaderId", title: "Charge Header Id", width: 120 },
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

        debugger;
        //-
        //var grid = $("#GridDataList").data("kendoGrid");


        var model = serializeInputs("frmEntry");

        if (!hasLine($table)) {
            ShowNotification(3, "Can not save without details.");
            return;
        }

        var details = serializeTable($table);

        var isValidDetails = true;
        var errorMessage = "";

        $(details).each(function (index, row) {
            if (!row.ProductId || parseInt(row.ProductId) <= 0) {
                isValidDetails = false;
                errorMessage = "Product Name is required at row " + (index + 1);
                return false;
            }

        });

        if (!isValidDetails) {
            ShowNotification(3, errorMessage);
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
