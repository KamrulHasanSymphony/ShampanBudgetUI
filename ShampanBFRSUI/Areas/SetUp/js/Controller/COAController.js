var COAController = function (CommonService, CommonAjaxService) {

    var init = function () {
        var getId = $("#Id").val() || 0;
        getNatureType = $("#Nature").val() || 0;
        getReportType = $("#ReportType").val() || 0;
        getCOAType = $("#COAType").val() || 0;
        getCOAGroup = $("#COAGroupId").val() || 0;
        var getOperation = $("#Operation").val() || '';


        if (getOperation != "") {
            GetNatureComboBox();
            GetReportComboBox();
            GetCOATypeComboBox();
            GetCOAGroupComboBox();

        }
        $("[data-bootstrap-switch]").bootstrapSwitch();

        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
        }
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
                window.location.href = "/SetUp/COA/NextPrevious?id=" + getId + "&status=Previous";
            }
        });

        // Next button click handler
        $('#btnNext').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/SetUp/COA/NextPrevious?id=" + getId + "&status=Next";
            }
        });



    };
    function GetNatureComboBox() {

        var NatureTypeComboBox = $("#Nature").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Name",
            height: 400,
            columns: [
                { field: "Name", title: "Name", width: 150 },
            ],
            filter: "contains",
            filterFields: ["Code", "Name"],
            dataSource: {
                transport: {
                    read: {
                        url: "/Common/Common/GetEnumTypeList",
                        data: {
                            EnumType: "Nature"
                        },
                        dataType: "json",
                        success: function (response) {
                            console.log("Nature loaded successfully:", response);
                        },
                        error: function (xhr, status, error) {
                            console.error("Error fetching Nature list:", error);
                            alert("Error fetching Nature list.");
                        }
                    }
                }
            },
            placeholder: "Select Nature",
            value: "",
            dataBound: function (e) {

                if (getNatureType && getNatureType !== 0) {
                    this.value(getNatureType);
                }
            },
            change: function (e) {
                var selectedDiseaseId = this.value();
                console.log("Selected Disease ID:", selectedDiseaseId);
            }
        }).data("kendoMultiColumnComboBox");
    }
    function GetReportComboBox() {

        var NatureTypeComboBox = $("#ReportType").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Name",
            height: 400,
            columns: [
                { field: "Name", title: "Name", width: 150 },
            ],
            filter: "contains",
            filterFields: ["Code", "Name"],
            dataSource: {
                transport: {
                    read: {
                        url: "/Common/Common/GetEnumTypeList",
                        data: {
                            EnumType: "ReportType"
                        },
                        dataType: "json",
                        success: function (response) {
                            console.log("ReportType loaded successfully:", response);
                        },
                        error: function (xhr, status, error) {
                            console.error("Error fetching ReportType list:", error);
                            alert("Error fetchingReportType list.");
                        }
                    }
                }
            },
            placeholder: "Select ReportType",
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
    function GetCOATypeComboBox() {

        var NatureTypeComboBox = $("#COAType").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Name",
            height: 400,
            columns: [
                { field: "Name", title: "Name", width: 150 },
            ],
            filter: "contains",
            filterFields: ["Code", "Name"],
            dataSource: {
                transport: {
                    read: {
                        url: "/Common/Common/GetEnumTypeList",
                        data: {
                            EnumType: "COAType"
                        },
                        dataType: "json",
                        success: function (response) {
                            console.log("COAType loaded successfully:", response);
                        },
                        error: function (xhr, status, error) {
                            console.error("Error fetching COAType list:", error);
                            alert("Error fetching COAType list.");
                        }
                    }
                }
            },
            placeholder: "Select COAType",
            value: "",
            dataBound: function (e) {

                if (getCOAType && getCOAType !== 0) {
                    this.value(getCOAType);
                }
            },
            change: function (e) {
                var selectedDiseaseId = this.value();
                console.log("Selected Disease ID:", selectedDiseaseId);
            }
        }).data("kendoMultiColumnComboBox");
    }
    function GetCOAGroupComboBox() {
        var CustomerComboBox = $("#COAGroupId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "Code", title: "Code", width: 100 },
                { field: "Name", title: "Name", width: 150 },
            ],
            filter: "contains",
            filterFields: ["Code", "Name"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetCOAGroupList"
                }
            },
            placeholder: "Select COAGroup",
            value: "",
            dataBound: function (e) {
                if (getCOAGroup) {
                    this.value(parseInt(getCOAGroup));
                }
            }
        }).data("kendoMultiColumnComboBox");
    };  




     //Select data for delete
    function SelectData() {
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

        var url = "/SetUp/COA/Delete";

        CommonAjaxService.deleteData(url, model, deleteDone, saveFail);
    };

    // Fetch grid data
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
                    url: "/SetUp/COA/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false
                },
                parameterMap: function (options) {
                    if (options.sort) {
                        options.sort.forEach(function (param) {

                            if (param.field === "Id") {
                                param.field = "C.Id";
                            }
                            if (param.field === "Name") {
                                param.field = "C.Name";
                            }
                            if (param.field === "Category") {
                                param.field = "C.Category";
                            }
                            if (param.field === "Code") {
                                param.field = "C.Code";
                            }

                            if (param.field === "Nature") {
                                param.field = "C.Nature";
                            }
                            if (param.field === "ReportType") {
                                param.field = "C.ReportType";
                            }
                            if (param.field === "Remarks") {
                                param.field = "C.Remarks";
                            }
                            if (param.field === "IsActive") {
                                param.field = "C.IsActive";
                            }

                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {
                            if (param.field === "Id") {
                                param.field = "C.Id";
                            }
                            if (param.field === "Name") {
                                param.field = "C.Name";
                            }
                            if (param.field === "Category") {
                                param.field = "C.Category";
                            }
                            if (param.field === "Code") {
                                param.field = "C.Code";
                            }

                            if (param.field === "Nature") {
                                param.field = "C.Nature";
                            }
                            if (param.field === "ReportType") {
                                param.field = "C.ReportType";
                            }
                            if (param.field === "Remarks") {
                                param.field = "C.Remarks";
                            }
                            if (param.field === "IsActive") {
                                param.field = "C.IsActive";
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
            search: {
                fields: ["Name"]
            },
            excel: {
                fileName: `COA_List_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.xlsx`,
                filterable: true
            },
            pdf: {
                fileName: `COA_List_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
                allPages: true,
                avoidLink: true,
                filterable: true
            },
            pdfExport: function (e) {
                $(".k-grid-toolbar").hide();
                $(".k-grouping-header").hide();
                $(".k-floatwrap").hide();

                var companyName = "Shampan Tailoring System.";
                var fileName = `COAGroup_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.pdf`;

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
                    width: 40,
                    template: function (dataItem) {
                        return `
                            <a href="/SetUp/COA/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                                <i class="fas fa-pencil-alt"></i>
                            </a>`;
                    }
                },
                { field: "id", title: "ID", width: 50, hidden: true },
                { field: "Code", title: "Account Code", width: 150, sortable: true },
                { field: "Name", title: "Account Name", width: 250, sortable: true },
                { field: "Nature", title: "Account Nature", width: 110 },
                { field: "COAGroupId", title: "Group Name", width: 110 },
                { field: "COAType", title: "Account Type", width: 110 },
                { field: "ReportType", title: "Report Type", width: 110 },
               /* { field: "Remarks", title: "Remarks", width: 250 },*/
                //{
                //    field: "isActive", title: "Status", sortable: true, width: 90,
                //    filterable: {
                //        ui: function (element) {
                //            element.kendoDropDownList({
                //                dataSource: [
                //                    { text: "Active", value: "1" },
                //                    { text: "Inactive", value: "0" }
                //                ],
                //                dataTextField: "text",
                //                dataValueField: "value",
                //                optionLabel: "Select Option"
                //            });
                //        }
                //    }
                //}
            ],
            editable: false,
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true
        });
    };

    // Save the form data
    function save() {
        debugger;
        var validator = $("#frmEntry").validate();
        var model = serializeInputs("frmEntry");

        var result = validator.form();

        if (!result) {
            validator.focusInvalid();
            return;
        }

        // Append checkbox values directly into model
        model.IsActive = $('#IsActive').prop('checked');
        model.IsRetainedEarning = $('#IsRetainedEarning').prop('checked');
        model.IsNetProfit = $('#IsNetProfit').prop('checked');
        model.IsDepreciation = $('#IsDepreciation').prop('checked');

        debugger;
        var url = "/SetUp/COA/CreateEdit";
        CommonAjaxService.finalSave(url, model, saveDone, saveFail);
    }

    // Handle success
    function saveDone(result) {
        if (result.Status == 200) {
            ShowNotification(1, result.Message);
            $(".divSave").hide();
            $(".divUpdate").show();
            $("#Id").val(result.Data.Id);
            $("#Operation").val("update");
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
