var ApprovalController = function (CommonService, CommonAjaxService) {

    var getBudgetType = 0;
    var getTransactionType = '';

    var init = function () {

        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';
        getFiscalYearId = $("#SelectedFiscalYearId").val() || 0;
        getBudgetType = $("#BudgetType").val() || 0;
        getTransactionType = $("#TransactionType").val() || '';

        GetFiscalYearComboBox();

        if (parseInt(getId) == 0 && getBudgetType != '') {
            GetGridDataList(getTransactionType, getBudgetType);
        }

        if (getOperation == 'update') {
            GetEditGridDataList();
        }

        $("[data-bootstrap-switch]").bootstrapSwitch();

        // APPROVE
        $('#btnApprove').off('click').on('click', function () {
            Confirmation("Are you sure? Do You Want to Approve Data?", function (result) {
                if (result) save(true);
            });
        });

        // REJECT
        $('#btnReject').off('click').on('click', function () {
            Confirmation("Are you sure? Do You Want to Reject Data?", function (result) {
                if (result) save(false);
            });
        });

        $('.btnLoad').off('click').on('click', validateAndFetchBudgetData);

        $('.btnDelete').off('click').on('click', function () {
            Confirmation("Are you sure? Do You Want to Delete Data?", function (result) {
                if (result) SelectData();
            });
        });

        $('#btnPrevious').off('click').on('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0)
                window.location.href = "/Ceiling/Approval/NextPrevious?id=" + getId + "&status=Previous";
        });

        $('#btnNext').off('click').on('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0)
                window.location.href = "/Ceiling/Approval/NextPrevious?id=" + getId + "&status=Next";
        });

        $('#details').on('blur', "td", function () {
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
                    url: "/Ceiling/Approval/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false,
                    data: { TransactionType: getTransactionType, BudgetType: getBudgetType }
                },
                parameterMap: function (options) {
                    mapGridParams(options);
                    return options;
                }
            },
            batch: true,
            schema: { data: "Items", total: "TotalCount" }
        });

        $("#GridDataList").kendoGrid({
            dataSource: gridDataSource,
            pageable: true,
            filterable: true,
            sortable: true,
            resizable: true,
            reorderable: true,
            groupable: true,
            toolbar: ["excel", "pdf", "search"],
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true,
            columns: [
                {
                    title: "Action",
                    width: 60,
                    template: d => `<a href="/Ceiling/Approval/Edit?id=${d.Id}" class="btn btn-sm btn-primary"><i class="fas fa-pencil-alt"></i></a>`
                },
                { field: "Id", hidden: true },
                { field: "Code", title: "Code" },
                { field: "YearName", title: "Year Name" },
                { field: "BudgetType", title: "Budget Type" },
                { field: "Status", title: "Status" }
            ]
        });
    };

    var GetEditGridDataList = function () {

        var detailsList = JSON.parse($("#detailsListJson").val() || "[]");

        var gridDataSource = new kendo.data.DataSource({
            data: detailsList,
            pageSize: 10,
            aggregate: [{ field: "InputTotal", aggregate: "sum" }]
        });

        $("#updtBudgetDetailsData").kendoGrid({
            dataSource: gridDataSource,
            pageable: true,
            sortable: true,
            editable: "incell",
            columns: [
                { field: "iBASCode", title: "iBAS Code" },
                { field: "iBASName", title: "iBAS Name" },
                { field: "SabreCode", title: "Sabre Code" },
                { field: "SabreName", title: "Sabre Name" },
                {
                    field: "InputTotal",
                    title: "Input Total",
                    format: "{0:n2}",
                    editor: numericEditor,
                    footerTemplate: "#=kendo.toString(sum,'n2')#"
                }
            ]
        });

        function numericEditor(container, options) {
            $('<input name="' + options.field + '" />')
                .appendTo(container)
                .kendoNumericTextBox({ format: "n2", decimals: 2 });
        }
    };

    function save(isApprove) {

        var model = serializeInputs("frmEntry");

        if (model.IsPost == 'True') {
            ShowNotification(2, "Already posted");
            return;
        }

        model.IsApprove = isApprove;

        var grid = $("#Operation").val() == 'update'
            ? $("#updtBudgetDetailsData").data("kendoGrid")
            : $("#BudgetDetailsData").data("kendoGrid");

        var items = grid ? grid.dataSource.view() : [];

        var DetailList = items.map(x => ({
            SabreId: x.SabreId,
            InputTotal: x.InputTotal,
            M1: 0, M2: 0, M3: 0, M4: 0, M5: 0, M6: 0,
            M7: 0, M8: 0, M9: 0, M10: 0, M11: 0, M12: 0,
            Q1: 0, Q2: 0, Q3: 0, Q4: 0,
            H1: 0, H2: 0,
            Yearly: x.InputTotal,
            IsPost: false
        }));

        if (DetailList.length === 0) {
            ShowNotification(3, "Load details first");
            return;
        }

        model.detailList = DetailList;

        CommonAjaxService.finalSave("/Ceiling/Approval/CreateEdit",model,saveDone,saveFail);
    }
    function mapGridParams(options) {

        var map = {
            Code: "M.Code",
            YearName: "fy.YearName",
            BudgetType: "M.BudgetType",
            Id: "M.Id",
            Status: "M.IsPost"
        };

        if (options.sort) {
            options.sort.forEach(x => x.field = map[x.field] || x.field);
        }

        if (options.filter && options.filter.filters) {
            options.filter.filters.forEach(x => x.field = map[x.field] || x.field);
        }
    }

    function validateAndFetchBudgetData() {
        GetBudgetDetailsData();
    }

    function GetFiscalYearComboBox() {
        $("#FiscalYearId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            dataSource: { transport: { read: "/Common/Common/GetFiscalYearComboBox" } }
        });
    }

    function GetBudgetDetailsData() {
    }

    function saveDone(result) {
        if (result.Status == 200) {
            ShowNotification(1, result.Message);
        } else {
            ShowNotification(2, result.Message);
        }
    }

    function saveFail() {
        ShowNotification(3, "Error");
    }

    return {
        init: init
    };

}(CommonService, CommonAjaxService);