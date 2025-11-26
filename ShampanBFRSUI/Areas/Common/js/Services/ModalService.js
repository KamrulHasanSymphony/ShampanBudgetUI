var ModalService = function () {


    var customerNumberModal = function (done, fail, dblCallBack) {

        $.ajax({
            url: '/Common/customerNumberModal',
            method: 'get'

        })
            .done(onSuccess)
            .fail(onFail);



        var doublClick = function (callBack) {

            $("#CustomerNumberModal").on("dblclick",
                "tr",
                function () {

                    if (typeof callBack == "function") {
                        callBack($(this));
                    }
                });

        }

        var formatTable = function () {

            //$('#CustomerNumberModal thead tr')
            //    .clone(true)
            //    .addClass('filters')
            //    .appendTo('#CustomerNumberModal thead');


            var dataTable = $("#CustomerNumberModal").DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                "processing": true,
                ajax: {
                    url: '/Common/_customerNumberModal',
                    type: 'POST',
                    data: function (payLoad) {
                        return $.extend({},
                            payLoad,
                            {
                                
                            });
                    }
                },
                columns: [

                    {
                        data: "customerNo",
                        name: "CustomerNo",
                    }
                    ,
                    {
                        data: "customerName",
                        name: "CustomerName"
                    }
                    ,
                    {
                        data: "onHold",
                        name: "OnHold"
                    }
                    ,
                    {
                        data: "status",
                        name: "Status"
                    }
                    ,
                    {
                        data: "contract",
                        name: "Contract"
                    }
                    ,
                    {
                        data: "customerDescription",
                        name: "CustomerDescription"
                    }
                    

                ]

            });


            //dataTable
            //    .columns()
            //    .eq(0)
            //    .each(function (colIdx) {
            //        // Set the header cell to contain the input element
            //        var cell = $('.filters th').eq(
            //            $(dataTable.column(colIdx).header()).index()
            //        );
            //        var title = $(cell).text();
            //        $(cell).html('<input type="text" class="acc-filters filter-input"  placeholder="' +
            //            title +
            //            '"  id="md-' +
            //            title.replace(/ /g, "") +
            //            '"/>');

            //    });


            $("#CustomerNumberModal").on("keyup",
                ".acc-filters",
                function () {



                    dataTable.draw();
                });

            return dataTable;

        }


        function onSuccess(result) {
            
            showModal(result);

            if (typeof done == "function") {
                done(result);

            }

            doublClick(dblCallBack);

            formatTable();
        }


        function onFail(result) {
            fail(result);
        }


        function showModal(html) {
            
            $("#customerModal").html(html);

            $('.draggable').draggable({
                handle: ".modal-header"
            });

            $("#customerModal").modal("show");
        }
    };


    return {
      
         customerNumberModal: customerNumberModal
    }

}();