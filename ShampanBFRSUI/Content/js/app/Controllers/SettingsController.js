var SettingsController = function (SettingsService) {


    

    var init = function () {

        if ($("#Branchs").length) {
            LoadCombo("Branchs", '/Common/Branch');

        }
        var indexTable = GlBatchTable();



        $("#indexSearch").click(function () {
            var data = $("#Branchs").val();
            if (data == "xx") {
                ShowNotification(3, "Please Select Branch Type First");
                return;
            }
            indexTable.draw();
        });

        $('.btnSave').click('click', function () {
            saveBatch();
        });

        // var indexConfig = GetIndexTable();
        // var indexTable = $("#GLBatchLists").DataTable(indexConfig);
    
    }



    function saveBatch() {

        var validator = $("#frm_GLBatch").validate();
        var glbatch = serializeInputs("frm_GLBatch");

        var result = validator.form();
        if (!result) {
            validator.focusInvalid();
            return;
        }

        APInvoiceService.saveBatch(glbatch, saveDone, saveFail);
    }
    function saveDone(result) {

        if (result.status == "200") {
            if (result.data.operation == "add") {
                ShowNotification(1, result.message);
                $(".btnSave").html('Update');
                $(".btnSave").addClass('sslUpdate');
                $("#Id").val(result.data.id);
                $("#SageBatchNo").val(result.data.sageBatchNo);
                $("#Id").val(result.data.id);
                $("#BranchId").val(result.data.branchId);
                result.data.operation = "update";
                $("#Operation").val(result.data.operation);

            } else {
                ShowNotification(1, result.message);
            }
        }
        else if (result.status == "400") {
            ShowNotification(3, result.error || result.message); // <-- display the error message here
        }
        else if (result.status == "199") {
            ShowNotification(1, result.message); // <-- display the error message here
        }
    }
    function saveFail(result) {
        if (result.status == "500") {
            ShowNotification(3, "Update cannot be performed because the data has already been pushed."); // <-- display the error message here
        }
        else {


            
            ShowNotification(3, "Something gone wrong");
        }
    }




    var GlBatchTable = function () {

        $('#GLBatchLists thead tr')
            .clone(true)
            .addClass('filters')
            .appendTo('#GLBatchLists thead');


        var dataTable = $("#GLBatchLists").DataTable({
            orderCellsTop: true,
            fixedHeader: true,
            serverSide: true,
            "processing": true,
             searching: false,

            ajax: {
                url: '/APInvoiceBatchList/_index',
                type: 'POST',
                data: function (payLoad) {
                    return $.extend({},
                        payLoad,
                        {
                            "indexsearch": $("#Branchs").val(),
                            "branchid": $("#CurrentBranchId").val(),

                             "batchid": $("#BATCHID").val()


                            , "SageBatchNo": $("#md-SageBatchNo").val()
                            , "SourceCode": $("#md-SourceCode").val()
                            , "sageBatchDescription": $("#md-SageBatchDescription").val()
                            , "BranchLegalName": $("#md-BranchLegalName").val()


                        });
                }
            },
            columns: [

                {
                    data: "id",
                    render: function (data, type, row) {

                        return "<a href=/APInvoiceBatchList/Edit/" + data + " class='edit' ><i class='editIcon'title='Edit Batch' data-toggle='tooltip' title='' data-original-title='Edit'></i></a>&nbsp;&nbsp;&nbsp;" +
                            "<a href='#' onclick='editEntry(\"" + row.sageBatchNo + "\")' class='edit' title='Payments'><i class='fas fa-file-invoice'></i></a>"
                            ;


                       
                    },
                    "width": "5%",
                    "orderable": false
                },
                {
                    "width": "20%",
                    data: "sageBatchNo",
                    name: "SageBatchNo"

                }
                ,
               

                {
                    "width": "20%",
                    data: "sageBatchDescription",
                    name: "SageBatchDescription"

                }
                
                ,
                {
                    "width": "20%",
                    data: "type",
                    name: "Type"

                },
                {
                    "width": "20%",
                    data: "status",
                    name: "Status"

                }
                
               
                ,
                {
                    "width": "20%",
                    data: "branchLegalName",
                    name: "BranchLegalName"
                  
                }

                
                

            ]

        }
        );


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



        $("#GLBatchLists").on("keyup",
            ".acc-filters",
            function () {

                dataTable.draw();

            });
       

        return dataTable;

    }


    //var editEntry = function (batchId) {
    //    // Logic for editing the entry with the given batchId
    //    console.log("Edit entry with batchId", batchId);
    //};


     
    return {
        init: init,
    }


}(SettingsService);
function editEntry(id) {
    //window.location.href = '/GLJournalEntry/Index?Id=' + id;
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "/APInvoice/Index");

    // Create a hidden input field for the batch ID
    var input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", "SageBatchNo");

    input.setAttribute("value", id.toString());
    form.appendChild(input);

    // Submit the form
    document.body.appendChild(form);
    form.submit();
    form.remove();
}