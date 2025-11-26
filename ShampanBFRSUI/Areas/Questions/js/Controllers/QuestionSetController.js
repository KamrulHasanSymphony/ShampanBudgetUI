var QuestionSetController = function (CommonService, CommonAjaxService) {

    var init = function () {
        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';

        // If it's a new page (getId == 0 && getOperation == ''), load the grid data
        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
        }

        // Initialize the question details grid
        var $table = $('#questionDetails');
        var table = initEditTable($table, { searchHandleAfterEdit: false });

        $('#addQuestionRows').on('click', function (e) {
            debugger;
            addRowAdvance($table);
        });

        // Initialize editable grid
        function questionSelectorEditor(container, options) {
            var wrapper = $('<div class="input-group input-group-sm full-width">').appendTo(container);

            // Create input (you can bind value if needed)
            $('<input type="text" class="form-control" readonly />')
                .attr("data-bind", "value:QuestionName")
                .appendTo(wrapper);

            // Create button inside 
            $('<div class="input-group-append">')
                .append(
                    $('<button class="btn btn-outline-secondary" type="button">')
                        .append('<i class="fa fa-search"></i>')
                        .on("click", function () {
                            openQuestionModal(options.model);
                        })
                )
                .appendTo(wrapper);

            kendo.bind(container, options.model);
        }

        var selectedQuestionGridModel = null;
        function openQuestionModal(gridModel) {
            selectedQuestionGridModel = gridModel;

            $("#questionDetailsWindow").kendoWindow({
                title: "Select Question",
                modal: true,
                width: "900px",
                height: "550px",
                visible: false,
                close: function () {
                    selectedQuestionGridModel = null;
                }
            }).data("kendoWindow").center().open();

            $("#questionDetailsGrid").kendoGrid({
                dataSource: {
                    transport: {
                        read: {
                            url: "/Common/Common/GetQuestionDataForSet",
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
                    { field: "Id", hidden: true },
                    { field: "Code", title: "Question Code", width: '10%' },
                    { field: "Name", title: "Question Name", width: '15%' },
                    { field: "Description", title: "Description", width: '15%' },
                    { field: "IsActive", title: "Active", width: '8%' }
                ],
                dataBound: function () {
                    this.tbody.find("tr").on("dblclick", function () {
                        var grid = $("#questionDetailsGrid").data("kendoGrid");
                        var dataItem = grid.dataItem(this);

                        if (dataItem && selectedQuestionGridModel) {
                            selectedQuestionGridModel.set("QuestionId", dataItem.Id);
                            selectedQuestionGridModel.set("QuestionName", dataItem.Name);
                            selectedQuestionGridModel.set("QuestionCode", dataItem.Code);
                            selectedQuestionGridModel.set("Description", dataItem.Description || "");
                            selectedQuestionGridModel.set("IsActive", dataItem.IsActive || "");

                            var window = $("#questionDetailsWindow").data("kendoWindow");
                            if (window) window.close();
                        }
                    });
                }
            });
        }

        var questionSetDetails = JSON.parse($("#QuestionDetailsJson").val() || "[]");
        var questionDetails = new kendo.data.DataSource({
            data: questionSetDetails,
            schema: {
                model: {
                    id: "Id",
                    fields: {
                        Id: { type: "number", defaultValue: 0 },
                        QuestionId: { type: "number", defaultValue: 0 },
                        QuestionName: { type: "string", defaultValue: "" },
                        QuestionCode: { type: "string", defaultValue: "" },
                        Description: { type: "string", defaultValue: "" },
                        SL: { type: "number", defaultValue: 0 },
                        SLNo: { type: "number", defaultValue: 0 }
                    }
                }
            }
        });

        var rowNumber = 0;
        $("#questionDetails").kendoGrid({
            dataSource: questionDetails,
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
                        var grid = $("#questionDetails").data("kendoGrid");
                        return grid.dataSource.indexOf(dataItem) + 1;
                    }
                },
                {
                    field: "QuestionName",
                    title: "Question Name",
                    editor: questionSelectorEditor,
                    template: function (dataItem) {
                        return dataItem.QuestionName || "";
                    },
                    width: 150
                },
                {
                    field: "QuestionId",
                    title: "QuestionId",
                    template: function (dataItem) {
                        return dataItem.Id || "";
                    },
                    hidden: true
                },
                { field: "QuestionCode", title: "Question Code", width: 120 },
                { field: "SL", title: "SL", width: 80 },
                { field: "Description", title: "Description", width: 150 },
                { field: "IsActive", title: "Active", width: 100 },
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

        // Save the form data
        function save() {
            var validator = $("#frmEntry").validate();
            if (!validator.form()) {
                validator.focusInvalid();
                return;
            }

            var model = serializeInputs("frmEntry");
            var formData = new FormData();

            var Qdetails = [];
            var grid = $("#questionDetails").data("kendoGrid");
            if (grid) {
                var dataItems = grid.dataSource.view();

                for (var i = 0; i < dataItems.length; i++) {
                    var item = dataItems[i];

                    // Validate if a Question is selected
                    if (!item.QuestionId || parseFloat(item.QuestionId) <= 0) {
                        ShowNotification(3, "Question is required.");
                        return;
                    }

                    Qdetails.push({
                        QuestionId: item.QuestionId,
                        SL: item.SL,
                        Description: item.Description,
                        IsActive: item.IsActive
                    });
                }
            }

            // Prevent save if no details are added
            if (Qdetails.length === 0) {
                ShowNotification(3, "At least one question entry is required.");
                return;
            }

            model.QuestionDetails = Qdetails;

            // Append normal properties
            for (var key in model) {
                if (key !== "QuestionDetails") {
                    formData.append(key, model[key]);
                }
            }

            // Append Question detail list
            model.QuestionDetails.forEach(function (detail, i) {
                for (var key in detail) {
                    if (detail.hasOwnProperty(key)) {
                        formData.append(`QuestionDetails[${i}].${key}`, detail[key]);
                    }
                }
            });

            CommonAjaxService.finalImageSave("/Questions/QuestionSet/CreateEdit", formData, saveDone, saveFail);
        }

        // Save done handler
        function saveDone(result) {
            if (result.Status == 200) {
                ShowNotification(1, result.Message);
            } else if (result.Status == 400) {
                ShowNotification(3, result.Message);
            } else {
                ShowNotification(2, result.Message);
            }
        }

        // Save fail handler
        function saveFail(result) {
            ShowNotification(3, "Error during save!");
        }

        return {
            init: init
        }
    };

    // Fetch grid data for the list
    function GetGridDataList() {
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
                    url: "/QuestionSet/QuestionSetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false
                }
            },
            schema: {
                data: "QuestionSets",
                total: "TotalCount"
            }
        });

        $("#GridDataList").kendoGrid({
            dataSource: gridDataSource,
            pageable: {
                refresh: true,
                pageSizes: [10, 20, 50, "all"]
            },
            noRecords: true,
            messages: {
                noRecords: "No Record Found!"
            },
            filterable: {
                extra: true
            },
            sortable: true,
            columns: [
                { field: "Id", title: "ID", width: 100 },
                { field: "Name", title: "Question Set Name", width: 200 },
                { field: "TotalMark", title: "Total Mark", width: 100 },
                { field: "Remarks", title: "Remarks", width: 200 },
                { field: "IsActive", title: "Status", width: 100 },
                { command: [{ name: "edit", text: "Edit" }], title: "Action", width: 120 }
            ]
        });
    }

    return {
        init: init
    }
}(CommonService, CommonAjaxService);
