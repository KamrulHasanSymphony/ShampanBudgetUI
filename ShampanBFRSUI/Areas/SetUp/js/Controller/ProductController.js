var ProductController = function (CommonService, CommonAjaxService) {


    var init = function () {
        
        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';

        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
        };

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
                        save();
                    }
                });
        });

        $('.btnDelete').on('click', function () {

            Confirmation("Are you sure? Do You Want to Delete Data?",
                function (result) {
                    
                    if (result) {
                        SelectData();
                    }
                });
        });

        $('#btnPrevious').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/SetUp/Product/NextPrevious?id=" + getId + "&status=Previous";
            }
        });

        $('#btnNext').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/SetUp/Product/NextPrevious?id=" + getId + "&status=Next";
            }
        });

      


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

        var url = "/SetUp/Product/Delete";

        CommonAjaxService.deleteData(url, model, deleteDone, saveFail);
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
                    url: "/SetUp/Product/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false
                },
                parameterMap: function (options) {
                    
                    if (options.sort) {
                        options.sort.forEach(function (param) {
                            if (param.field === "Id") {
                                param.field = "M.Id";
                            }
                            if (param.field === "Code") {
                                param.field = "M.Code";
                            }
                            if (param.field === "Name") {
                                param.field = "M.Name";
                            }                      
                            if (param.field === "ConversionFactor") {
                                param.field = "M.ConversionFactor";
                            }
                         
                            if (param.field === "CIFCharge") {
                                param.field = "M.CIFCharge";
                            }                         
                            if (param.field === "Active") {
                                let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                                if (statusValue.startsWith("a")) {
                                    param.value = 1;
                                } else if (statusValue.startsWith("i")) {
                                    param.value = 0;
                                } else {
                                    param.value = null;
                                }

                                param.field = "M.IsActive";
                                param.operator = "eq";
                            }
                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {
                            if (param.field === "Id") {
                                param.field = "M.Id";
                            }
                            if (param.field === "Code") {
                                param.field = "M.Code";
                            }
                            if (param.field === "Name") {
                                param.field = "M.Name";
                            }
                            if (param.field === "ConversionFactor") {
                                param.field = "M.ConversionFactor";
                            }

                            if (param.field === "CIFCharge") {
                                param.field = "M.CIFCharge";
                            }
                            if (param.field === "Active") {
                                let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                                if (statusValue.startsWith("a")) {
                                    param.value = 1;
                                } else if (statusValue.startsWith("i")) {
                                    param.value = 0;
                                } else {
                                    param.value = null;
                                }

                                param.field = "M.IsActive";
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
                fields: ["Code", "Name"]
            },
            excel: {
                fileName: "Products.xlsx",
                filterable: true
            },
            pdf: {
                fileName: `Products_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
                allPages: true,
                avoidLink: true,
                filterable: true
            },
            pdfExport: function (e) {
                
                $(".k-grid-toolbar").hide();
                $(".k-grouping-header").hide();
                $(".k-floatwrap").hide();

                

                var companyName = "OSAKA ELECTRIC & INDUSTRIAL CO.";

                var fileName = `Products_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`;

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
                    <a href="/SetUp/Product/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                        <i class="fas fa-pencil-alt"></i>
                    </a>`;
                    }
                },
                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "Code", title: "Code", width: 150, sortable: true },
                { field: "Name", title: "Name", sortable: true, width: 200 },
                { field: "ConversionFactor", title: "Conversion Factor", sortable: true, width: 200 },
                { field: "CIFCharge", title: "CIF Charge", sortable: true, width: 200 },
                //{
                //    field: "Status", title: "Status", sortable: true, width: 100,
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
                //},
               
            ],
            editable: false,
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true
        });

    };


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


        var url = "/SetUp/Product/CreateEdit";

        CommonAjaxService.finalSave(url, model, saveDone, saveFail);
    }


    function saveDone(result) {
        if (result.Status == 200) {
            ShowNotification(1, result.Message);
            $(".divSave").hide();
            $(".divUpdate").show();
            $("#Id").val(result.Data.Id);
            $("#Operation").val("update");
        }
    }

    function saveFail(result) {
        
        
        ShowNotification(3, "Query Exception!");
    };

    function deleteDone(result) {
        
        var grid = $('#GridDataList').data('kendoGrid');
        if (grid) {
            grid.dataSource.read();
        }
        if (result.Status == 200) {
            ShowNotification(1, result.Message);
        }
        else if (result.Status == 400) {
            ShowNotification(3, result.Message);
        }
        else {
            ShowNotification(2, result.Message);
        }
    };

    function fail(err) {
        
        
        ShowNotification(3, "Something gone wrong");
    };

    return {
        init: init
    }


}(CommonService, CommonAjaxService);

function ReportPreview(id) {
    
    const form = document.createElement('form');
    form.method = 'post';
    form.action = '/SetUp/Product/ReportPreview';
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