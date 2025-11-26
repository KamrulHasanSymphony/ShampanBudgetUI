var CompanyInfoController = function (CompanyInfoService) {

    var init = function () {

        //var indexConfig = GetIndexTable();
        //var indexTable = $("#BkTransfersLists").DataTable(indexConfig);

        //var indexTable = BpTable();


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

        $("#indexSearch").click(function () {
            indexTable.draw();
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

                var url = '/CompanyInfo/CompanyInfoExcel?fromDate=' + fromDate + '&toDate=' + toDate + '&branchId=' + branchId;
                var Id = $("#Id").val();

                url += '&Id=' + (Id !== null ? Id : 'null');
                var win = window.open(url, '_blank');
            });

        $(".chkAll").click(function () {
            $('.dSelected:input:checkbox').not(this).prop('checked', this.checked);
        });


    }


    var BpTable = function () {

        $('#CompanyLists thead tr')
            .clone(true)
            .addClass('filters')
            .appendTo('#CompanyLists thead');


        var dataTable = $("#CompanyLists").DataTable({
            orderCellsTop: true,
            fixedHeader: true,
            serverSide: true,
            "processing": true,
            "bProcessing": true,
            dom: 'lBfrtip',
            bRetrieve: true,
            searching: false,
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
                url: '/CompanyInfo/_index',
                type: 'POST',

                data: function (payLoad) {
                    return $.extend({},
                        payLoad,
                        {


                            "CompanyName": $("#md-CompanyName").val(),


                            "City": $("#md-City").val(),

                            "Address": $("#md-Address").val(),
                            "TelephoneNo": $("#md-TelephoneNo").val()


                        });
                }
            },
            columns: [

                {
                    data: "companyID",
                    render: function (data) {

                        return "<a href=/CompanyInfo/Edit/" + data + " class='btn btn-primary btn-sm mr-2 edit' >" +

                            "<i class='fas fa-pencil-alt'></i>" +
                            "</a>"
                            ;
                    },
                    "width": "7%",
                    "orderable": false
                }
                ,
                {
                    data: "companyName",
                    name: "CompanyName"
                    //"width": "20%"
                }

                ,
                {
                    data: "address",
                    name: "Address"
                    //"width": "20%"
                }
                ,
                {
                    data: "city",
                    name: "City"
                    //"width": "20%"
                }
                ,
                {
                    data: "telephoneNo",
                    name: "TelephoneNo"
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

        $("#CompanyLists").on("keyup",
            ".acc-filters",
            function () {

                dataTable.draw();

            });

        return dataTable;

    }


    function save() {

        var validator = $("#frm_Company").validate();
        var companyInfo = serializeInputs("frm_Company");

        var result = validator.form();
        if (!result) {
            validator.focusInvalid();
            return;
        }

        CompanyInfoService.save(companyInfo, saveDone, saveFail);
    }
    function saveDone(result) {

        if (result.status == "200") {
            if (result.data.operation == "add") {
                ShowNotification(1, result.message);
                $(".btnsave").html('Update');
                $(".btnsave").addClass('sslUpdate');
                $("#CompanyID").val(result.data.companyID);
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
        ShowNotification(3, "Cannot insert another company.");
    }









    return {
        init: init
    }


}(CompanyInfoService);