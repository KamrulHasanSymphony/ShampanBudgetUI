var FiscalYearsController = function (CommonAjaxService) {

    var init = function () {

        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';
        var getYearValue = $('#YearPeriod').val();

        generateYearList(getYearValue);

        GetGridDataList();

        var $table = $('#fiscalYearDetails');

        $('.btnsave').click('click', function () {
            
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
        $('.NewButton ').on('click', function () {
            $("#dtHeader").show();
        })
        $('.btnDelete').on('click', function () {

            Confirmation("Are you sure? Do You Want to Delete Data?",
                function (result) {
                    
                    if (result) {
                        SelectData();
                    }
                });
        });

        $("#YearLock").on('click', function () {
            if ($(this).is(':checked')) {
                $(".MonthLock").attr('checked', true);
            }
            else {
                $(".MonthLock").attr('checked', false);
            }
        });

        $(".MonthLock").on('click', function () {
            if ($('.MonthLock:checkbox:not(:checked)').length > 0) {
                $(".YearLock").attr('checked', false);
            }
            else {
                $(".YearLock").attr('checked', true);
            }
        });
        debugger;
        $("#Year").on('change', function () {

            debugger;
            
            var year = $('#Year').val();
            var yearStartDate = $('#YearStart').val();
            var updatedYearStartDate = yearStartDate.replace(/^(\d{4})/, year.toString());
            $('#YearStart').val(updatedYearStartDate);
            var startDate = new Date(updatedYearStartDate);

            var endDate = new Date(startDate);
            endDate.setFullYear(startDate.getFullYear() + 1);

            endDate.setMonth(endDate.getMonth());
            endDate.setDate(0);

            
            var updatedYearEndDate = endDate.toISOString().split('T')[0]; // Get date in 'YYYY-MM-DD' format

            
            $('#YearEnd').val(updatedYearEndDate);

        });
        
        $("#btnFDt").on('click', function () {
            $('#fiscalYearDetails').show();           
            //$("#dtMHeader").show();
            
            debugger;
            var yearStart = $('#YearStart').val();
            var yearEnd = $('#YearEnd').val();

            // Correcting the URL construction to ensure proper formatting
            let url = '/SetUp/FiscalYear/FiscalYearSet?YearStart=' + yearStart + '&YearEnd=' + yearEnd;
            $('#fiscalYearDetails').html('');
            $.get(url, function (data) {
                
                $('#fiscalYearDetails').append(data);

            }).fail(function (xhr, status, error) {
                $('#fiscalYearDetails').html('<div class="error-message">Failed to load data. Please try again later.</div>');
            });
        });



        $('#YearLock').change(function () {
            var isChecked = $(this).prop('checked');

            // Lock or unlock all MonthLock checkboxes based on YearLock checkbox
            $('.PeriodLock').each(function () {
                $(this).prop('checked', isChecked);
                $(this).prop('disabled', isChecked); // Optionally disable the checkbox
            });
        });
        
        $('#YearLockCheckbox').change(function () {
            toggleMonthLocks();
        });
        

    };
    function toggleMonthLocks() {
        var isYearLockChecked = $('#YearLockCheckbox').prop('checked');

        // Check/uncheck and disable/enable all MonthLock checkboxes based on YearLock state
        $('.PeriodLock').each(function () {
            $(this).prop('checked', isYearLockChecked);
            $(this).prop('disabled', isYearLockChecked);
        });
    }
    function SelectData() {
        
        var IDs = [];

        var selectedRows = $("#FiscalYearsGrid").data("kendoGrid").select();

        if (selectedRows.length === 0) {
            ShowNotification(3, "You are requested to Select checkbox!");
            return;
        }

        selectedRows.each(function () {
            var dataItem = $("#FiscalYearsGrid").data("kendoGrid").dataItem(this);
            IDs.push(dataItem.Id);
        });

        var model = {
            IDs: IDs
        };

        var url = "/SetUp/FiscalYear/Delete";

        CommonAjaxService.deleteData(url, model, deleteDone, saveFail);
    };
    //
    function generateYearList(getYearValue) {
        
        var yearList = [];
        var currentYear = new Date().getFullYear();
        yearList.push({ key: (currentYear - 1).toString(), value: (currentYear - 1).toString() });
        yearList.push({ key: currentYear.toString(), value: currentYear.toString() });
        for (var i = 1; i <= 3; i++) {
            var year = currentYear + i;
            yearList.push({ key: year.toString(), value: year.toString() });
        }

        var yearDropdown = $('#Year');
        yearList.forEach(function (year) {
            yearDropdown.append($('<option>', {
                value: year.key,
                text: year.value
            }));
        });
        
        if (parseInt(getYearValue) > 0) {
            $('#Year').val(getYearValue);
        }
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
                    url: "/SetUp/FiscalYear/GetFiscalYearsGrid",
                    type: "POST",
                    dataType: "json",
                    cache: false
                },
                parameterMap: function (options) {
                    if (options.sort) {

                        options.sort.forEach(function (param) {
                            if (param.field === "YearStart" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "H.YearStart";
                            }
                            if (param.field === "YearEnd" && param.value) {
                                param.value = kendo.toString(new Date(param.value), "yyyy-MM-dd");
                                param.field = "H.YearEnd";
                            }
                        });
                    }
                    // Format the date values before sending them to the server
                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (filter) {
                          
                            if (filter.field === "YearStart" && filter.value) {
                                filter.value = kendo.toString(new Date(filter.value), "yyyy-MM-dd");
                                filter.field = "CONVERT(VARCHAR(10), H.YearStart, 120)";
                            }
                            if (filter.field === "YearEnd" && filter.value) {
                                filter.value = kendo.toString(new Date(filter.value), "yyyy-MM-dd");
                                filter.field = "CONVERT(VARCHAR(10), H.YearEnd, 120)";
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
                        YearStart: { type: "date" },
                        YearEnd: { type: "date" },
                    }
                }
            }
        });

        $("#FiscalYearsGrid").kendoGrid({
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
                        gt: "Is greater then",
                        lt: "Is less then"
                    }
                }
            },
            sortable: true,
            resizable: true,
            reorderable: true,
            groupable: true,
            toolbar: ["excel", "pdf", "search"],
            search: {
                fields: ["Year", "YearStart", "YearEnd"]
            },
            excel: {
                fileName: "FiscalYear.xlsx",
                filterable: true
            },
            
            columns: [
              
                {
                    title: "Action",
                    width: 60,
                    template: function (dataItem) {
                        return `
                            <a href="/SetUp/FiscalYear/Edit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit" title="Edit Fiscal Year">
                                <i class="fas fa-pencil-alt"></i>
                            </a>`;
                    }
                },
                {
                    field: "Id", width: 150, hidden: true, sortable: true
                },
                {
                    field: "Year", title: "Year", width: 150, sortable: true
                },
                {
                    field: "YearName", title: "Year Name", width: 150, sortable: true
                },
                {
                    field: "YearStart", title: "Year Start", sortable: true, width: 150, template: '#= kendo.toString(kendo.parseDate(YearStart), "yyyy-MM-dd") #',
                    filterable: {
                        ui: "datepicker"
                    }
                },
                {
                    field: "YearEnd", title: "Year End", sortable: true, width: 150, template: '#= kendo.toString(kendo.parseDate(YearEnd), "yyyy-MM-dd") #',
                    filterable: {
                        ui: "datepicker"
                    }
                },
                {
                    field: "Remarks", title: "Remarks", sortable: true, width: 200
                }
            ],

            editable: false,
            selectable: "multiple row",
            navigatable: true,
            columnMenu: true
        });

        //Grid Select all checkbox
        $("#FiscalYearsGrid").on("click", ".k-header .k-checkbox", function () {
            var isChecked = $(this).is(":checked");
            var grid = $("#FiscalYearsGrid").data("kendoGrid");
            if (isChecked) {
                grid.tbody.find(".k-checkbox").prop("checked", true);
            } else {
                grid.tbody.find(".k-checkbox").prop("checked", false);
            }
        });
    };

    $('body').on('click', '.btnDelete-FiscalYear', function (e) {
        
        var data = $(this).attr('id');
        var id = data.split('~')[0];
        var url = "/FiscalYear/DeleteItem?id=" + id + "";

        Confirmation("Are you sure? Do You Want to Delete Data?",
            function (result) {
                
                if (result) {
                    
                    $.ajax({
                        type: 'POST',
                        url: url,
                        success: function (response) {
                            
                            if (response.status == "200") {
                                ShowNotification(1, response.message);
                            }
                            else {
                                ShowNotification(3, response.message);
                            }
                            if (response.status == "200") {
                                setTimeout(function () {
                                    window.location.reload();
                                }, 1000);
                            }
                        },
                        error: function (error) {
                            
                            ShowNotification(3, response.message);
                        }
                    });
                }
            });
    });

    function save() {
     

        var yearLock = $('#YearLock').is(':checked');
        var remarks = $("#Remarks").val();
        var validator = $("#frmEntry").validate();
        var fiscal = serializeInputs("frmEntry");
        fiscal.YearLock = yearLock;
        fiscal.Remarks = remarks;
        // Validate the form
        var result = validator.form();
        if (!result) {
            validator.focusInvalid();
            return;
        }


        // Initialize an empty array for fiscalYearDetails
        var fiscalYearDetails = [];
        var operation = $("#Operation").val();
        
        if (operation == 'add') {
            $('#fiscalYearDetails .card-body').each(function () {
                var row = $(this);
                debugger;
                // Create an object for each row's data
                var detail = {
                    Id: row.find('input[name$=".Id"]').val(),
                    MonthName: row.find('input[name$=".MonthName"]').val(),
                    MonthStart: row.find('input[name$=".MonthStart"]').val(),
                    MonthEnd: row.find('input[name$=".MonthEnd"]').val(),
                    MonthId: row.find('input[name$=".MonthId"]').val(),
                    MonthLock: row.find('input[name$=".MonthLock"]').prop('checked'),
                    Remarks: row.find('input[name$=".Remarks"]').val()
                };

                // Add the object to the fiscalYearDetails array
                fiscalYearDetails.push(detail);
            });
        }
        else {
            $("#dtHeader").hide();
            $('.fiscalYearRow').each(function () {
                var row = $(this);

                // Create an object for each row's data
                var detail = {
                    Id: row.find('input[name$=".Id"]').val(),
                    MonthName: row.find('input[name$=".MonthName"]').val(),  
                    MonthStart: row.find('input[name$=".MonthStart"]').val(), 
                    MonthEnd: row.find('input[name$=".MonthEnd"]').val(),  
                    MonthId: row.find('input[name$=".MonthId"]').val(),  
                    MonthLock: row.find('input[name$=".MonthLock"]').prop('checked'),
                    Remarks: row.find('input[name$=".Remarks"]').val()
                };

                // Add the object to the array
                fiscalYearDetails.push(detail);
            });
        }
        if (fiscalYearDetails.length === 0) {
            ShowNotification(3, "Please add fiscal year detail");
            return; 
        }


        // Assign the array to fiscal.fiscalYearDetails
        fiscal.fiscalYearDetails = fiscalYearDetails;

        var url = "/SetUp/FiscalYear/CreateEdit"

        // Call the save service
        CommonAjaxService.finalSave(url, fiscal, saveDone, saveFail);
    };

    function saveDone(result) {
        
        if (result.Status == "200") {
            if (result.Data.Operation == "add") {
                ShowNotification(1, result.Message);
                $(".btnsave").html('Update');
                $(".btnsave").addClass('sslUpdate');
                $("#Id").val(result.Data.Id);
                $("#Operation").val("update");
                $("#CreatedBy").val(result.Data.CreatedBy);
                $("#CreatedOn").val(result.Data.CreatedOn);

            } else {
                ShowNotification(1, result.Message);
                $("#LastModifiedBy").val(result.Data.LastModifiedBy);
                $("#LastModifiedOn").val(result.Data.LastModifiedOn);
            }
        }
        else if (result.Status == "400") {
            ShowNotification(3, result.Message); // <-- display the error message here
        }
        else if (result.Status == "199") {
            ShowNotification(2, result.Message); // <-- display the error message here
        }
    }

    function saveFail(result) {
        
        
        ShowNotification(3, "Query Exception!");
    }
    function deleteDone(result) {
        
        var grid = $('#FiscalYearsGrid').data('kendoGrid');
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