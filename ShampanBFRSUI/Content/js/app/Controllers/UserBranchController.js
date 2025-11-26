var UserBranchController = function (CommonService,UserBranchService) {

    var init = function () {
        
        LoadCombo("BranchId", '/UserBranch/UserBranch');
        LoadCombo("UserId", '/UserBranch/UserId');
        var $table = $('#ApItemLists');

        var indexTable = BpTable();

        $('.btn-Items').on('click', function () {
            var originalRef = $(this);            
            var userId = $('#userId').val();
            
            CommonService.profileSetting({}, null, userId);  
        }); 

        $('.btn-Itemsbkp').click('click', function (e) {
            var url = "/UserBranch/UserBranch";
            $.ajax({
                type: 'POST',
                url: url,
                success: function (response) {
                    
                    var selectElement = $("#multiBranchId");
                    selectElement.html("");
                    selectElement.append("<option value='" + '' + "'>" + '--Select--' + "</option>");
                    $.each(response, function (index, data) {
                        selectElement.append("<option value='" + data.name + "'>" + data.value + "</option>");
                    });
                    
                },
                error: function (error) {
                    
                    console.log(error);
                }
            });

        });

        $("#btnAdd").on("click", function () {

            rowAdd(detailTable);

        });

        $('#Post').on('click', function () {

            SelectData(true);

        });

        $("#ModalButtonCloseFooter").click(function () {
            addPrevious(detailTable);
        });

        $("#ModalButtonCloseHeader").click(function () {
            addPrevious(detailTable);
        });


        $('.btnsave').click('click', function () {
            save();
        });

        $("#indexSearch").click(function () {
            indexTable.draw();
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

    };    

    var BpTable = function () {

        $('#userLists thead tr')
            .clone(true)
            .addClass('filters')
            .appendTo('#userLists thead');


        var dataTable = $("#userLists").DataTable({
            orderCellsTop: true,
            fixedHeader: true,
            serverSide: true,
            "processing": true,
            "bProcessing": true,
            dom: 'lBfrtip',
            bRetrieve: true,
            buttons: [
                {
                    extend: 'pdfHtml5',
                    customize: function (doc) {
                        doc.content.splice(0, 0, {
                            text: ""
                        });
                    },
                    exportOptions: {
                        columns: [1, 2, 3, 4]
                    }
                },
                {
                    extend: 'copyHtml5',
                    exportOptions: {
                        columns: [1, 2, 3, 4]
                    }
                },
                {
                    extend: 'excelHtml5',
                    exportOptions: {
                        columns: [1, 2, 3, 4]
                    }
                },
                'csvHtml5'
            ],

            ajax: {
                url: '/UserBranch/_index',
                type: 'POST',
                data: function (payLoad) {
                    return $.extend({},
                        payLoad,
                        {
                            "userName": $("#md-UserName").val(),
                            "branchName": $("#md-BranchName").val(),
                            "BranchCode": $("#md-BranchCode").val(),
                            "ProjectCode": $("#md-ProjectCode").val(),
                            "projectName": $("#md-ProjectName").val(),
                            "userId": $("#userId").val()



                        });
                }
            },
            columns: [

                {
                    data: "id",
                    render: function (data) {

                        return "<a href=/UserBranch/Edit/" + data + " +  class='btn btn-primary btn-sm mr-2 edit' > " +

                        "<i class='fas fa-pencil-alt'></i>" +
                            "</a>"
                            ;
                    },
                    "width": "7%",
                    "orderable": false
                }
                ,
                {
                    data: "userName",
                    name: "UserName"
                    //"width": "20%"
                }
                ,
                {
                    data: "branchCode",
                    name: "branchCode"
                    //"width": "20%"
                }
                ,
                {
                    data: "branchName",
                    name: "BranchName"
                    //"width": "20%"
                }
                


            ]

        });



        if (dataTable.columns().eq(0)) {
            dataTable.columns().eq(0).each(function (colIdx) {
                // Set the header cell to contain the input element
                var cell = $('.filters th').eq($(dataTable.column(colIdx).header()).index());

                var title = $(cell).text();

                // Check if the current header cell has a class of "action"
                if ($(cell).hasClass('action')) {
                    $(cell).html(''); // Set the content of the header cell to an empty string
                } else {
                    $(cell).html('<input type="text" class="acc-filters filter-input"  placeholder="' +
                        title +
                        '"  id="md-' +
                        title.replace(/ /g, "") +
                        '"/>');
                }
            });

        }

        $("#userLists").on("keyup",
            ".acc-filters",
            function () {

                dataTable.draw();

            });

        return dataTable;

    }

    function save() {

        var validator = $("#frm_user").validate();
        var companyInfo = serializeInputs("frm_user");

        var result = validator.form();
        if (!result) {
            validator.focusInvalid();
            return;
        }
        
        UserBranchService.save(companyInfo, saveDone, saveFail);
    }

    function saveDone(result) {
        
        if (result.status == "200") {
            if (result.data.operation == "add") {
                ShowNotification(1, result.message);
                $(".btnsave").html('Update');
                $(".btnsave").addClass('sslUpdate');
                $("#Id").val(result.data.id);
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
        
        
        ShowNotification(3, "User ID has already been assigned to the branch");
    }


    return {
        init: init
    }


}(CommonService, UserBranchService);
