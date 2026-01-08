var SabreController = function (CommonService, CommonAjaxService) {

    var init = function () {
        debugger;
        var getId = $("#Id").val() || 0;
        getCOAId = $("#COAId").val() || 0;
        if (getOperation != "") {
            GetCOAComboBox();
        }


        var getOperation = $("#Operation").val() || '';


        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
        }

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


        $('.btnDelete').on('click', function () {
            Confirmation("Are you sure? Do You Want to Delete Data?", function (result) {
                if (result) {
                    SelectData();
                }
            });
        });


        $('#btnPrevious').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/SetUp/Sabre/NextPrevious?id=" + getId + "&status=Previous";
            }
        });


        $('#btnNext').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/SetUp/Sabre/NextPrevious?id=" + getId + "&status=Next";
            }
        });
    };
    function GetCOAComboBox() {
        var COAComboBox = $("#COAId").kendoMultiColumnComboBox({
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
                    read: "/Common/Common/GetCOAList"
                }
            },
            placeholder: "Select iBAS",
            value: "",
            dataBound: function (e) {
                if (getCOAId) {
                    this.value(parseInt(getCOAId));
                }
            }
        }).data("kendoMultiColumnComboBox");
    };  


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

        var url = "/SetUp/Sabre/Delete";

        CommonAjaxService.deleteData(url, model, deleteDone, saveFail);
    };

    var GetGridDataList = function () {
        debugger;
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
                    url: "/SetUp/Sabre/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false
                },
                parameterMap: function (options) {
                    if (options.sort) {
                        options.sort.forEach(function (param) {
                            if (param.field === "Code") {
                                param.field = "H.Code";
                            }
                           
                            if (param.field === "Name") {
                                param.field = "H.Name";
                            }
                           
                            if (param.field === "iBASCode") {
                                param.field = "C.Code";
                            }

                            if (param.field === "iBASName") {
                                param.field = "C.Name";

                            }
                            if (param.field === "Status") {
                                let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";
                                if (statusValue.startsWith("a")) {
                                    param.value = 1;
                                } else if (statusValue.startsWith("i")) {
                                    param.value = 0;
                                } else {
                                    param.value = null;
                                }
                                param.field = "H.IsActive";
                                param.operator = "eq";
                            }
                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {
                            if (param.field === "Code") {
                                param.field = "H.Code";
                            }

                            if (param.field === "Name") {
                                param.field = "H.Name";
                            }


                            if (param.field === "iBASCode") {
                                param.field = "C.Code";
                            }

                            if (param.field === "iBASName") {
                                param.field = "C.Name";

                            }
 
                            if (param.field === "Status") {
                                let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                                if (statusValue.startsWith("a")) {
                                    param.value = 1;
                                } else if (statusValue.startsWith("i")) {
                                    param.value = 0;
                                } else {
                                    param.value = null;
                                }

                                param.field = "H.IsActive";
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
            search: {
                fields: ["Code","Name"]
            },
            excel: {
                fileName: `Sabre_List_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.xlsx`,
                filterable: true
            },
            pdf: {
                fileName: `Sabre_List_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
                allPages: true,
                avoidLink: true,
                filterable: true
            },
            pdfExport: function (e) {
                $(".k-grid-toolbar").hide();
                $(".k-grouping-header").hide();
                $(".k-floatwrap").hide();

                var companyName = "Shampan Tailoring System.";
                var fileName = `Examinees_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.pdf`;

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
                        console.log(dataItem);
                        return `
                            <a href="/SetUp/Sabre/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                                <i class="fas fa-pencil-alt"></i>
                            </a>`;
                    }
                },
                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "Code", title: "Sabre Code", sortable: true, width: 60 },
                { field: "Name", title: "Sabre Name", sortable: true, width: 200 },
                { field: "iBASCode", title: "iBAS Code", sortable: true, width: 60 },
                { field: "iBASName", title: "iBAS Name", sortable: true, width: 200 },
            ],
            editable: false,
            selectable: "row",
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

        var url = "/SetUp/Sabre/CreateEdit";
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
