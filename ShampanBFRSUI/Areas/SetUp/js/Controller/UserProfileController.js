var UserProfileController = function (CommonAjaxService) {

    var getSalePersonId = 0;

    var init = function () {

        getSalePersonId = $("#SalePersonId").val() || 0;

        var getId = $("#Id").val() || 0;
        var getOperation = $("#Operation").val() || '';
        if (parseInt(getId) == 0 && getOperation == '') {
            GetGridDataList();
        }
        else
        {
            GetSalePersonComboBox();
        }  

        $("#IsSalePerson").on('switchChange.bootstrapSwitch', function (event, state) {
            if (state)
            {
                $('.salePerson').show();                
            }
            else
            {
                $('.salePerson').hide();
            }
        });



        $('.btnsave').click('click', function () {
            var getId = $('#Id').val();
            var status = "Save";
            if (getId != '') {
                status = "Update";
            }
            if (!CommonValidationHelper.CheckValidation("#frmEntry")) return;
            Confirmation("Are you sure? Do You Want to " + status + " Data?",

                function (result) {
                    if (result) {
                        save();
                    }
                });
        });
       

    };

    function GetSalePersonComboBox() {
        if ($('#IsSalePerson').prop('checked')) {
            $('.salePerson').show();
        }
        var SalePersonComboBox = $("#SalePersonId").kendoMultiColumnComboBox({
            dataTextField: "Name",
            dataValueField: "Id",
            height: 400,
            columns: [
                { field: "Code", title: "Code", width: 100 },
                { field: "Name", title: "Name", width: 150 },
                { field: "BanglaName", title: "BanglaName", width: 200 },
            ],
            filter: "contains",
            filterFields: ["Code", "Name", "BanglaName"],
            dataSource: {
                transport: {
                    read: "/Common/Common/GetSalePersonList"
                }
            },
            placeholder: "Select Person",
            value: "",
            dataBound: function (e) {
                if (getSalePersonId) {
                    this.value(parseInt(getSalePersonId));
                }
            },
            change: function (e) {
                
            }
        }).data("kendoMultiColumnComboBox");
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
                    url: "/SetUp/UserProfile/GetGridData",
                    type: "POST",
                    dataType: "json",
                    cache: false
                },
                parameterMap: function (options) {
                    return options;
                }
            },
            batch: true,
            schema: {
                data: "Items",
                total: "TotalCount",
                model: {
                    fields: {

                    }
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
                        gt: "Is greater then",
                        lt: "Is less then"
                    }
                }
            },
            sortable: true,
            resizable: true,
            reorderable: true,
            groupable: true,
            toolbar: ["excel", "pdf"],
            excel: {
                fileName: "UserList.xlsx",
                filterable: true
            },
            columns: [
                {
                    title: "Action",
                    width: 50,
                    template: function (dataItem) {
                        return "<a href='/SetUp/UserProfile/Edit?id="+ dataItem.Id +"&mode=profileupdate' class='btn btn-primary btn-sm mr-2 edit' title='profile update'>" +
                            "<i class='fas fa-pencil-alt'></i>" +
                            "</a>" +
                            "<a href='/SetUp/UserProfile/Edit?id=" + dataItem.Id +"&mode=passwordchange' class='btn btn-secondary btn-sm mr-2 edit' title='password change'>" +
                            "<i class='fas fa-key'></i>" +
                            "</a>" +
                            "<a href='/SetUp/UserBranchProfile/Index/" + dataItem.Id + " ' class='btn btn-success btn-sm mr-2 edit' title='branch mapping'>" +
                            "<i class='fas fa-building'></i>" +
                            "</a>";
                    }
                },

                {
                    field: "Id", width: 50, hidden: true, sortable: true
                },
                {
                    field: "UserName", title: "User Name", sortable: true, width: 100
                },
                {
                    field: "FullName", title: "Full Name", sortable: true, width: 250
                } 
            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            columnMenu: true
        });

    };

    function save() {
        
        var validator = $("#frmEntry").validate();
        var model = serializeInputs("frmEntry");
        model.CurrentPassword = model.Password;
        var result = validator.form();
        if (!result) {
            validator.focusInvalid();
            return;
        }

        if ($('#IsSalePerson').prop('checked')) {
            model.IsSalePerson = true;
        }
        if ($('#IsHeadOffice').prop('checked')) {
            model.IsHeadOffice = true;
        }

        var url = "/SetUp/UserProfile/CreateEdit";

        CommonAjaxService.finalSave(url, model, saveDone, saveFail);
    };   

    function saveInformation(model) {       
        debugger;
        model.UserId = model.Id;
        model.UserName = model.UserName;
        model.FullName = model.FullName;
        model.DepartmentId = 1;

        var url = "/SetUp/UserProfile/UserInformationsInsert";

        CommonAjaxService.finalSave(url, model, saveDonex, saveFail);
    }; 
    function saveDone(result) {
        
        if (result.Status == 200) {
            
            if (result.Data.Operation == "add") {
                ShowNotification(1, result.Message);
                $(".divSave").hide();
                $(".divUpdate").show();
                $("#Id").val(result.Data.Id);
                $("#UserName").val(result.Data.UserName);
                $("#Operation").val("update");
                $("#Mode").val("profileupdate");
                $('#UserName').prop('disabled', true);
                debugger;
                saveInformation(result.Data);
                
                setTimeout(function () {
                    window.location.href = "/SetUp/UserProfile/Edit?id=" + result.Data.Id +"&mode=profileupdate";
                }, 700);
                
                
            }
            else {
                ShowNotification(1, result.Message);
            }
        }
        else if (result.Status == 400) {
            ShowNotification(3, result.Message);
        }
        else {
            ShowNotification(2, result.Message);
        }
    };
    function saveDonex(result) {

        if (result.Status == 200) {

            if (result.Data.Operation == "add") {
                ShowNotification(1, result.Message);
                $(".divSave").hide();
                $(".divUpdate").show();
                $("#Id").val(result.Data.Id);
                $("#UserName").val(result.Data.UserName);
                $("#Operation").val("update");
                $("#Mode").val("profileupdate");
                $('#UserName').prop('disabled', true);
                debugger;
                //saveInformation(result.Data);

                setTimeout(function () {
                    window.location.href = "/SetUp/UserProfile/Edit?id=" + result.Data.Id + "&mode=profileupdate";
                }, 700);


            }
            else {
                ShowNotification(1, result.Message);
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
   

    return {
        init: init
    }


}(CommonAjaxService);

