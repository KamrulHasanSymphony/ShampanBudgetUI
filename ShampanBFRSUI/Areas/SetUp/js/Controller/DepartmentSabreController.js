var DepartmentSabreController = function (CommonService, CommonAjaxService) {

    var init = function () {
        var getId = $("#Id").val() || 0;
        getDepartmentId = $("#DepartmentId").val() || 0;
        getSabreId = $("#SabreId").val() || 0;
        var getOperation = $("#Operation").val() || '';

        if (getOperation != "") {
            GetDepartmentComboBox();
            GetSabreComboBox();
        }

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
                window.location.href = "/SetUp/DepartmentSabre/NextPrevious?id=" + getId + "&status=Previous";
            }
        });

        // Next button click handler
        $('#btnNext').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/SetUp/DepartmentSabre/NextPrevious?id=" + getId + "&status=Next";
            }
        });



    };

    function GetDepartmentComboBox() {
        var DepartmentComboBox = $("#DepartmentId").kendoMultiColumnComboBox({
            dataTextField: "Id",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "Name", title: "Name", width: 150 },
                { field: "Remarks", title: "Remarks", width: 150 },
            ],
            filter: "contains",
            filterFields: ["Name", "Remarks"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetDepartmentList"
                }
            },
            placeholder: "Select Department",
            value: "",
            dataBound: function (e) {
                if (getDepartmentId) {
                    this.value(parseInt(getDepartmentId));
                }
            }
        }).data("kendoMultiColumnComboBox");
    }; 
    function GetSabreComboBox() {
        var SabreComboBox = $("#SabreId").kendoMultiColumnComboBox({
            dataTextField: "Code",
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
                    read: "/Common/Common/GetSabreList"
                }
            },
            placeholder: "Select Sabre",
            value: "",
            dataBound: function (e) {
                if (getSabreId) {
                    this.value(parseInt(getSabreId));
                }
            }
        }).data("kendoMultiColumnComboBox");
    };  

    // Select data for delete
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

        var url = "/SetUp/DepartmentSabre/Delete";

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
                    url: "/SetUp/DepartmentSabre/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false
                },
                parameterMap: function (options) {
                    if (options.sort) {
                        options.sort.forEach(function (param) {

                            if (param.field === "DepartmentId") {
                                param.field = "H.DepartmentId";
                            }
                            if (param.field === "SabreId") {
                                param.field = "H.SabreId";
                            }
                            
                            //if (param.field === "Status") {
                            //    let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";
                            //    if (statusValue.startsWith("a")) {
                            //        param.value = 1;
                            //    } else if (statusValue.startsWith("i")) {
                            //        param.value = 0;
                            //    } else {
                            //        param.value = null;
                            //    }
                            //    param.field = "H.IsActive";
                            //    param.operator = "eq";
                            //}
                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {
                            if (param.field === "DepartmentId") {
                                param.field = "H.DepartmentId";
                            }
                            if (param.field === "SabreId") {
                                param.field = "H.SabreId";
                            }
                            //if (param.field === "Status") {
                            //    let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                            //    if (statusValue.startsWith("a")) {
                            //        param.value = 1;
                            //    } else if (statusValue.startsWith("i")) {
                            //        param.value = 0;
                            //    } else {
                            //        param.value = null;
                            //    }

                            //    param.field = "H.IsActive";
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
            search: {
                fields: ["Name"]
            },
            excel: {
                fileName: `DepartmentSabre_List_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.xlsx`,
                filterable: true
            },
            pdf: {
                fileName: `DepartmentSabre_List_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
                allPages: true,
                avoidLink: true,
                filterable: true
            },
            pdfExport: function (e) {
                $(".k-grid-toolbar").hide();
                $(".k-grouping-header").hide();
                $(".k-floatwrap").hide();

                var companyName = "Shampan Budget System.";
                var fileName = `DepartmentSabre_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.pdf`;

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
                            <a href="/SetUp/DepartmentSabre/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                                <i class="fas fa-pencil-alt"></i>
                            </a>`;
                    }
                },
                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "DepartmentId", title: "Department", sortable: true, width: 200 },
                { field: "SabreId", title: "Sabre", sortable: true, width: 200 }

            ],
            editable: false,
            selectable: " row",
            navigatable: true,
            columnMenu: true
        });
    };

    // Save the form data
    function save() {
        var validator = $("#frmEntry").validate();
        var formData = new FormData();
        var model = serializeInputs("frmEntry");

        var result = validator.form();

        if (!result) {
            if (!result) {
                validator.focusInvalid();
            }
            return;
        }

        for (var key in model) {
            formData.append(key, model[key]);
        }

        formData.append("IsActive", $('#IsActive').prop('checked'));
        formData.append("IsChangePassword", $('#IsChangePassword').prop('checked'));

        var url = "/SetUp/DepartmentSabre/CreateEdit";
        CommonAjaxService.finalImageSave(url, formData, saveDone, saveFail);
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
