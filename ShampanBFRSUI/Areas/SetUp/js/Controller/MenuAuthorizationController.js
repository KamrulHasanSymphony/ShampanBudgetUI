var MenuAuthorizationController = function (MenuAuthorizationService) {

    var init = function () {

        if ($('.UserRoleId').is(':hidden')) {
            console.log('The field is hidden.');
        }
        else
        {
            if ($("#RoleId").length) {
                var RoleComboBox = $("#RoleId").kendoMultiColumnComboBox({
                    dataTextField: "RoleName",
                    dataValueField: "Id",
                    height: 400,
                    columns: [
                        { field: "RoleName", title: "Role Name", width: 100 },
                    ],
                    filter: "contains",
                    filterFields: ["RoleName"],
                    dataSource: {
                        transport: {
                            read: "/SetUp/MenuAuthorization/GetRoleData"
                        }
                    },
                    change: function (e) {
                        
                    }
                }).data("kendoMultiColumnComboBox");

                //var UserGroupComboBox = $("#RoleId").kendoMultiColumnComboBox({
                //    dataTextField: "GroupName",
                //    dataValueField: "Id",
                //    height: 400,
                //    columns: [
                //        { field: "GroupName", title: "Group Name", width: 100 },
                //    ],
                //    filter: "contains",
                //    filterFields: ["GroupName"],
                //    dataSource: {
                //        transport: {
                //            read: "/SetUp/MenuAuthorization/GetUserGroupData"
                //        }
                //    },
                //    change: function (e) {
                //        
                //    }
                //}).data("kendoMultiColumnComboBox");
            }
        }

        var $table = $('#MenuAccessLists');

        RoleTable();
        UserGroupTable();
        RoleMenuTable();
        UserMenuTable();


        $('.btnRoleSave').on('click', function () {
            roleSave();
        });

        $('.btnUserGroupSave').on('click', function () {
            userGroupSave();
        });

        $('.btnRoleMenuSave').on('click', function () {
            roleMenuSave($table);
        });        

        $('.btnUserMenuSave').on('click', function () {
            userMenuSave($table);
        });
        

        $(".chkAll").click(function () {
            $('.dSelected:input:checkbox').not(this).prop('checked', this.checked);
        });

        $("#ubNew").click(function (sender) {
            
            var userId = $("#userId").val();
            var url = $(this).attr("data-url");
            if (userId) {
                url += "?id=" + userId
            }

            window.location = url;
        });        


        $('#btnRoleSearch').on('click', function () {
            
            var roleId = $('#RoleId').val();
            if (parseInt(roleId) > 0) {
                $("#MenuAccessBody").html('');
                var url = "/MenuAuthorization/GetUserRoleData?roleId=" + roleId;
                btnRoleClick(url);
            }
        });

        $('#btnUserWiseSearch').on('click', function () {
            
            var userId = $('#UserId').val();
            var roleId = $('#RoleId').val();
            if ((userId != "" && userId != null) && (roleId != "" && roleId != null)) {
                $("#UserAccessBody").html('');
                var url = "/MenuAuthorization/GetUserRoleWiseData?roleId=" + roleId;
                btnUserClick(url);
            }
        });

        $('body').on('click', '.mainCheckbox', function (e) {
            
            var menuId = $(this).closest('tr').find('td:nth-child(3)').text().trim();
            var parentId = $(this).closest('tr').find('td:nth-child(2)').text().trim();

            if (isDynamicMenuId(menuId)) {
                
                $('tr').find('td:nth-child(3)').each(function () {

                    if ($(this).text().trim() === parentId) {
                        $(this).closest('tr').find('.mainCheckbox').prop('checked', true);
                    }
                });                
            }
        });


    };

    // ------------------------- Menu Access Block -------------------------------------------
    function isDynamicMenuId(menuId) {
        return menuId === menuId;
    };

    function btnRoleClick(url) {
        
        let htmlData = '';
        $.ajax({
            type: 'POST',
            url: url,
            success: function (response) {
                
                for (var i = 0; i < response.length; i++) {
                    var item = response[i];
                    var dependentCheckboxesHTML = '';

                    if (item.parentId === 0) {
                        dependentCheckboxesHTML = '';
                        //'<td>' +
                        //'<p></p>' +
                        //'</td>' +
                        //'<td>' +
                        //'<p></p>' +
                        //'</td>' +
                        //'<td>' +
                        //'<p></p>' +
                        //'</td>' +
                        //'<td>' +
                        //'<p></p>' +
                        //'</td>';
                    } else {
                        dependentCheckboxesHTML = '';
                        //'<td>' +
                        //'<input type="checkbox" class="dependentCheckbox form-control form-control-sm" name="List" value="' + item.list + '"' + (item.list ? 'checked' : '') + ' />' +
                        //'</td>' +
                        //'<td>' +
                        //'<input type="checkbox" class="dependentCheckbox form-control form-control-sm" name="Insert" value="' + item.insert + '"' + (item.insert ? 'checked' : '') + ' />' +
                        //'</td>' +
                        //'<td>' +
                        //'<input type="checkbox" class="dependentCheckbox form-control form-control-sm" name="Delete" value="' + item.delete + '"' + (item.delete ? 'checked' : '') + ' />' +
                        //'</td>' +
                        //'<td>' +
                        //'<input type="checkbox" class="dependentCheckbox form-control form-control-sm" name="Post" value="' + item.post + '"' + (item.post ? 'checked' : '') + ' />' +
                        //'</td>';
                    }

                    htmlData +=
                        '<tr class="tablerow" id="' + item.menuId + '">' +
                        '<td>' +
                    '<input type="checkbox" id="' + item.parentId + '" class=" ' + item.menuId + ' mainCheckbox form-control form-control-sm"  name="IsChecked" value="' + item.isChecked + '"' + (item.isChecked ? 'checked' : '') + ' />' +
                        '</td>' +
                        '<td hidden>' + item.parentId + '</td>' +
                        '<td hidden>' + item.menuId + '</td>' +
                        '<td>' + item.menuName + '</td>' +
                        dependentCheckboxesHTML +
                        '</tr>';
                }
                $("#MenuAccessBody").html(htmlData);
                querySelector();
            },
            error: function (error) {
                
                console.log(error);
            }
        });
    };

    function btnUserClick(url) {
        
        let htmlData = '';
        $.ajax({
            type: 'POST',
            url: url,
            success: function (response) {
                
                for (var i = 0; i < response.length; i++) {
                    var item = response[i];
                    var dependentCheckboxesHTML = '';

                    if (item.parentId === 0) {
                        dependentCheckboxesHTML = '';
                        //'<td>' +
                        //'<p></p>' +
                        //'</td>' +
                        //'<td>' +
                        //'<p></p>' +
                        //'</td>' +
                        //'<td>' +
                        //'<p></p>' +
                        //'</td>' +
                        //'<td>' +
                        //'<p></p>' +
                        //'</td>';
                    } else {
                        dependentCheckboxesHTML = '';
                        //'<td>' +
                        //'<input type="checkbox" class="dependentCheckbox form-control form-control-sm" name="List" value="' + item.list + '"' + (item.list ? 'checked' : '') + ' />' +
                        //'</td>' +
                        //'<td>' +
                        //'<input type="checkbox" class="dependentCheckbox form-control form-control-sm" name="Insert" value="' + item.insert + '"' + (item.insert ? 'checked' : '') + ' />' +
                        //'</td>' +
                        //'<td>' +
                        //'<input type="checkbox" class="dependentCheckbox form-control form-control-sm" name="Delete" value="' + item.delete + '"' + (item.delete ? 'checked' : '') + ' />' +
                        //'</td>' +
                        //'<td>' +
                        //'<input type="checkbox" class="dependentCheckbox form-control form-control-sm" name="Post" value="' + item.post + '"' + (item.post ? 'checked' : '') + ' />' +
                        //'</td>';
                    }

                    htmlData +=
                        '<tr class="tablerow" id="' + item.MenuId + '">' +
                        '<td>' +
                    '<input type="checkbox" id="' + item.ParentId + '" class="mainCheckbox form-control form-control-sm" name="IsChecked" value="' + item.IsChecked + '"' + (item.IsChecked ? 'checked' : '') + ' />' +
                        '</td>' +
                    '<td hidden>' + item.ParentId + '</td>' +
                    '<td hidden>' + item.MenuId + '</td>' +
                        '<td>' + item.MenuName + '</td>' +
                        dependentCheckboxesHTML +
                        '</tr>';
                }
                $("#UserAccessBody").html(htmlData);
                querySelector();
            },
            error: function (error) {
                
                console.log(error);
            }
        });
    };

    function querySelector() {
        
        document.querySelectorAll('.mainCheckbox').forEach(function (mainCheckbox) {
            var dependentCheckboxes = mainCheckbox.closest('.tablerow').querySelectorAll('.dependentCheckbox');
            function updateDependentCheckboxes() {
                dependentCheckboxes.forEach(function (depCheckbox) {
                    depCheckbox.disabled = !mainCheckbox.checked;
                    if (!mainCheckbox.checked) {
                        depCheckbox.checked = false;
                    }
                });
            }
            updateDependentCheckboxes();
            mainCheckbox.addEventListener('change', function () {
                updateDependentCheckboxes();
            });
        });
    };

    // ------------------------- Menu Access Block -------------------------------------------

    //////// Index Grid  /////////////

    var RoleTable = function () {
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
                    url: '/SetUp/MenuAuthorization/RoleIndex',
                    type: "POST",
                    dataType: "json",
                    cache: false
                },
                parameterMap: function (options) {
                    if (options.sort) {
                        options.sort.forEach(function (param) {                            
                            if (param.field === "Name") {
                                param.field = "H.Name";
                            }
                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {                           
                            if (param.field === "Name") {
                                param.field = "H.Name";
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

        $("#RoleIndexDataList").kendoGrid({
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
            toolbar: ["excel", "pdf"],
            excel: {
                fileName: `Roles_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.xlsx`,
                filterable: true
            }, 
            columns: [                
                {
                    title: "Action",
                    width: 20,
                    template: function (dataItem) {
                        return `
                                <a href="/SetUp/MenuAuthorization/RoleEdit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                                    <i class="fas fa-pencil-alt"></i>
                                </a>`;
                    }
                },
                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "Name", title: "Name", sortable: true, width: 300 },               
            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            columnMenu: true
        });

    };

    var UserGroupTable = function () {
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
                    url: '/SetUp/MenuAuthorization/UserGroupIndex',
                    type: "POST",
                    dataType: "json",
                    cache: false
                },
                parameterMap: function (options) {
                    if (options.sort) {
                        options.sort.forEach(function (param) {
                            if (param.field === "Name") {
                                param.field = "H.Name";
                            }
                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {
                            if (param.field === "Name") {
                                param.field = "H.Name";
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

        $("#UserGroupIndexDataList").kendoGrid({
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
            toolbar: ["excel", "pdf"],
            excel: {
                fileName: `UserGroup_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.xlsx`,
                filterable: true
            }, 
            columns: [
                {
                    title: "Action",
                    width: 25,
                    template: function (dataItem)
                    {
                        return "<a href='/SetUp/MenuAuthorization/UserGroupEdit/" + dataItem.Id + "' class='btn btn-primary btn-sm mr-2 edit' title='Modify'>" +
                            "<i class='fas fa-pencil-alt'></i>" +
                            "</a>" +
                            "<a style='background-color: darkgreen;' href='#' onclick='editEntry(\"" + dataItem.Id + "\")' class='btn btn-success btn-sm mr-2 edit ' title='Menu Set'><i class='fas fa-file-invoice'></i></a>";
                    }
                },
                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "Name", title: "Name", sortable: true, width: 300 },
            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            columnMenu: true
        });

    };

    var RoleMenuTable = function () {
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
                    url: '/SetUp/MenuAuthorization/RoleMenuIndex',
                    type: "POST",
                    dataType: "json",
                    cache: false
                },
                parameterMap: function (options) {
                    if (options.sort) {
                        options.sort.forEach(function (param) {
                            if (param.field === "Name") {
                                param.field = "H.Name";
                            }
                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {
                            if (param.field === "Name") {
                                param.field = "H.Name";
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

        $("#RoleMenuIndexDataList").kendoGrid({
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
            toolbar: ["excel", "pdf"],
            excel: {
                fileName: `RoleMenu_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.xlsx`,
                filterable: true
            },      
            columns: [
                {
                    title: "Action",
                    width: 20,
                    template: function (dataItem) {
                        return `
                                <a href="/SetUp/MenuAuthorization/RoleMenuEdit/${dataItem.Id}" class="btn btn-primary btn-sm mr-2 edit">
                                    <i class="fas fa-pencil-alt"></i>
                                </a>`;
                    }
                },
                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "Name", title: "Name", sortable: true, width: 300 },
            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            columnMenu: true
        });

    };

    var UserMenuTable = function () {
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
                    url: '/SetUp/MenuAuthorization/UserMenuIndex',
                    type: "POST",
                    dataType: "json",
                    cache: false
                },
                parameterMap: function (options) {
                    if (options.sort) {
                        options.sort.forEach(function (param) {
                            if (param.field === "Name") {
                                param.field = "H.Name";
                            }
                        });
                    }

                    if (options.filter && options.filter.filters) {
                        options.filter.filters.forEach(function (param) {
                            if (param.field === "Name") {
                                param.field = "H.Name";
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

        $("#UserMenuIndexDataList").kendoGrid({
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
            toolbar: ["excel", "pdf"],
            excel: {
                fileName: `UserMenu_${new Date().toISOString().split('T')[0]}_${new Date().toTimeString().split(' ')[0]}.${new Date().getMilliseconds()}.xlsx`,
                filterable: true
            }, 
            columns: [
                {
                    title: "Action",
                    width: 20,
                    template: function (dataItem) {
                        const roleId = dataItem.RoleId || '';  // Use an empty string if RoleId is undefined
                        const userId = dataItem.UserId || '';
                        return `
                        <a href="/SetUp/MenuAuthorization/UserMenuEdit?roleId=${roleId}&userId=${userId}" 
                           class="btn btn-primary btn-sm mr-2 edit">
                            <i class="fas fa-pencil-alt"></i>
                        </a>`;
                    }
                },
                { field: "Id", width: 50, hidden: true, sortable: true },
                { field: "UserId", title: "User Id", sortable: true, width: 150 },
                { field: "RoleName", title: "Role Name", sortable: true, width: 150 },
            ],
            editable: false,
            selectable: "row",
            navigatable: true,
            columnMenu: true
        });

    };

    //////// Index Grid  /////////////

    function roleSave() {
        
        var validator = $("#frm_role").validate();
        var data = serializeInputs("frm_role");
        var result = validator.form();
        if (!result) {
            validator.focusInvalid();
            return;
        }

        var operation = $("#Operation").val();

        Confirmation("Are you sure? Do You Want to " + operation + " Data?",
            function (result) {
                if (result) {

                    MenuAuthorizationService.roleSave(data, roleSaveDone, saveFail);
                }
            });
    };

    function userGroupSave() {
        
        var validator = $("#frm_userGroup").validate();
        var data = serializeInputs("frm_userGroup");
        var result = validator.form();
        if (!result) {
            validator.focusInvalid();
            return;
        }

        var operation = $("#Operation").val();

        Confirmation("Are you sure? Do You Want to " + operation + " Data?",
            function (result) {
                if (result) {

                    MenuAuthorizationService.userGroupSave(data, roleSaveDone, saveFail);
                }
            });
    };

    function roleMenuSave($table) {
        
        var validator = $("#frm_UserAccess").validate();
        var model = serializeInputs("frm_UserAccess");

        var details = serializeTablesData($table);


        var isCheckedOverall = details.some(item => item.IsChecked === true);
        if (isCheckedOverall === false) {
            ShowNotification(3, "Please Select CheckBox First!");
            return;
        }


        var result = validator.form();
        if (!result) {
            validator.focusInvalid();
            return;
        }
        
        model.roleMenuList = details;

        Confirmation("Are you sure? Do You Want to Submit Data?",
            function (result) {
                if (result) {

                    if (parseInt(model.UserGroupId) == 0)
                    {
                        MenuAuthorizationService.save(model, saveDone, saveFail);
                    }
                    else if (parseInt(model.UserGroupId) > 0) {
                        MenuAuthorizationService.userGroupMenuSave(model, saveDone, saveFail);
                    }
                    
                }
            });        
    };

    function userMenuSave($table) {
        
        var validator = $("#frm_UserAccess").validate();
        var data = serializeInputs("frm_UserAccess");

        var details = serializeTablesData($table);

        var isCheckedOverall = details.some(item => item.IsChecked === true);
        if (isCheckedOverall === false) {
            ShowNotification(3, "Please Select CheckBox First!");
            return;
        }

        var result = validator.form();
        if (!result) {
            validator.focusInvalid();
            return;
        }

        data.userMenuList = details;
        Confirmation("Are you sure? Do You Want to Submit Data?",
            function (result) {
                if (result) {

                    MenuAuthorizationService.userMenuSave(data, saveDone, saveFail);
                }
            });

    };   
    

    function serializeTablesData($table) {
        var data = [];
        $table.find('tbody tr').each(function () {
            var row = {};
            $(this).find('input[type="checkbox"], input[type="text"], select').each(function () {
                if (this.type === 'checkbox') {
                    row[$(this).attr('name')] = this.checked; // Check if checkbox is checked
                } else {
                    row[$(this).attr('name')] = $(this).val();
                }
            });

            // Retrieve the MenuId value from the hidden td
            var menuIdValue = $(this).find('td:nth-child(3)').text().trim(); // Assuming MenuId td is the second td in each row

            // Add MenuId to the row
            row['MenuId'] = menuIdValue;

            data.push(row);
        });
        
        return data;
    };    

    function saveDone(result) {
        
        if (result.Status == "200") {
            if (result.Data.Operation == "add") {
                ShowNotification(1, result.Message);
                $("#Id").val(result.Data.Id);
                result.Data.Operation = "update";
                $("#Operation").val(result.Data.Operation);

            } else {
                ShowNotification(1, result.Message);
            }
        }
        else if (result.Status == "400") {
            ShowNotification(3, result.Message); 
        }
        else if (result.Status == "199") {
            ShowNotification(2, result.Message); 
        }
    };

    function roleSaveDone(result) {
        
        if (result.Status == "200") {
            if (result.Data.Operation == "add") {
                ShowNotification(1, result.Message);
                $(".divSave").hide();
                $(".divUpdate").show();
                $("#Id").val(result.Data.Id);
                result.Data.Operation = "update";
                $("#Operation").val(result.Data.Operation);
                $("#CreatedBy").val(result.Data.CreatedBy);
                $("#CreatedOn").val(result.Data.CreatedOn);
            }
            else {
                ShowNotification(1, result.Message);
                $("#LastModifiedBy").val(result.Data.CreatedBy);
                $("#LastModifiedOn").val(result.Data.CreatedOn);
            }
        }
        else if (result.Status == "400") {
            ShowNotification(3, result.Message);
        }
        else if (result.Status == "199") {
            ShowNotification(2, result.Message);
        }
    };

    function saveFail(result) {        
        
        ShowNotification(3, result.statusText);
    };


    return {
        init: init
    }


}(MenuAuthorizationService);



function editEntry(id) {
    
    var form = document.createElement("form");
    form.setAttribute("method", "GET");
    form.setAttribute("action", "/SetUp/MenuAuthorization/UserGroupMenuEdit");

    var input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", "id");

    input.setAttribute("value", id);
    form.appendChild(input);
   

    document.body.appendChild(form);
    form.submit();
    form.remove();
};
