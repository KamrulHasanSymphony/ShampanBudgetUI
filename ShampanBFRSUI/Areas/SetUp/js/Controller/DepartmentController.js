var DepartmentController = function (CommonService, CommonAjaxService) {
    var getCOAGroup = 0;
    var init = function () {
        var getId = $("#Id").val() || 0;
         getCOAGroup = $("#COAGroupId").val() || 0;
        var getOperation = $("#Operation").val() || '';

        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();            
        }
        if (getOperation != "") {            
            LoadItemsGrid();
            GetCOAGroupComboBox(); 
        }



        $(document).ready(function () {

            function toggleField(checkbox) {

                var target = $(checkbox).data("target");

                if (!target) return;

                var input = $("input[name='" + target + "']");

                if ($(checkbox).is(":checked")) {
                    input.prop("disabled", false).closest(".col-sm-5").show();
                } else {
                    input.prop("disabled", true).val("");
                }

                calculateTotal();
            }


            $(".fund-check").each(function () {
                toggleField(this);
            });

            $(".fund-check").on("change", function () {
                toggleField(this);
            });

            $(document).on("keyup change", ".fund-input", function () {
                calculateTotal();
            });

            function calculateTotal() {

                var total = 0;

                $(".fund-input:not(:disabled)").each(function () {
                    total += parseFloat($(this).val()) || 0;
                });

                $("#TotalValue").val(total.toFixed(2));
            }

        });


        // Save button click handler
        $('.btnsave').on('click', function () {
            var validator = $("#frmEntry").validate();
            var result = validator.form();

            if (!result) {
                if (!result) {
                    validator.focusInvalid();
                }
                return;
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
                window.location.href = "/SetUp/Department/NextPrevious?id=" + getId + "&status=Previous";
            }
        });

        // Next button click handler
        $('#btnNext').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/SetUp/Department/NextPrevious?id=" + getId + "&status=Next";
            }
        });

        //-
        //$('.ProjectName').change(function () {
        //    var isChecked = $(this).is(':checked');
        //    if (isChecked) {
        //        $('.showorhide').hide();
        //    } else {
        //        $('.showorhide').show();
        //    }
        //});

        $(document).ready(function () {
            $('.showorhide').hide();
            $(document).on('change', '.ProjectName', function () {
                if ($(this).is(':checked')) {
                    $('.showorhide').show();
                } else {
                    $('.showorhide').hide();
                }

            });

        });


        $("#sabres").on("click", ".custom-delete", function (e) {
            e.preventDefault();

            var grid = $("#sabres").data("kendoGrid");
            var tr = $(this).closest("tr");
            var dataItem = grid.dataItem(tr);

            var msg = "Are you sure? Do you want to Delete this Data?";

            Confirmation(msg, function (result) {
                if (result) {
                    grid.dataSource.remove(dataItem);
                    grid.dataSource.sync();
                }
            });
        });

        var sabreListList = JSON.parse($("#SabreListJson").val() || "[]");

        sabreList = new kendo.data.DataSource({
            data: sabreListList,
            schema: {
                model: {
                    id: "Id",
                    fields: {
                        SLNo: { editable: false },
                        Id: { type: "number", defaultValue: 0 },
                        DepartmentId: { type: "string", defaultValue: "", editable: false },
                        SabreId: { type: "string", defaultValue: "", editable: false },
                        Name: { type: "string", defaultValue: "", editable: false },
                        Code: { type: "string", defaultValue: "", editable: false }

                    }
                }
            }
        });

        $("#sabres").kendoGrid({
            dataSource: sabreList,
            //toolbar: [{ name: "create", text: "Add" }],
            editable: {
                mode: "incell",
                createAt: "bottom"
            },
            save: function () {
                var grid = this;
                setTimeout(function () {
                    grid.refresh();
                }, 0);
            },
            columns: [
                {
                    field: "SLNo",
                    title: "SL",
                    width: 20,
                    template: function (dataItem) {
                        var grid = $("#sabres").data("kendoGrid");
                        return grid.dataSource.indexOf(dataItem) + 1;
                    },
                    editable: false
                },
                { field: "iBASCode", title: "iBAS Code", width: 40, editable: false },
                { field: "iBASName", title: "iBAS Name", width: 80, editable: false },

                { field: "Code", title: "SABRE Code", width: 40, editable: false },
                { field: "DepartmentId", hidden: true },
                { field: "Name", title: "SABRE Name", width: 80, editable: false },
                {
                    title: "&nbsp;",
                    width: 20,
                    template: '<a class="k-button k-button-icon custom-delete" href="\\#"><span class="k-icon k-i-trash"></span></a>'
                }
            ]
           
        });

    };

    function GetCOAGroupComboBox(coagroupid) {
        var COAGroupComboBox = $("#COAGroupId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "Code", title: "Code", width: 80 },
                { field: "Name", title: "Name", width: 250 },
            ],
            filter: "contains",
            filterFields: ["Code", "Name"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetCOAGroupList"
                }
            },
            placeholder: "Select iBAS Group",
            value: "",
            dataBound: function (e) {
                if (getCOAGroup) {
                    this.value(parseInt(getCOAGroup));
                }
            }

            ,
            change: function (e) {
                debugger;
                var selectedValue = this.value();
                if (selectedValue) {
                    LoadItemsGrid(selectedValue);
                }
            }
        }).data("kendoMultiColumnComboBox");
    };  

    function LoadItemsGrid(coagroupid) {
        $("#departments").empty();
        $("#departments").kendoGrid({
            dataSource: {
                transport: {
                    read: {
                        url: "/Common/Common/GetSabreList",
                        dataType: "json",
                        data: function () {
                            return { value: coagroupid };
                        }
                    }
                },
                schema: {
                    data: function (res) { return res; },
                    total: function (res) { return res.length; }
                },
                pageSize: 10,
                serverPaging: false
            },
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
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
            columns: [
                { field: "Id", hidden: true },
                { field: "iBASCode", title: "iBAS Code", width: 62},
                { field: "iBASName", title: "iBas Name", width: 80 },
                { field: "Code", title: "SABRE Code", width: 62},
                { field: "Name", title: " SABRE Name", width: 80 },
                {
                    title: "Action",
                    width: 55,
                    template:
                        `<button class='k-button k-primary addToDetails'
                         data-id='#: Id #'
                         data-ibascode='#: iBASCode #'
                         data-ibasname='#: iBASName #'
                         data-code='#: Code #'
                         data-name='#: Name #'
                         >Add</button>`
                }
            ],
            editable: false,
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true,
            dataBound: function () {
                $(".addToDetails").off("click").on("click", function () {
                    var qty = $(this).closest("tr").find(".qtyInput").val();
                    qty = qty ? parseFloat(qty) : 1;

                    var item = {
                        Id: $(this).data("id"),
                        iBASCode: $(this).data("ibascode"),
                        iBASName: $(this).data("ibasname"),
                        Code: $(this).data("code"),
                        Name: $(this).data("name")
                    };

                    Addtosabre(item);
                });
            }
        });


    }
    function Addtosabre(item) {
        var ds = sabreList;

        //duplicate check (optional) - uncomment and adapt if needed
        var exists = ds.data().some(function (x) { return x.SabreId == item.Id; });
        if (exists) { kendo.alert("This item already added!"); return; }

        ds.add({
            Id: 0,
            TransferIssueId: null,
            BranchId: $("#BranchId").val() || null,
            SabreId: item.Id,
            iBASCode: item.iBASCode,
            iBASName:item.iBASName,
            Code: item.Code,
            Name: item.Name
        });
    }



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

        var url = "/SetUp/Department/Delete";

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
                    url: "/SetUp/Department/GetGridData",
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
                            if (param.field === "Description") {
                                param.field = "H.Description";
                            }
                            if (param.field === "Reference") {
                                param.field = "H.Reference";
                            }
                            if (param.field === "Remarks") {
                                param.field = "H.Remarks";
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
                            if (param.field === "Description") {
                                param.field = "H.Description";
                            }
                            if (param.field === "Reference") {
                                param.field = "H.Reference";
                            }
                            if (param.field === "Remarks") {
                                param.field = "H.Remarks";
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
            //search: {
            //    fields: ["Name"]
            //},
            excel: {
                fileName: `Department_List_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.xlsx`,
                filterable: true
            },
            pdf: {
                fileName: `Department_List_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
                allPages: true,
                avoidLink: true,
                filterable: true
            },
            pdfExport: function (e) {
                $(".k-grid-toolbar").hide();
                $(".k-grouping-header").hide();
                $(".k-floatwrap").hide();

                var companyName = "Shampan Budget System.";
                var fileName = `Department_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.pdf`;

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
                            <a href="/SetUp/Department/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                                <i class="fas fa-pencil-alt"></i>
                            </a>`;
                    }
                },
                { field: "Id", width: 50, hidden: true, sortable: true },

                { field: "Code", title: "Code", sortable: true, width: 100 },
                { field: "Name", title: "Name", sortable: true, width: 150 },
                { field: "DepartmentName", title: "Department Name(Bangla)", sortable: true, width: 150 },
                { field: "Description", title: "Description", sortable: true, width: 200 },
                { field: "Reference", title: "Reference", sortable: true, width: 200 },
                { field: "Remarks", hidden: true, title: "Remarks", sortable: true, width: 100 },
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
        var formData = new FormData();
        var model = serializeInputs("frmEntry");
        var department = model.DepartmentId;

        var grid = $("#sabres").data("kendoGrid");
        var details = [];
        debugger;


        if (grid) {
            var dataItems = grid.dataSource.view();

            for (var i = 0; i < dataItems.length; i++) {
                var item = dataItems[i];

                details.push({
                    Id: item.Id,
                    SabreId: item.SabreId,
                    DepartmentId: department
                });
            }
        }

        if (details.length === 0) {
            ShowNotification(3, "At least one detail entry is required.");
            return;
        }
        model.SabreList = details;


        for (var key in model) {
            formData.append(key, model[key]);
        }
        model.IsActive = $('#IsActive').prop('checked');
        model.DepartmentType = $("input[name='DepartmentType']:checked").val();
        model.ApprovalStatus = $("input[name='ApprovalStatus']:checked").val();

        model.OwnFund = $("#OwnFund").is(":checked");
        model.GovernmentGrant = $("#GovernmentGrant").is(":checked");
        model.GovernmentLoan = $("#GovernmentLoan").is(":checked");
        model.ForeignGrant = $("#ForeignGrant").is(":checked");
        model.ForeignLoan = $("#ForeignLoan").is(":checked");
        model.ShareCapital = $("#ShareCapital").is(":checked");
        
        var url = "/SetUp/Department/CreateEdit";
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
