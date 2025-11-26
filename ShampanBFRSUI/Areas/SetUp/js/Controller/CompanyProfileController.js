var CompanyProfileController = function (CommonAjaxService) {

    var getCompanyTypeId = 0;
   
    var init = function () {

        getCompanyTypeId = $("#CompanyTypeId").val() || 0;

        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';
        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
        };  

        if (getOperation !== '') {
            GetCompanyTypeComboBox();
        };  

        $('.btnsave').click('click', function () {
            
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
                window.location.href = "/SetUp/CompanyProfile/NextPrevious?id=" + getId + "&status=Previous";
            }
        });
        $('#btnNext').click('click', function () {
            var getId = $('#Id').val();
            if (parseInt(getId) > 0) {
                window.location.href = "/SetUp/CompanyProfile/NextPrevious?id=" + getId + "&status=Next";
            }
        });

    };


    function GetCompanyTypeComboBox() {
        var CompanyTypeComboBox = $("#CompanyTypeId").kendoMultiColumnComboBox({
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
                    read: "/Common/Common/GetCompanyTypeList?value=CompanyType"
                }
            },
            placeholder: "Select Company Type ",
            value: "",
            dataBound: function (e) {
                if (getCompanyTypeId) {
                    this.value(parseInt(getCompanyTypeId));
                }
            },
            change: function (e) {
                
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

        var url = "/SetUp/CompanyProfile/Delete";

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
                    url: "/SetUp/CompanyProfile/GetGridData",
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
                            if (param.field === "TelephoneNo") {
                                param.field = "H.TelephoneNo";
                            }
                            if (param.field === "AreaId") {
                                param.field = "H.AreaId";
                            }
                            if (param.field === "TelephoneNo") {
                                param.field = "H.TelephoneNo";
                            }
                            if (param.field === "Email") {
                                param.field = "H.Email";
                            }
                            if (param.field === "VATRegistrationNo") {
                                param.field = "H.VATRegistrationNo";
                            }
                            if (param.field === "BIN") {
                                param.field = "H.BIN";
                            }

                            if (param.field === "TINNO") {
                                param.field = "H.TINNO";
                            }
                            if (param.field === "Comments") {
                                param.field = "H.Comments";
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
                            
                            if (param.field === "FYearStart" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "H.FYearStart";
                            }
                            if (param.field === "FYearEnd" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "H.FYearEnd";
                            }
                            //if (filter.field === "FYearEnd") {
                            //    param.field = "H.FYearEnd";
                            //}
                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {
                            if (param.field === "Code") {
                                param.field = "H.Code";
                            }
                            if (param.field === "CompanyName") {
                                param.field = "H.CompanyName";
                            }
                            if (param.field === "TelephoneNo") {
                                param.field = "H.TelephoneNo";
                            }
                            if (param.field === "FaxNo") {
                                param.field = "H.FaxNo";
                            }
                            if (param.field === "TelephoneNo") {
                                param.field = "H.TelephoneNo";
                            }
                            if (param.field === "Email") {
                                param.field = "H.Email";
                            }
                            if (param.field === "VATRegistrationNo") {
                                param.field = "H.VATRegistrationNo";
                            }
                            if (param.field === "BIN") {
                                param.field = "H.BIN";
                            }
                            if (param.field === "TINNo") {
                                param.field = "H.TINNo";
                            }
                            if (param.field === "Comments") {
                                param.field = "H.Comments";
                            }

                            if (param.field === "Status") {
                                let statusValue = param.value ? param.value.toString().trim().toLowerCase() : "";

                                if (statusValue.startsWith("a")) {
                                    param.value = 1;
                                } else if (statusValue.startsWith("i")) {
                                    param.value = 0;
                                }
                                else if (statusValue == "1") {
                                    param.value = 1;
                                }
                                else if (statusValue == "0") {
                                    param.value = 0;
                                }
                                else {
                                    param.value = null;
                                }

                                param.field = "H.IsActive";
                                param.operator = "eq";
                            }

                            //if (filter.field === "FYearStart" || filter.field === "FYearEnd") {
                            //    filter.value = kendo.toString(filter.value, "yyyy-MM-dd");
                            //}
                            if (param.field === "FYearStart" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "CONVERT(VARCHAR(10), H.FYearStart, 120)";
                            }
                            if (param.field === "FYearEnd" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "CONVERT(VARCHAR(10), H.FYearEnd, 120)";
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
                    FYearStart: { type: "date" },
                    FYearEnd: { type: "date" },
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
            search: ["Code", "Name", "CompanyName", "TelephoneNo", "FYearStart", "FYearEnd","Status"],
            excel: {
                fileName: "CompanyProfiles.xlsx",
                filterable: true
            },
            pdf: {
                fileName: `CompanyProfiles_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`,
                allPages: true,
                avoidLink: true,
                filterable: true
            },
            pdfExport: function (e) {
                
                $(".k-grid-toolbar").hide();
                $(".k-grouping-header").hide();
                $(".k-floatwrap").hide();

                

                var branchName = "All Branch Name";
                var companyName = "All Company Name";
                var companyAddress = "All Company Address";

                var grid = e.sender;

                // Hide the "Action" and checkbox columns
                var actionColumnIndex = grid.columns.findIndex(col => col.title === "Action");
                var selectionColumnIndex = grid.columns.findIndex(col => col.selectable === true);

                if (actionColumnIndex == 0 || actionColumnIndex > 0) {
                    var actionVisibility = [
                        grid.columns[actionColumnIndex].hidden,
                    ];

                    grid.hideColumn(actionColumnIndex);
                }
                if (selectionColumnIndex == 0 || selectionColumnIndex > 0) {
                    var selectableVisibility = [
                        grid.columns[selectionColumnIndex].hidden
                    ];

                    grid.hideColumn(selectionColumnIndex);
                }


                var fileName = `CompanyProfiles_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.pdf`;

                var numberOfColumns = e.sender.columns.filter(column => !column.hidden && column.field).length;
                var columnWidth = 100;
                var totalWidth = numberOfColumns * columnWidth;

                e.sender.options.pdf = {
                    paperSize: "A1",
                    margin: { top: "4cm", left: "1cm", right: "1cm", bottom: "4cm" },
                    landscape: true,
                    allPages: true,
                    template: `
                            <div style="position: absolute; top: 1cm; left: 1cm; right: 1cm; text-align: center; font-size: 12px; font-weight: bold;">
                                <div>Branch Name :- ${branchName}</div>
                                <div>Company Name :- ${companyName}</div>
                                <div>Company Address :- ${companyAddress}</div>
                            </div> `
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
                    width: 100,
                    template: function (dataItem) {

                        return `
                                <a href="/SetUp/CompanyProfile/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                                    <i class="fas fa-pencil-alt"></i>
                                </a>
                                 <a style='background-color: darkgreen;' href='#' onclick='ReportPreview(${dataItem.Id})' class='btn btn-success btn-sm mr-2 edit' title='Report Preview'>
                                    <i class='fas fa-eye'></i>
                                </a>
                                `;
                    }
                },
                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "Code", title: "Code", width: 120, sortable: true },
                { field: "CompanyName", title: " Name", sortable: true, width: 230 },
                {
                    field: "FYearStart", title: "Fiscal Year Start", sortable: true, width: 150, template: '#= kendo.toString(kendo.parseDate(FYearStart), "yyyy-MM-dd") #',
                    filterable:
                    {
                        ui: "datepicker"
                    }
                },
                {
                    field: "FYearEnd", title: "Fiscal Year End", sortable: true, width: 150, template: '#= kendo.toString(kendo.parseDate(FYearEnd), "yyyy-MM-dd") #',
                    filterable:
                    {
                        ui: "datepicker"
                    }
                },
                { field: "TelephoneNo", title: "Telephon No.", sortable: true, width: 140 },
                { field: "FaxNo", title: "Fax No.", width: 140, sortable: true },
                { field: "Email", title: "Email", width: 200, sortable: true },
                { field: "VatRegistrationNo", title: "VAT Registration No.", sortable: true, width: 200 },
                { field: "BIN", title: "BIN", sortable: true, width: 140 },
                { field: "TINNo", title: "TIN No.", width: 140, sortable: true },
                { field: "Comments", title: "Comments", sortable: true, width: 200 },
               
                {
                    field: "Status", title: "Status", sortable: true, width: 100,
                    filterable: {
                        ui: function (element) {
                            element.kendoDropDownList({
                                dataSource: [
                                    { text: "Active", value: "1" },
                                    { text: "Inactive", value: "0" }
                                ],
                                dataTextField: "text",
                                dataValueField: "value",
                                optionLabel: "Select Option"
                            });
                        }
                    }
                }
            ],
            editable: false,
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true
        });

    };

    function save() {
        var isValid = true;
        
        var group = $("#CompanyTypeId").val().trim();
        if (group === "" || group === 0) {
            isValid = false;
            $("#CompanyTypeId").addClass("is-invalid");
            $("#titleError").text("Company Type is required").show();
        } else {
            $("#CompanyTypeId").removeClass("is-invalid");
            $("#titleError").text("").hide();
        }

        if (!isValid) {
            ShowNotification(2, "Please complete the form. Not proceeding to Save");
            return;
        }
        
        var validator = $("#frmEntry").validate();
        var model = serializeInputs("frmEntry");

        var result = validator.form();
        if (!result) {
            validator.focusInvalid();
            return;
        }

        if ($('#IsActive').prop('checked')) {
            model.IsActive = true;
        }

        var url = "/SetUp/CompanyProfile/CreateEdit";

        CommonAjaxService.finalSave(url, model, saveDone, saveFail);
    };   

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


}(CommonAjaxService);

function ReportPreview(id) {
    
    const form = document.createElement('form');
    form.method = 'post';
    form.action = '/SetUp/CompanyProfile/ReportPreview';
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




