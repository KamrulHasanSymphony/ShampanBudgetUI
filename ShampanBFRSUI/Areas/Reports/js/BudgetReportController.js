var BudgetReportController = function (CommonService, CommonAjaxService) {
    var getFiscalYearId = 0;
    var getReportType = 0;
    var init = function () {
        getFiscalYearId = $("#FiscalYearId").val() || 0;
        getReportType = $("#ReportType").val() || 0;
        var getOperation = $("#Operation").val() || '';
        if (getOperation !== '') {
            GetReportType();
        }
       
        $("[data-bootstrap-switch]").bootstrapSwitch();

        GetFiscalYearComboBox();
        GetReportTypeComboBox();
       
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

        //$('.btnLoad').click('click', function () {
        //    validateAndFetchReportTypeData();
        //});

        // Download button click handler
        $('.btnDownload').click('click', function () {
            var status = "Download";

            Confirmation("Are you sure? Do You Want to " + status + " Data?", function (result) {
                if (result) {
                    Download();
                }
            });
        });

        $(document).on('click', '.btnLoad', function () {
            debugger;
            Load();
        });
 

        $('#details').on('blur', "td", function (e) {
            updateLineTotal($(this));
        });

    };
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
    function GetReportTypeComboBox() {

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

        function validateAndFetchReportTypeData() {

            var isValid = true;
            var yearId = $('#FiscalYearId').val() || 0;
            var reportType = $('#ReportType').val() || '';

            if (yearId === 'xx' || parseInt(yearId) <= 0) {
                isValid = false;
                ShowNotification(3, 'Fiscal Year Required.');
            }
            else if (parseInt(reportType) <= 0) {
                isValid = false;
                ShowNotification(3, 'Report Type Required.');
            }

            if (isValid) {
                GetReportTypeDetailsData();
            }
        };


        $('#details').on('blur', "td", function (e) {
            updateLineTotal($(this));
        });

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
    
    function Load() {
        var model = serializeInputs("frmEntry");
        debugger;
        $.ajax({
            url: "/Reports/Budget/BudgetLoadFinalReport",
            type: "POST",
            data: model,
            success: function (response) {
                console.log(response);
                bindKendoGrid(response);
            },
            error: function () {
                alert("Failed to load report data");
            }
        });
    }

    function bindKendoGrid(data) {

        var grid = $("#ReportTypeDetailsData").data("kendoGrid");
        if (grid) {
            grid.destroy();
            $("#ReportTypeDetailsData").empty();
        }

        $("#ReportTypeDetailsData").kendoGrid({
            dataSource: {
                data: data, 
                pageSize: 10
            },
            pageable: true,
            sortable: true,
            filterable: true,
            scrollable: true,
            columns: [
                { field: "SL", title: "SL", width: 50 },
                { field: "IBASCode", title: "iBAS Code" },
                { field: "IBASName", title: "iBAS Name" },
                { field: "SabreCode", title: "Sabre Code" },
                { field: "SabreName", title: "Sabre Name" },
                { field: "Estimated6", title: "Estimated", format: "{0:n2}" },
                { field: "Revised", title: "Revised", format: "{0:n2}" },
                { field: "Approved", title: "Approved", format: "{0:n2}" },
                { field: "Actual_Audited", title: "Actual Audited", format: "{0:n2}" },
                { field: "SixthMonths", title: " 6 Months Actual", format: "{0:n2}" },
                { field: "EstimatedPercent", title: "Estimated %" },
                { field: "RevisedPercent", title: "Revised %" },
                { field: "ActualAuditedPercent", title: "Actual Audited %" },
                { field: "SixthMonthsPercent", title: "6 Months Actual %" }
            ],
            columnMenu: true
        });
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
    var GetReportTypeDetailsData = function () {
        var yearId = $('#FiscalYearId').val() || 0;
        var report = $('#ReportType').val() || 0;

        if (parseInt(yearId) > 0 && parseInt(ReportType) > 0) {
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
                        url: "/Ceiling/Ceiling/GridDataReportType",
                        type: "POST",
                        dataType: "json",
                        cache: false,
                        data: { yearId: yearId, ReportType: ReportType }
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
                            ProductCode: { editable: false },
                            BLQuantityMT: { type: "number", defaultValue: 0, validation: { min: 0 } },

                        }
                    }
                },
                aggregate: [

                    { field: "BLQuantityMT", aggregate: "sum" },

                ]

            });

            $("#ReportTypeDetailsData").kendoGrid({
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
                    fileName: "ReportType Details.xlsx",
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
                        $('#ReportTypeDetailsData .k-grid-content').scrollLeft(horizontalScrollLeft);
                        $(e.container).find('input').focus();
                    }, 0);
                },
                columns: [

                    { field: "ProductId", width: 50, hidden: true, sortable: true },
                    { field: "Serial", title: "SL", sortable: true, width: 70, editable: false },
                    { field: "ProductCode", title: "Product Code", sortable: true, width: 170, editable: false },
                    { field: "ProductName", title: "Product Name", sortable: true, width: 170, editable: false },

                    {
                        field: "BLQuantityMT", title: "Input Value", sortable: true, width: 160, aggregates: ["sum"], format: "{0:n2}", groupFooterTemplate: "#=kendo.toString(sum, 'n2')#", attributes: { style: "text-align: right;" }
                        , footerTemplate: function () {

                            var data = $("#ReportTypeDetailsData").data("kendoGrid").dataSource.view();
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
            $('#ReportTypeDetailsData .k-grid-content').on('scroll', function () {
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
