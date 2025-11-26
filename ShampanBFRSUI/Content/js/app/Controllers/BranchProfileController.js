var BranchProfileController = function (CommonService, BranchProfileService) {

    var init = function () {

        $("#btnAdd").on("click", function () {

            rowAdd(detailTable);

        });

        $('#Post').on('click', function () {

            SelectData(true);

        });

        GetGridDataList();

        $("#ModalButtonCloseFooter").click(function () {
            addPrevious(detailTable);
        });
        $("#ModalButtonCloseHeader").click(function () {
            addPrevious(detailTable);
        });

        $('.btn-cogscode').on('click', function () {
            var originalRef = $(this);
            CommonService.accountCodeModal({}, fail, function (row) { cogsModalDblClick(row, originalRef) });

        });
        $('.btn-taxcode').on('click', function () {
            var originalRef = $(this);
            CommonService.accountCodeModal({}, fail, function (row) { taxModalDblClick(row, originalRef) });

        });
        $('.btn-vatcode').on('click', function () {
            var originalRef = $(this);
            CommonService.accountCodeModal({}, fail, function (row) { vatModalDblClick(row, originalRef) });

        });

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

        $("#download").on("click",
            function () {

                var fromDate = $("#FromDate").val();
                var toDate = $("#ToDate").val();
                var branchId = $("#Branchs").val();
                if (branchId === "null") {
                    branchId = null;

                }


                // Validate the date range and branch ID
                if (fromDate === "" || toDate === "" || branchId === "") {
                    alert("Please select both 'from date', 'to date', and 'branch'.");
                    return;
                }

                var url = '/BranchProfile/BranchProfileExcel?fromDate=' + fromDate + '&toDate=' + toDate + '&branchId=' + branchId;
                var Id = $("#Id").val();

                url += '&Id=' + (Id !== null ? Id : 'null');
                var win = window.open(url, '_blank');
            });
        $(".chkAll").click(function () {
            $('.dSelected:input:checkbox').not(this).prop('checked', this.checked);
        });

        $('.btn-BranchCode').on('click', function (e) {
            var originalRef = $(this);
            
            CommonService.profileModal({}, fail, function (row) { modalDblClick(row, originalRef) });

        });

    };

    var GetGridDataList = function (branchId) {
        $(".kTextbox").each(function () {
            $(this).addClass(" k-textbox ");
        });
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
                    url: "/BranchProfile/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false,
                    data: { branchId: branchId }
                },
                parameterMap: function (options) {
                    return options;
                }
            },
            batch: true,
            schema: {
                data: "items",
                total: "totalCount",
                model: {
                   //
                }
            }
        });

        $("#BranchLists").kendoGrid({
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
            excel: {
                fileName: "Branch.xlsx",
                filterable: true
            },
            search: {
                fields: ["branchCode", "branchName"]
            },
            columns: [                
                {
                    title: "Action",
                    width: 60,
                    template: function (dataItem) {
                        return "<a href='/BranchProfile/Edit/" + dataItem.branchID + "' class='btn btn-primary btn-sm mr-2 edit'>" +
                            "<i class='fas fa-pencil-alt'></i>" +
                            "</a>";
                    }
                },

                {
                    field: "branchID", width: 150, hidden: true, sortable: true
                },
                {
                    field: "branchCode", title: "Branch Code", width: 150, sortable: true
                },
                {
                    field: "sageBranchCode", title: "Sage Branch Code", sortable: true, width: 150
                },
                {
                    field: "branchName", title: "Branch Name", sortable: true, width: 200
                },
                {
                    field: "branchLegalName", title: "Branch Legal Name", sortable: true, width: 200
                },
                {
                    field: "address", title: "Address", width: 150, sortable: true
                },
                {
                    field: "city", title: "City", sortable: true, width: 150
                },
                {
                    field: "zipCode", title: "Zip Code", sortable: true, width: 200
                },
                {
                    field: "bin", title: "BIN", sortable: true, width: 200
                },
                {
                    field: "cogsCode", title: "Cogs Code", width: 150, sortable: true
                },
                {
                    field: "taxCode", title: "Tax Code", sortable: true, width: 150
                },
                {
                    field: "vatCode", title: "Vat Code", sortable: true, width: 200
                },
                {
                    field: "companyCode", title: "Company Code", sortable: true, width: 200
                },
                {
                    field: "companyName", title: "Company Name", sortable: true, width: 200
                },
                {
                    field: "companyAddress", title: "Company Address", sortable: true, width: 200
                }

            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            columnMenu: true
        });
    };

    function modalDblClick(row, originalRef) {
        
        var branchcode = row.find("td:first").text();
        var branchName = row.find("td:eq(1)").text();
        var sageBranchCode = row.find("td:eq(2)").text();

        var companyCode = row.find("td:eq(3)").text() || '-';
        var companyName = row.find("td:eq(4)").text() || '-';
        var companyAddress = row.find("td:eq(5)").text() || '-';
        var city = row.find("td:eq(6)").text() || '-';
        var zip = row.find("td:eq(7)").text() || '-';
        var telephoneNo = row.find("td:eq(8)").text() || '-';
        var faxNo = row.find("td:eq(9)").text() || '-';
        var contactPersonTelephone = row.find("td:eq(10)").text() || '-';

        $("#BranchCode").val(branchcode);
        $("#BranchName").val(branchName);
        $("#SageBranchCode").val(sageBranchCode);
        $("#BranchLegalName").val(branchName);

        $("#CompanyCode").val(companyCode);
        $("#CompanyName").val(companyName);
        $("#CompanyAddress").val(companyAddress);
        $("#City").val(city);
        $("#ZIP").val(zip);
        $("#TelephoneNo").val(telephoneNo);
        $("#FaxNo").val(faxNo);
        $("#ContactPersonTelephone").val(contactPersonTelephone);

        $("#accountModal").modal("hide");
    };

    function cogsModalDblClick(row, originalRow) {

        var accountCode = row.find("td:first").text();
        originalRow.closest("div.input-group").find("input").val(accountCode);

        var accountDescription = row.find("td:eq(1)").text();
        /*var customerContract = row.find("td:eq(4)").text();*/

        $("#CogsCodeDescription").val(accountDescription);
        /*$("#Contact").val(customerContract);*/

        $("#accountModal").modal("hide");
        originalRow.closest("div.input-group").find("input").focus();
    }

    function taxModalDblClick(row, originalRow) {

        var accountCode = row.find("td:first").text();
        originalRow.closest("div.input-group").find("input").val(accountCode);

        var accountDescription = row.find("td:eq(1)").text();
        /*var customerContract = row.find("td:eq(4)").text();*/

        $("#TaxCodeDescription").val(accountDescription);
        /*$("#Contact").val(customerContract);*/

        $("#accountModal").modal("hide");
        originalRow.closest("div.input-group").find("input").focus();
    }

    function vatModalDblClick(row, originalRow) {

        var accountCode = row.find("td:first").text();
        originalRow.closest("div.input-group").find("input").val(accountCode);

        var accountDescription = row.find("td:eq(1)").text();
        /*var customerContract = row.find("td:eq(4)").text();*/

        $("#VatCodeDescription").val(accountDescription);
        /*$("#Contact").val(customerContract);*/

        $("#accountModal").modal("hide");
        originalRow.closest("div.input-group").find("input").focus();
    }

    function fail(err) {

        ShowNotification(3, "Something gone wrong");
    }


    function save() {
        
        var validator = $("#frm_Branch").validate();
        var branchProfile = serializeInputs("frm_Branch");

        var result = validator.form();
        if (!result) {
            validator.focusInvalid();
            return;
        }
        

        if ($('#ActiveStatus').prop('checked')) {
            branchProfile.ActiveStatus = true;
        }

        BranchProfileService.save(branchProfile, saveDone, saveFail);
    }
    function saveDone(result) {
        
        if (result.status == "200") {
            if (result.data.operation == "add") {
                ShowNotification(1, result.message);
                $(".btnsave").html('Update');
                $(".btnsave").addClass('sslUpdate');
                $("#BranchID").val(result.data.branchID);
                $("#Code").val(result.data.code);
                result.data.operation = "update";
                $("#Operation").val(result.data.operation);

            } else {
                ShowNotification(1, result.message);
            }
        }
        else if (result.status == "400") {
            ShowNotification(3, result.message); // <-- display the error message here
        }
        else if (result.status == "199") {
            ShowNotification(2, result.message); // <-- display the error message here
        }
    }

    function saveFail(result) {
    
        ShowNotification(3, "Query Exception!");
    }

    return {
        init: init
    }


}(CommonService, BranchProfileService);

