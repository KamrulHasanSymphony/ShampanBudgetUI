var StructureController = function (CommonService, CommonAjaxService) {



    var init = function () {
        debugger;

        decimalPlace = $("#DecimalPlace").val() || 2;
        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';

        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
        };



        $(document).on('click', '.edit-sale-order', function () {
            kendo.alert("You can't edit this order because it has already been delivered.");
        });

        var $table = $('#details');

        var table = initEditTable($table, { searchHandleAfterEdit: false });


        $('#addRows').on('click', function (e) {
            debugger;
            addRow($table);
            //addRowStructure($table);
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
    
        $("#indexSearch").on('click', function () {
            var branchId = $("#Branchs").data("kendoMultiColumnComboBox").value();

            const gridElement = $("#GridDataList");
            if (gridElement.data("kendoGrid")) {
                gridElement.data("kendoGrid").destroy();
                gridElement.empty();
            }

            GetGridDataList();

        });

        //new kendo grid

        var detailsList = JSON.parse($("#detailsListJson").val() || "[]");

        var detailsGridDataSource = new kendo.data.DataSource({
            data: detailsList,
            schema: {
                model: {
                    id: "Id",
                    fields: {
                        Id: { type: "number", defaultValue: 0 },
                        StructureId: { type: "number", defaultValue: null },
                        SegmentId: { type: "number", defaultValue: 0 },
                        Remarks: { type: "string", defaultValue: '' }
                    
                    }
                }
            },
            aggregate: [
                { field: "Quantity", aggregate: "sum" },
                { field: "UnitPrice", aggregate: "sum" }

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
                    title: "Sl No",
                    width: 60,
                    template: function (dataItem) {
                        var grid = $("#kDetails").data("kendoGrid");
                        return grid.dataSource.indexOf(dataItem) + 1;
                    }
                },
                {
                    field: "SegmentId",
                    title: "Segment Name",
                    editor: segmentSelectorEditor,
                    template: function (dataItem) {
                        return dataItem.SegmentName || "";
                    },
                    width: 120
                },
                
                {
                    field: "Remarks",
                    title: "Remarks",                
                    attributes: { style: "text-align:right;" },
                    width: 120
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
            ]
        });

    };
    function segmentSelectorEditor(container, options) {
        debugger;
        var wrapper = $('<div class="input-group input-group-sm full-width">').appendTo(container);

        // Create input (you can bind value if needed)
        $('<input type="text" class="form-control" readonly />')
            .attr("data-bind", "value:SegmentName")
            .appendTo(wrapper);

        // Create button inside an addon span eii monir..Monir
        $('<div class="input-group-append">')
            .append(
                $('<button class="btn btn-outline-secondary" type="button">')
                    .append('<i class="fa fa-search"></i>')
                    .on("click", function () {
                        debugger;
                        openSegmentModal(options.model);
                    })
            )
            .appendTo(wrapper);

        kendo.bind(container, options.model);
    }


    var selectedGridModel = null;
    function openSegmentModal(gridModel) {
        debugger;
        selectedGridModel = gridModel;

        $("#SegmentWindow").kendoWindow({
            title: "Select Segment Name ",
            modal: true,
            width: "900px",
            height: "550px",
            visible: false,
            close: function () {
                selectedGridModel = null;
            }
        }).data("kendoWindow").center().open();

        $("#Segmentgrid").kendoGrid({
            dataSource: {
                transport: {
                    read: {
                        url: "/Common/Common/SegmentList",
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

                { field: "Code", title: "Code", width: 150 },
                { field: "Name", title: "Segment Name", width: 120 },
                { field: "Remarks", title: "Remarks", width: 200 }
            ],
            dataBound: function () {
                this.tbody.find("tr").on("dblclick", function () {
                    var grid = $("#Segmentgrid").data("kendoGrid");

                    var dataItem = grid.dataItem(this);
                    debugger;
                    if (dataItem && selectedGridModel) {

                        selectedGridModel.set("SegmentId", dataItem.Id);
                        selectedGridModel.set("SegmentName", dataItem.Name);
                        selectedGridModel.set("Remarks", dataItem.Remarks);

                        var window = $("#SegmentWindow").data("kendoWindow");
                        if (window) window.close();
                    }
                });
            }
        });
    }


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
                    url: "/SetUp/Structure/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false,
                    data: {  }

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

                            if (param.field === "Remarks") {
                                param.field = "M.Remarks";
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

                            if (param.field === "Remarks") {
                                param.field = "M.Remarks";
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
            search: ["Code", "Name", "Remarks"],

            
            excel: {
                fileName: `Structure_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.xlsx`,
                filterable: true
            },
            pdf: {
                fileName: `Structure_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
                allPages: true,
                avoidLink: true,
                filterable: true
            },
            pdfExport: function (e) {

                $(".k-grid-toolbar").hide();
                $(".k-grouping-header").hide();
                $(".k-floatwrap").hide();

                var companyName = "SHAMPAN Budget LTD.";

                var fileName = `Structure_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`;

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
                    width: 50,
                    template: function (dataItem) {
                        console.log(dataItem);
                        return `
                    <a href="/SetUp/Structure/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                        <i class="fas fa-pencil-alt"></i>
                    </a>`;
                    }
                },

                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "Code", title: "Code", sortable: true, width: 80 },
                { field: "Name", title: "Name", sortable: true, width: 200 },
                { field: "Remarks", title: "Remarks", sortable: true, width: 250 },
                { field: "Status", title: "Status", sortable: true, width: 250 }   

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

        var model = serializeInputs("frmEntry");
        var details = [];
        var grid = $("#kDetails").data("kendoGrid");
        if (grid) {
            var dataItems = grid.dataSource.view();

            for (var i = 0; i < dataItems.length; i++) {
                var item = dataItems[i];

                // You can adjust this to match your server-side view model
                details.push({
                    SegmentId: item.SegmentId,
                    SegmentName: item.SegmentName,
                    length:item.length,
                    Remarks: item.Remarks
                    

                });
            }
        }

        if (details.length === 0) {
            ShowNotification(3, "Save can not without details");
            return;
        }
        if (item.SegmentName === 0 || item.SegmentName === undefined || item.SegmentName === null || item.SegmentName === "") {
            ShowNotification(3, "Segment Name is required.");
            return;
        }
        
        model.IsActive = ("IsActive", $('#IsActive').prop('checked'));

        model.StructureDetails = details;

        var url = "/SetUp/Structure/CreateEdit";

        CommonAjaxService.finalSave(url, model, saveDone, saveFail);

    };

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
        var url = "/SetUp/Structure/MultiplePost";

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
                        var url = "/SetUp/Structure/MultiplePost";
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
    form.action = '/SetUp/Structure/ReportPreview';
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
