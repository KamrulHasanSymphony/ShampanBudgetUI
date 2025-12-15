var CommonService = function () {

    var customerCodeModal = function (done, fail, dblCallBack, closeCallback) {
        var modalId = "#partialModal";
        var dataTableId = "#modalData";

        function showModal(html) {
            $(modalId).html(html);
            $('.draggable').draggable({
                handle: ".modal-header"
            });
            $(modalId).modal("show");
        }

        function onSuccess(result) {
            showModal(result);

            if (typeof done === "function") {
                done(result);
            }

            bindDoubleClick(dblCallBack);
            bindModalClose(closeCallback);
            initializeDataTable();
        }

        function onFail(result) {
            if (typeof fail === "function") {
                fail(result);
            }
        }

        function bindDoubleClick(callBack) {
            $(dataTableId).off("dblclick").on("dblclick", "tr", function () {
                if (typeof callBack === "function") {
                    callBack($(this));
                }
            });
        }

        function bindModalClose(closeCallback) {
            $(modalId).off("hidden.bs.modal").on("hidden.bs.modal", function () {
                if (typeof closeCallback === "function") {
                    closeCallback();
                }
                $(modalId).html("");
            });
        }

        function initializeDataTable() {
            if ($.fn.DataTable.isDataTable(dataTableId)) {
                $(dataTableId).DataTable().destroy();
            }

            $(dataTableId).DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                processing: true,
                ajax: {
                    url: '/Common/Common/_getCustomerData',
                    type: 'POST',
                    data: function (d) {

                    },
                    error: function (xhr, error, thrown) {
                        console.error("AJAX Error:", error, thrown);
                        console.error("Response:", xhr.responseText);
                    }
                },
                columns: [
                    { data: "CustomerId", visible: false },
                    { data: "CustomerCode", title: "Customer Code", width: '10%' },
                    { data: "CustomerName", title: "Customer Name", width: '15%' },
                    { data: "BanglaName", title: "Customer Bangla Name", width: '15%' },
                    { data: "Status", title: "Status", width: '10%' }
                ],
                columnDefs: [
                    { width: '30%', targets: 0 }
                ],
            });
        }

        $.ajax({
            url: '/Common/Common/GetCustomerData',
            method: 'get',
        }).done(onSuccess).fail(onFail);
    };

    var branchLoading = function (done, fail, userId) {
        $.ajax({
            url: '/Common/Common/BranchLoading?UserId=' + userId,
            method: 'get'
        })
            .done(onSuccess)
            .fail(onFail);

        function onSuccess(result) {
            showModal(result);
        }
        function onFail(result) {
            fail(result);
        }
        function showModal(html) {
            $("#partialModal").html(html);
            $('.draggable').draggable({
                handle: ".modal-header"
            });
            $("#partialModal").modal("show");
        }
    };

    var productModal = function (done, fail, dblCallBack, closeCallback) {
        var modalId = "#partialModal";
        var dataTableId = "#modalData";
        function showModal(html) {
            $(modalId).html(html);
            $('.draggable').draggable({
                handle: ".modal-header"
            });
            $(modalId).modal("show");
        }

        function onSuccess(result) {
            showModal(result);

            if (typeof done === "function") {
                done(result);
            }
            debugger;
            bindDoubleClick(dblCallBack);
            bindModalClose(closeCallback);
            initializeDataTable();
        }

        function onFail(result) {
            if (typeof fail === "function") {
                fail(result);
            }
        }

        function bindDoubleClick(callBack) {
            $(dataTableId).off("dblclick").on("dblclick", "tr", function () {
                if (typeof callBack === "function") {
                    callBack($(this));
                }
            });
        }

        function bindModalClose(closeCallback) {
            $(modalId).off("hidden.bs.modal").on("hidden.bs.modal", function () {
                if (typeof closeCallback === "function") {
                    closeCallback();
                }
                $(modalId).html("");
            });
        }

        function initializeDataTable() {

            if ($.fn.DataTable.isDataTable(dataTableId)) {                
                $(dataTableId).DataTable().clear().destroy();
            }
            debugger;
            $(dataTableId).DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                processing: true,
                ajax: {
                    url: '/Common/Common/GetProductData',
                    type: 'POST',
                    data: function (d) {
                        console.log(d);
                        d.FromDate = $('#FromDate').val();
                    },
                    error: function (xhr, error, thrown) {
                        console.error("AJAX Error:", error, thrown);
                        console.error("Response:", xhr.responseText);
                    }
                },
                columns: [
                    { data: "ProductId", visible: false },
                    { data: "ProductCode", title: "Product Code", width: '10%' },
                    { data: "ProductName", title: "Product Name", width: '15%' },
                    { data: "Description", title: "Description", width: '8%' },
                    { data: "Status", title: "Status", width: '8%' }
                ],
                columnDefs: [
                    { width: '10%', targets: 0 }
                ],
            });
        }

        $.ajax({
            url: '/Common/Common/_getProductModal',
            method: 'get',
        }).done(onSuccess).fail(onFail);
    };


    var ItemMesurementModal = function (done, fail, dblCallBack, closeCallback) {
        debugger;
        var modalId = "#partialModal";
        var dataTableId = "#modalData";
        function showModal(html) {
            $(modalId).html(html);
            $('.draggable').draggable({
                handle: ".modal-header"
            });
            $(modalId).modal("show");
        }

        function onSuccess(result) {
            showModal(result);

            if (typeof done === "function") {
                done(result);
            }
            debugger;
            bindDoubleClick(dblCallBack);
            bindModalClose(closeCallback);
            initializeDataTable();
        }

        function onFail(result) {
            if (typeof fail === "function") {
                fail(result);
            }
        }

        function bindDoubleClick(callBack) {
            $(dataTableId).off("dblclick").on("dblclick", "tr", function () {
                if (typeof callBack === "function") {
                    callBack($(this));
                }
            });
        }

        function bindModalClose(closeCallback) {
            $(modalId).off("hidden.bs.modal").on("hidden.bs.modal", function () {
                if (typeof closeCallback === "function") {
                    closeCallback();
                }
                $(modalId).html("");
            });
        }

        function initializeDataTable() {

            if ($.fn.DataTable.isDataTable(dataTableId)) {
                $(dataTableId).DataTable().clear().destroy();
            }
            debugger;
            $(dataTableId).DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                processing: true,
                ajax: {
                    url: '/Common/Common/GetMesurementData',
                    type: 'POST',
                    data: function (d) {
                        console.log(d);
                        d.FromDate = $('#FromDate').val();
                    },
                    error: function (xhr, error, thrown) {
                        console.error("AJAX Error:", error, thrown);
                        console.error("Response:", xhr.responseText);
                    }
                },
                columns: [
                    { data: "Id", visible: false },
                    { data: "Code", title: "Measurement Code", width: '10%' },
                    { data: "Name", title: "Measurement Name", width: '15%' },
                    { data: "Remarks", title: "Remarks", width: '8%' },
                    { data: "Status", title: "Status", width: '8%' }
                ],
                columnDefs: [
                    { width: '10%', targets: 0 }
                ],
            });
        }

        $.ajax({
            url: '/Common/Common/_getMeasurementModal',
            method: 'get',
        }).done(onSuccess).fail(onFail);
    };

    var ItemModal = function (done, fail, dblCallBack, closeCallback) {
        debugger;
        var modalId = "#partialModal";
        var dataTableId = "#modalData";
        function showModal(html) {
            $(modalId).html(html);
            $('.draggable').draggable({
                handle: ".modal-header"
            });
            $(modalId).modal("show");
        }

        function onSuccess(result) {
            showModal(result);

            if (typeof done === "function") {
                done(result);
            }
            debugger;
            bindDoubleClick(dblCallBack);
            bindModalClose(closeCallback);
            initializeDataTable();
        }

        function onFail(result) {
            if (typeof fail === "function") {
                fail(result);
            }
        }

        function bindDoubleClick(callBack) {
            $(dataTableId).off("dblclick").on("dblclick", "tr", function () {
                if (typeof callBack === "function") {
                    callBack($(this));
                }
            });
        }

        function bindModalClose(closeCallback) {
            $(modalId).off("hidden.bs.modal").on("hidden.bs.modal", function () {
                if (typeof closeCallback === "function") {
                    closeCallback();
                }
                $(modalId).html("");
            });
        }

        function initializeDataTable() {

            if ($.fn.DataTable.isDataTable(dataTableId)) {
                $(dataTableId).DataTable().clear().destroy();
            }
            debugger;
            $(dataTableId).DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                processing: true,
                ajax: {
                    url: '/Common/Common/GetItemData',
                    type: 'POST',
                    data: function (d) {
                        console.log(d);
                        d.FromDate = $('#FromDate').val();
                    },
                    error: function (xhr, error, thrown) {
                        console.error("AJAX Error:", error, thrown);
                        console.error("Response:", xhr.responseText);
                    }
                },
                columns: [
                    { data: "Id", visible: false },
                    { data: "CategoryId", title: "Category", width: "8%", visible: false },
                    { data: "UomId", title: "UomId", width: "8%", visible: false },
                    { data: "UomName", title: "UomName", width: "8%", visible: false },
                    { data: "Code", title: "Item Code", width: "10%", visible: false },
                    { data: "Name", title: "Item Name", width: "15%" },
                    { data: "NameInBangla", title: "Name (Bangla)", width: "15%" },
                    { data: "ArticleNo", title: "Article No", width: "8%", visible: false },
                    { data: "Description", title: "Description", width: "15%", visible: false },
                    { data: "CostPrice", title: "Cost Price", width: "8%", className: "text-right", visible: false },
                    { data: "SalesPrice", title: "Sales Price", width: "8%", className: "text-right", visible: false },
                    { data: "SalesPriceDiscount", title: "Sales Discount", width: "8%", className: "text-right", visible: false },
                    { data: "MakingCharge", title: "Making Charge", width: "8%", className: "text-right" },
                    { data: "MakingChargeDiscount", title: "Making Charge Discount", width: "10%", className: "text-right" },
                    { data: "IncludeVAT", title: "Include VAT", width: "6%", visible: false },
                    { data: "VATRate", title: "VAT Rate", width: "6%", className: "text-right" },
                    { data: "SDRate", title: "SD Rate", width: "6%", className: "text-right" },
                    { data: "StockInHand", title: "Stock In Hand", width: "8%", className: "text-right" },
                    { data: "LowStockAlert", title: "Low Stock Alert", width: "8%", className: "text-right" },
                    { data: "Image", title: "Image Path", width: "12%", visible: false },
                    { data: "Remarks", title: "Remarks", width: "12%", visible: false }
                ],
                columnDefs: [
                    { width: '10%', targets: 0 }
                ],
            });
        }

        $.ajax({
            url: '/Common/Common/_getItemModal',
            method: 'get',
        }).done(onSuccess).fail(onFail);
    };
    var segmentNameModal = function (done, fail, dblCallBack, closeCallback) {
        debugger;
        var modalId = "#partialModal";
        var dataTableId = "#modalData";
        function showModal(html) {
            $(modalId).html(html);
            $('.draggable').draggable({
                handle: ".modal-header"
            });
            $(modalId).modal("show");
        }

        function onSuccess(result) {
            showModal(result);

            if (typeof done === "function") {
                done(result);
            }
            debugger;
            bindDoubleClick(dblCallBack);
            bindModalClose(closeCallback);
            initializeDataTable();
        }

        function onFail(result) {
            if (typeof fail === "function") {
                fail(result);
            }
        }

        function bindDoubleClick(callBack) {
            $(dataTableId).off("dblclick").on("dblclick", "tr", function () {
                if (typeof callBack === "function") {
                    callBack($(this));
                }
            });
        }

        function bindModalClose(closeCallback) {
            $(modalId).off("hidden.bs.modal").on("hidden.bs.modal", function () {
                if (typeof closeCallback === "function") {
                    closeCallback();
                }
                $(modalId).html("");
            });
        }

        function initializeDataTable() {

            if ($.fn.DataTable.isDataTable(dataTableId)) {
                $(dataTableId).DataTable().clear().destroy();
            }
            debugger;
            $(dataTableId).DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                processing: true,
                ajax: {
                    url: '/Common/Common/GetSegmentData',
                    type: 'POST',
                    data: function (d) {
                        console.log(d);
                        d.FromDate = $('#FromDate').val();
                    },
                    error: function (xhr, error, thrown) {
                        console.error("AJAX Error:", error, thrown);
                        console.error("Response:", xhr.responseText);
                    }
                },
                columns: [
                    { data: "Id", visible: false },
                    { data: "Code", title: " Code", width: "10%"},
                    { data: "Name", title: "Name", width: "15%" },
                    { data: "Remarks", title: "Remarks", width: "12%"},
                    { data: "Status", title: "Status", width: "15%" , visible: false }
                ],
                columnDefs: [
                    { width: '10%', targets: 0 }
                ],
            });
        }

        $.ajax({
            url: '/Common/Common/_getSegmentModal',
            method: 'get',
        }).done(onSuccess).fail(onFail);
    };

    var productNameModal = function (done, fail, dblCallBack, closeCallback) {
        debugger;
        var modalId = "#partialModal";
        var dataTableId = "#modalData";
        function showModal(html) {
            $(modalId).html(html);
            $('.draggable').draggable({
                handle: ".modal-header"
            });
            $(modalId).modal("show");
        }

        function onSuccess(result) {
            showModal(result);

            if (typeof done === "function") {
                done(result);
            }
            debugger;
            bindDoubleClick(dblCallBack);
            bindModalClose(closeCallback);
            initializeDataTable();
        }

        function onFail(result) {
            if (typeof fail === "function") {
                fail(result);
            }
        }

        function bindDoubleClick(callBack) {
            $(dataTableId).off("dblclick").on("dblclick", "tr", function () {
                if (typeof callBack === "function") {
                    callBack($(this));
                }
            });
        }

        function bindModalClose(closeCallback) {
            $(modalId).off("hidden.bs.modal").on("hidden.bs.modal", function () {
                if (typeof closeCallback === "function") {
                    closeCallback();
                }
                $(modalId).html("");
            });
        }

        function initializeDataTable() {
            debugger;

            if ($.fn.DataTable.isDataTable(dataTableId)) {
                $(dataTableId).DataTable().clear().destroy();
            }
            debugger;
            $(dataTableId).DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: false,
                processing: true,
                ajax: {
                    url: '/Common/Common/ProductList',
                    type: 'POST',
                    data: function (d) {
                        console.log(d);
                        d.FromDate = $('#FromDate').val();
                    },
                    error: function (xhr, error, thrown) {
                        debugger;
                        console.error("AJAX Error:", error, thrown);
                        console.error("Response:", xhr.responseText);
                    }
                },
                columns: [
                    { data: "Id", visible: false },
                    { data: "Code", title: " Code", width: "10%" },
                    { data: "Name", title: "Name", width: "15%" },
                    { data: "ConversionFactor", title: "ConversionFactor", width: "12%" }

                ],
                columnDefs: [
                    { width: '10%', targets: 0 }
                ],
            });
        }

        $.ajax({
            url: '/Common/Common/_getProductList',
            method: 'get',
        }).done(onSuccess).fail(onFail);
    };

    

    var ItemModalForMakingCharge = function (done, fail, dblCallBack, closeCallback) {
        debugger;
        var modalId = "#partialModal";
        var dataTableId = "#modalData";
        function showModal(html) {
            $(modalId).html(html);
            $('.draggable').draggable({
                handle: ".modal-header"
            });
            $(modalId).modal("show");
        }

        function onSuccess(result) {
            showModal(result);

            if (typeof done === "function") {
                done(result);
            }
            debugger;
            bindDoubleClick(dblCallBack);
            bindModalClose(closeCallback);
            initializeDataTable();
        }

        function onFail(result) {
            if (typeof fail === "function") {
                fail(result);
            }
        }

        function bindDoubleClick(callBack) {
            $(dataTableId).off("dblclick").on("dblclick", "tr", function () {
                if (typeof callBack === "function") {
                    callBack($(this));
                }
            });
        }

        function bindModalClose(closeCallback) {
            $(modalId).off("hidden.bs.modal").on("hidden.bs.modal", function () {
                if (typeof closeCallback === "function") {
                    closeCallback();
                }
                $(modalId).html("");
            });
        }

        function initializeDataTable() {

            if ($.fn.DataTable.isDataTable(dataTableId)) {
                $(dataTableId).DataTable().clear().destroy();
            }
            debugger;
            $(dataTableId).DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                processing: true,
                ajax: {
                    url: '/Common/Common/GetItemDataForMakingCharge',
                    type: 'POST',
                    data: function (d) {
                        console.log(d);
                        d.FromDate = $('#FromDate').val();
                    },
                    error: function (xhr, error, thrown) {
                        console.error("AJAX Error:", error, thrown);
                        console.error("Response:", xhr.responseText);
                    }
                },
                columns: [
                    { data: "Id", visible: false },
                    { data: "CategoryId", title: "Category", width: "8%", visible: false },
                    { data: "UomId", title: "UomId", width: "8%", visible: false },
                    { data: "UomName", title: "UomName", width: "8%", visible: false },
                    { data: "Code", title: "Item Code", width: "10%", visible: false },
                    { data: "Name", title: "Item Name", width: "15%" },
                    { data: "NameInBangla", title: "Name (Bangla)", width: "15%" },
                    { data: "ArticleNo", title: "Article No", width: "8%", visible: false },
                    { data: "Description", title: "Description", width: "15%", visible: false },
                    { data: "CostPrice", title: "Cost Price", width: "8%", className: "text-right", visible: false },
                    { data: "SalesPrice", title: "Sales Price", width: "8%", className: "text-right", visible: false },
                    { data: "SalesPriceDiscount", title: "Sales Discount", width: "8%", className: "text-right", visible: false },
                    { data: "MakingCharge", title: "Making Charge", width: "8%", className: "text-right" },
                    { data: "MakingChargeDiscount", title: "Making Charge Discount", width: "10%", className: "text-right" },
                    { data: "IncludeVAT", title: "Include VAT", width: "6%", visible: false },
                    { data: "VATRate", title: "VAT Rate", width: "6%", className: "text-right" },
                    { data: "SDRate", title: "SD Rate", width: "6%", className: "text-right" },
                    { data: "StockInHand", title: "Stock In Hand", width: "8%", className: "text-right" },
                    { data: "LowStockAlert", title: "Low Stock Alert", width: "8%", className: "text-right" },
                    { data: "Image", title: "Image Path", width: "12%", visible: false },
                    { data: "Remarks", title: "Remarks", width: "12%", visible: false }
                ],
                columnDefs: [
                    { width: '10%', targets: 0 }
                ],
            });
        }

        $.ajax({
            url: '/Common/Common/_getItemModal',
            method: 'get',
        }).done(onSuccess).fail(onFail);
    };
    var ItemModalForFacric = function (done, fail, dblCallBack, closeCallback) {
        debugger;
        var modalId = "#partialModal";
        var dataTableId = "#modalData";
        function showModal(html) {
            $(modalId).html(html);
            $('.draggable').draggable({
                handle: ".modal-header"
            });
            $(modalId).modal("show");
        }

        function onSuccess(result) {
            showModal(result);

            if (typeof done === "function") {
                done(result);
            }
            debugger;
            bindDoubleClick(dblCallBack);
            bindModalClose(closeCallback);
            initializeDataTable();
        }

        function onFail(result) {
            if (typeof fail === "function") {
                fail(result);
            }
        }

        function bindDoubleClick(callBack) {
            $(dataTableId).off("dblclick").on("dblclick", "tr", function () {
                if (typeof callBack === "function") {
                    callBack($(this));
                }
            });
        }

        function bindModalClose(closeCallback) {
            $(modalId).off("hidden.bs.modal").on("hidden.bs.modal", function () {
                if (typeof closeCallback === "function") {
                    closeCallback();
                }
                $(modalId).html("");
            });
        }

        function initializeDataTable() {

            if ($.fn.DataTable.isDataTable(dataTableId)) {
                $(dataTableId).DataTable().clear().destroy();
            }
            debugger;
            $(dataTableId).DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                processing: true,
                ajax: {
                    url: '/Common/Common/GetItemDataForFabric',
                    type: 'POST',
                    data: function (d) {
                        console.log(d);
                        d.FromDate = $('#FromDate').val();
                    },
                    error: function (xhr, error, thrown) {
                        console.error("AJAX Error:", error, thrown);
                        console.error("Response:", xhr.responseText);
                    }
                },
                columns: [
                    { data: "Id", visible: false },
                    { data: "CategoryId", title: "Category", width: "8%", visible: false },
                    { data: "UomId", title: "UomId", width: "8%", visible: false },
                    { data: "UomName", title: "UomName", width: "8%", visible: false },
                    { data: "Code", title: "Item Code", width: "10%", visible: false },
                    { data: "Name", title: "Item Name", width: "15%" },
                    { data: "NameInBangla", title: "Name (Bangla)", width: "15%" },
                    { data: "ArticleNo", title: "Article No", width: "8%", visible: false },
                    { data: "Description", title: "Description", width: "15%", visible: false },
                    { data: "CostPrice", title: "Cost Price", width: "8%", className: "text-right", visible: false },
                    { data: "SalesPrice", title: "Sales Price", width: "8%", className: "text-right", visible: false },
                    { data: "SalesPriceDiscount", title: "Sales Discount", width: "8%", className: "text-right", visible: false },
                    { data: "MakingCharge", title: "Making Charge", width: "8%", className: "text-right" },
                    { data: "MakingChargeDiscount", title: "Making Charge Discount", width: "10%", className: "text-right" },
                    { data: "IncludeVAT", title: "Include VAT", width: "6%", visible: false },
                    { data: "VATRate", title: "VAT Rate", width: "6%", className: "text-right" },
                    { data: "SDRate", title: "SD Rate", width: "6%", className: "text-right" },
                    { data: "StockInHand", title: "Stock In Hand", width: "8%", className: "text-right" },
                    { data: "LowStockAlert", title: "Low Stock Alert", width: "8%", className: "text-right" },
                    { data: "Image", title: "Image Path", width: "12%", visible: false },
                    { data: "Remarks", title: "Remarks", width: "12%", visible: false }
                ],
                columnDefs: [
                    { width: '10%', targets: 0 }
                ],
            });
        }

        $.ajax({
            url: '/Common/Common/_getItemModal',
            method: 'get',
        }).done(onSuccess).fail(onFail);
    };


    var MesurementModal = function (Id, itemId, OrderMasterId, done, fail, closeCallback) {
        debugger;
        var modalId = "#partialModal";
        var dataTableId = "#modalData";

        function showModal(html) {
            $(modalId).html(html);
            $('.draggable').draggable({
                handle: ".modal-header"
            });
            $(modalId).modal("show");
        }

        function onSuccess(result) {
            showModal(result);

            if (typeof done === "function") {
                done(result);
            }

            bindModalClose(closeCallback);
            initializeDataTable(Id,itemId, OrderMasterId); 
        }

        function onFail(result) {
            if (typeof fail === "function") {
                fail(result);
            }
        }

        function bindModalClose(closeCallback) {
            $(modalId).off("hidden.bs.modal").on("hidden.bs.modal", function () {
                if (typeof closeCallback === "function") {
                    closeCallback();
                }
                $(modalId).html(""); // Clean up after modal is closed
            });
        }

        function initializeDataTable(Id, itemId, OrderMasterId) {
            debugger;
            if ($.fn.DataTable.isDataTable(dataTableId)) {
                $(dataTableId).DataTable().clear().destroy();
            }
            $(dataTableId).DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                processing: true,
                ajax: {
                    url: '/Common/Common/GetMesurementForOrderData',
                    type: 'POST',
                    data: function (d) {
                        debugger;
                        d.Id = Id;
                        d.ItemIdField = itemId;
                        d.OrderMasterIdField = OrderMasterId;
                    },
                    error: function (xhr, status, error) {
                        console.error("AJAX Error: ", status, error);
                        console.error("Response Text: ", xhr.responseText);
                    }
                },
                columns: [
                    { data: "Id" },
                    { data: "ItemId" },
                    { data: "OrderMasterId" },
                    { data: "OrderMakingChargeDetailId" },
                    { data: "MeasureemntId" },
                    { data: "MeasurementCode", title: "Measurement Code" },
                    { data: "MeasurementName", title: "Measurement Name" },
                    {
                        data: "MeasurementValue",
                        title: "Enter Value",
                        render: function (data, type, row) {
                            console.log(row);

                            var value = row.MeasureemntValue != null ? row.MeasureemntValue.toFixed(2) : '0.00'; 

                            return `<input type="text" 
                                    class="form-control form-control-sm measurement-value" 
                                    data-id="${row.Id}" 
                                    data-name="${row.Name}" 
                                    placeholder="Enter value" 
                                    value="${value}" />`;
                        }
                    },
                    { data: "Remarks", title: "Remarks" }
                ]
            });
        }


        // AJAX call to fetch the modal data
        $.ajax({
            url: '/Common/Common/_getMeasurementForOrderModal',
            method: 'get',
        }).done(onSuccess).fail(onFail);
    };

    var ItemDesignModal = function (Id, itemId, OrderMasterId, done, fail, closeCallback) {
        debugger;
        var modalId = "#partialModal";
        var dataTableId = "#modalData";

        function showModal(html) {
            $(modalId).html(html);
            $('.draggable').draggable({
                handle: ".modal-header"
            });
            $(modalId).modal("show");
        }

        function onSuccess(result) {
            showModal(result);

            if (typeof done === "function") {
                done(result);
            }

            bindModalClose(closeCallback);
            initializeDataTable(Id,itemId, OrderMasterId); 
        }

        function onFail(result) {
            if (typeof fail === "function") {
                fail(result);
            }
        }

        function bindModalClose(closeCallback) {
            $(modalId).off("hidden.bs.modal").on("hidden.bs.modal", function () {
                if (typeof closeCallback === "function") {
                    closeCallback();
                }
                $(modalId).html(""); // Clean up after modal is closed
            });
        }

        function initializeDataTable(Id, itemId, OrderMasterId) {
            debugger;
            if ($.fn.DataTable.isDataTable(dataTableId)) {
                $(dataTableId).DataTable().clear().destroy();
            }
            $(dataTableId).DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                processing: true,
                ajax: {
                    url: '/Common/Common/GetItemDesignModalData',
                    type: 'POST',
                    data: function (d) {
                        debugger;
                        d.Id = Id;
                        d.ItemIdField = itemId;
                        d.OrderMasterIdField = OrderMasterId;
                    },
                    error: function (xhr, status, error) {
                        console.error("AJAX Error: ", status, error);
                        console.error("Response Text: ", xhr.responseText);
                    }
                },
                columns: [
                    { data: "Id" },
                    { data: "ItemId" },
                    { data: "OrderMasterId" },
                    { data: "OrderMakingChargeDetailId" },
                    { data: "ItemDesignCategoryId"},
                    { data: "ItemDesignCategoryCode"},
                    { data: "ItemDesignCategoryName"},
                    { data: "ItemDesignSubCategoryId"},
                    { data: "ItemDesignSubCategoryName"},
                    { data: "Remarks", title: "Remarks" }
                ]
            });
        }


        // AJAX call to fetch the modal data
        $.ajax({
            url: '/Common/Common/_getItemDesignModal',
            method: 'get',
        }).done(onSuccess).fail(onFail);
    };


    var OrderMesurementModal = function (itemId, OrderMasterId, done, fail, closeCallback) {
        debugger;
        var modalId = "#partialModal";
        var dataTableId = "#modalData";

        function showModal(html) {
            $(modalId).html(html);
            $('.draggable').draggable({
                handle: ".modal-header"
            });
            $(modalId).modal("show");
        }

        function onSuccess(result) {
            showModal(result);

            if (typeof done === "function") {
                done(result);
            }

            bindModalClose(closeCallback);
            initializeDataTable(itemId, OrderMasterId); 
        }

        function onFail(result) {
            if (typeof fail === "function") {
                fail(result);
            }
        }


        function bindModalClose(closeCallback) {
            $(modalId).off("hidden.bs.modal").on("hidden.bs.modal", function () {
                if (typeof closeCallback === "function") {
                    closeCallback();
                }
                $(modalId).html(""); // Clean up after modal is closed
            });
        }

        // DataTable initialization with ItemId and OrderMasterId
        function initializeDataTable(itemId, OrderMasterId) {
            debugger;
            if ($.fn.DataTable.isDataTable(dataTableId)) {
                $(dataTableId).DataTable().clear().destroy();
            }
            $(dataTableId).DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                processing: true,
                ajax: {
                    url: '/Common/Common/GetViewMesurementForOrderData',
                    type: 'POST',
                    data: function (d) {
                        d.FromDate = $('#FromDate').val();
                        d.ItemIdField = itemId;  
                        d.OrderMasterIdField = OrderMasterId;  
                    },
                    error: function (xhr, status, error) {
                        console.error("AJAX Error: ", status, error);
                        console.error("Response Text: ", xhr.responseText);
                    }
                },
                columns: [
                    { data: "Id", visible: false },
                    { data: "ItemId", visible: false },
                    { data: "OrderMasterId", visible: false },
                    { data: "MeasurementCode", title: "Measurement Code"},
                    { data: "MeasurementName", title: "Measurement Name" },
                    { data: "MeasureemntValue", title: "Measureemnt Value" },
                    { data: "Remarks", title: "Remarks", visible: false }
                ]
            });
        }

        // AJAX call to fetch the modal data
        $.ajax({
            url: '/Common/Common/_getViewMeasurementForOrderModal',
            method: 'get',
        }).done(onSuccess).fail(onFail);
    };



    var ItemDesignCategoryModal = function (done, fail, dblCallBack, closeCallback) {
        debugger;
        var modalId = "#partialModal";
        var dataTableId = "#modalData";
        function showModal(html) {
            $(modalId).html(html);
            $('.draggable').draggable({
                handle: ".modal-header"
            });
            $(modalId).modal("show");
        }

        function onSuccess(result) {
            showModal(result);

            if (typeof done === "function") {
                done(result);
            }
            debugger;
            bindDoubleClick(dblCallBack);
            bindModalClose(closeCallback);
            initializeDataTable();
        }

        function onFail(result) {
            if (typeof fail === "function") {
                fail(result);
            }
        }

        function bindDoubleClick(callBack) {
            $(dataTableId).off("dblclick").on("dblclick", "tr", function () {
                if (typeof callBack === "function") {
                    callBack($(this));
                }
            });
        }

        function bindModalClose(closeCallback) {
            $(modalId).off("hidden.bs.modal").on("hidden.bs.modal", function () {
                if (typeof closeCallback === "function") {
                    closeCallback();
                }
                $(modalId).html("");
            });
        }

        function initializeDataTable() {

            if ($.fn.DataTable.isDataTable(dataTableId)) {
                $(dataTableId).DataTable().clear().destroy();
            }
            debugger;
            $(dataTableId).DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                processing: true,
                ajax: {
                    url: '/Common/Common/GetDesignCategoryData',
                    type: 'POST',
                    data: function (d) {
                        console.log(d);
                        d.FromDate = $('#FromDate').val();
                    },
                    error: function (xhr, error, thrown) {
                        console.error("AJAX Error:", error, thrown);
                        console.error("Response:", xhr.responseText);
                    }
                },
                columns: [
                    { data: "Id", visible: false },
                    { data: "Code", title: "Category Code", width: '10%' },
                    { data: "Name", title: "Category Name", width: '15%' },
                    { data: "Remarks", title: "Remarks", width: '8%' },
                    { data: "Status", title: "Status", width: '8%' }
                ],
                columnDefs: [
                    { width: '10%', targets: 0 }
                ],
            });
        }

        $.ajax({
            url: '/Common/Common/_getDesignCategoryModal',
            method: 'get',
        }).done(onSuccess).fail(onFail);
    };
    var UomModal = function (done, fail, dblCallBack, closeCallback) {
        debugger;
        var modalId = "#partialModal";
        var dataTableId = "#modalData";
        function showModal(html) {
            $(modalId).html(html);
            $('.draggable').draggable({
                handle: ".modal-header"
            });
            $(modalId).modal("show");
        }

        function onSuccess(result) {
            showModal(result);

            if (typeof done === "function") {
                done(result);
            }
            debugger;
            bindDoubleClick(dblCallBack);
            bindModalClose(closeCallback);
            initializeDataTable();
        }

        function onFail(result) {
            if (typeof fail === "function") {
                fail(result);
            }
        }

        function bindDoubleClick(callBack) {
            $(dataTableId).off("dblclick").on("dblclick", "tr", function () {
                if (typeof callBack === "function") {
                    callBack($(this));
                }
            });
        }

        function bindModalClose(closeCallback) {
            $(modalId).off("hidden.bs.modal").on("hidden.bs.modal", function () {
                if (typeof closeCallback === "function") {
                    closeCallback();
                }
                $(modalId).html("");
            });
        }

        function initializeDataTable() {

            if ($.fn.DataTable.isDataTable(dataTableId)) {
                $(dataTableId).DataTable().clear().destroy();
            }
            debugger;
            $(dataTableId).DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                processing: true,
                ajax: {
                    url: '/Common/Common/GetUomData',
                    type: 'POST',
                    data: function (d) {
                        console.log(d);
                        d.FromDate = $('#FromDate').val();
                    },
                    error: function (xhr, error, thrown) {
                        console.error("AJAX Error:", error, thrown);
                        console.error("Response:", xhr.responseText);
                    }
                },
                columns: [
                    { data: "Id", visible: false },
                    { data: "Code", title: "Uom Code", width: '10%' },
                    { data: "Name", title: "Uom Name", width: '15%' },
                    { data: "Remarks", title: "Remarks", width: '8%' },
                    { data: "Status", title: "Status", width: '8%' }
                ],
                columnDefs: [
                    { width: '10%', targets: 0 }
                ],
            });
        }

        $.ajax({
            url: '/Common/Common/_getUomModal',
            method: 'get',
        }).done(onSuccess).fail(onFail);
    };
    var FabricSourceModal = function (done, fail, dblCallBack, closeCallback) {
        debugger;
        var modalId = "#partialModal";
        var dataTableId = "#modalData";
        function showModal(html) {
            $(modalId).html(html);
            $('.draggable').draggable({
                handle: ".modal-header"
            });
            $(modalId).modal("show");
        }

        function onSuccess(result) {
            showModal(result);

            if (typeof done === "function") {
                done(result);
            }
            debugger;
            bindDoubleClick(dblCallBack);
            bindModalClose(closeCallback);
            initializeDataTable();
        }

        function onFail(result) {
            if (typeof fail === "function") {
                fail(result);
            }
        }

        function bindDoubleClick(callBack) {
            $(dataTableId).off("dblclick").on("dblclick", "tr", function () {
                if (typeof callBack === "function") {
                    callBack($(this));
                }
            });
        }

        function bindModalClose(closeCallback) {
            $(modalId).off("hidden.bs.modal").on("hidden.bs.modal", function () {
                if (typeof closeCallback === "function") {
                    closeCallback();
                }
                $(modalId).html("");
            });
        }

        function initializeDataTable() {

            if ($.fn.DataTable.isDataTable(dataTableId)) {
                $(dataTableId).DataTable().clear().destroy();
            }
            debugger;
            $(dataTableId).DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                processing: true,
                ajax: {
                    url: '/Common/Common/GetFabricSourceModalData',
                    type: 'POST',
                    data: function (d) {
                        console.log(d);
                        d.FromDate = $('#FromDate').val();
                    },
                    error: function (xhr, error, thrown) {
                        console.error("AJAX Error:", error, thrown);
                        console.error("Response:", xhr.responseText);
                    }
                },
                columns: [
                    { data: "Id", visible: false },
                    { data: "Name", title: "Fabric Code", width: '10%' },
                    { data: "Remarks", title: "Remarks", width: '8%' },
                    { data: "Status", title: "Status", width: '8%' }
                ],
                columnDefs: [
                    { width: '10%', targets: 0 }
                ],
            });
        }

        $.ajax({
            url: '/Common/Common/_getFabricSourceModal',
            method: 'get',
        }).done(onSuccess).fail(onFail);
    };
    var DesignTypeModal = function (done, fail, dblCallBack, closeCallback) {
        debugger;
        var modalId = "#partialModal";
        var dataTableId = "#modalData";
        function showModal(html) {
            $(modalId).html(html);
            $('.draggable').draggable({
                handle: ".modal-header"
            });
            $(modalId).modal("show");
        }

        function onSuccess(result) {
            showModal(result);

            if (typeof done === "function") {
                done(result);
            }
            debugger;
            bindDoubleClick(dblCallBack);
            bindModalClose(closeCallback);
            initializeDataTable();
        }

        function onFail(result) {
            if (typeof fail === "function") {
                fail(result);
            }
        }

        function bindDoubleClick(callBack) {
            $(dataTableId).off("dblclick").on("dblclick", "tr", function () {
                if (typeof callBack === "function") {
                    callBack($(this));
                }
            });
        }

        function bindModalClose(closeCallback) {
            $(modalId).off("hidden.bs.modal").on("hidden.bs.modal", function () {
                if (typeof closeCallback === "function") {
                    closeCallback();
                }
                $(modalId).html("");
            });
        }

        function initializeDataTable() {

            if ($.fn.DataTable.isDataTable(dataTableId)) {
                $(dataTableId).DataTable().clear().destroy();
            }
            debugger;
            $(dataTableId).DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                processing: true,
                ajax: {
                    url: '/Common/Common/GetDesignTypeModalData',
                    type: 'POST',
                    data: function (d) {
                        console.log(d);
                        d.FromDate = $('#FromDate').val();
                    },
                    error: function (xhr, error, thrown) {
                        console.error("AJAX Error:", error, thrown);
                        console.error("Response:", xhr.responseText);
                    }
                },
                columns: [
                    { data: "Id", visible: false },
                    { data: "Name", title: "Design Type", width: '15%' },
                    { data: "Remarks", title: "Remarks", width: '8%' },
                    { data: "Status", title: "Status", width: '8%' }
                ],
                columnDefs: [
                    { width: '10%', targets: 0 }
                ],
            });
        }

        $.ajax({
            url: '/Common/Common/_getDesignTypeModal',
            method: 'get',
        }).done(onSuccess).fail(onFail);
    };
    var DesignFollowedModal = function (done, fail, dblCallBack, closeCallback) {
        debugger;
        var modalId = "#partialModal";
        var dataTableId = "#modalData";
        function showModal(html) {
            $(modalId).html(html);
            $('.draggable').draggable({
                handle: ".modal-header"
            });
            $(modalId).modal("show");
        }

        function onSuccess(result) {
            showModal(result);

            if (typeof done === "function") {
                done(result);
            }
            debugger;
            bindDoubleClick(dblCallBack);
            bindModalClose(closeCallback);
            initializeDataTable();
        }

        function onFail(result) {
            if (typeof fail === "function") {
                fail(result);
            }
        }

        function bindDoubleClick(callBack) {
            $(dataTableId).off("dblclick").on("dblclick", "tr", function () {
                if (typeof callBack === "function") {
                    callBack($(this));
                }
            });
        }

        function bindModalClose(closeCallback) {
            $(modalId).off("hidden.bs.modal").on("hidden.bs.modal", function () {
                if (typeof closeCallback === "function") {
                    closeCallback();
                }
                $(modalId).html("");
            });
        }

        function initializeDataTable() {

            if ($.fn.DataTable.isDataTable(dataTableId)) {
                $(dataTableId).DataTable().clear().destroy();
            }
            debugger;
            $(dataTableId).DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                processing: true,
                ajax: {
                    url: '/Common/Common/GetDesignFollowedModalData',
                    type: 'POST',
                    data: function (d) {
                        console.log(d);
                        d.FromDate = $('#FromDate').val();
                    },
                    error: function (xhr, error, thrown) {
                        console.error("AJAX Error:", error, thrown);
                        console.error("Response:", xhr.responseText);
                    }
                },
                columns: [
                    { data: "Id", visible: false },
                    { data: "Name", title: "Design Follow", width: '15%' },
                    { data: "Remarks", title: "Remarks", width: '8%' },
                    { data: "Status", title: "Status", width: '8%' }
                ],
                columnDefs: [
                    { width: '10%', targets: 0 }
                ],
            });
        }

        $.ajax({
            url: '/Common/Common/_getDesignFollowedModal',
            method: 'get',
        }).done(onSuccess).fail(onFail);
    };
    var SampleItemModal = function (done, fail, dblCallBack, closeCallback) {
        debugger;
        var modalId = "#partialModal";
        var dataTableId = "#modalData";
        function showModal(html) {
            $(modalId).html(html);
            $('.draggable').draggable({
                handle: ".modal-header"
            });
            $(modalId).modal("show");
        }

        function onSuccess(result) {
            showModal(result);

            if (typeof done === "function") {
                done(result);
            }
            debugger;
            bindDoubleClick(dblCallBack);
            bindModalClose(closeCallback);
            initializeDataTable();
        }

        function onFail(result) {
            if (typeof fail === "function") {
                fail(result);
            }
        }

        function bindDoubleClick(callBack) {
            $(dataTableId).off("dblclick").on("dblclick", "tr", function () {
                if (typeof callBack === "function") {
                    callBack($(this));
                }
            });
        }

        function bindModalClose(closeCallback) {
            $(modalId).off("hidden.bs.modal").on("hidden.bs.modal", function () {
                if (typeof closeCallback === "function") {
                    closeCallback();
                }
                $(modalId).html("");
            });
        }

        function initializeDataTable() {

            if ($.fn.DataTable.isDataTable(dataTableId)) {
                $(dataTableId).DataTable().clear().destroy();
            }
            debugger;
            $(dataTableId).DataTable({
                orderCellsTop: true,
                fixedHeader: true,
                serverSide: true,
                processing: true,
                ajax: {
                    url: '/Common/Common/GetSampleItemModalData',
                    type: 'POST',
                    data: function (d) {
                        console.log(d);
                        d.FromDate = $('#FromDate').val();
                    },
                    error: function (xhr, error, thrown) {
                        console.error("AJAX Error:", error, thrown);
                        console.error("Response:", xhr.responseText);
                    }
                },
                columns: [
                    { data: "Id", visible: false },
                    { data: "Code", title: "Uom Code", width: '10%' },
                    { data: "Name", title: "Uom Name", width: '15%' },
                    { data: "Remarks", title: "Remarks", width: '8%' },
                    { data: "Status", title: "Status", width: '8%' }
                ],
                columnDefs: [
                    { width: '10%', targets: 0 }
                ],
            });
        }

        $.ajax({
            url: '/Common/Common/_getSampleItemModal',
            method: 'get',
        }).done(onSuccess).fail(onFail);
    };

    function validateDropdown(selector, errorId, errorMessage) {

        var isValid = true;
        var value = $(selector).val()?.trim();

        if (value === "" /*|| value === "0"*/) {
            isValid = false;
            $(selector).addClass("is-invalid");
            $(errorId).text(errorMessage).show();
        } else {
            $(selector).removeClass("is-invalid");
            $(errorId).text("").hide();
        }

        $(selector).on('change', function () {
            if ($(this).val() !== "" && $(this).val() !== "0") {
                $(this).removeClass("is-invalid");
                $(errorId).text("").hide();
            }
        });

        return isValid;
    }



    return {

        productModal: productModal,
        segmentNameModal: segmentNameModal,
        ItemMesurementModal: ItemMesurementModal,
        ItemModalForMakingCharge: ItemModalForMakingCharge,
        ItemModal: ItemModal,
        ItemModalForFacric: ItemModalForFacric,
        MesurementModal: MesurementModal,
        OrderMesurementModal: OrderMesurementModal,
        ItemDesignModal: ItemDesignModal,
        UomModal: UomModal,
        FabricSourceModal: FabricSourceModal,
        DesignTypeModal: DesignTypeModal,
        DesignFollowedModal: DesignFollowedModal,
        SampleItemModal: SampleItemModal,
        ItemDesignCategoryModal: ItemDesignCategoryModal,
        customerCodeModal: customerCodeModal,
        branchLoading: branchLoading,
        validateDropdown: validateDropdown,
        productNameModal: productNameModal


    }

}();