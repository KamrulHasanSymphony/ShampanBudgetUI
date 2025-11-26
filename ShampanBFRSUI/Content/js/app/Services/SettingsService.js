var SettingsService = function () {
    var save = function ( done, fail) {

        $.ajax({
            url: '/Common/AccountCodeModal',
            method: 'get'

        })
            .done(done)
            .fail(fail);


    };
    var save = function (masterObj, done, fail) {

        $.ajax({
            url: '/APInvoice/CreateEdit',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };
    var saveBatch = function (masterObj, done, fail) {

        $.ajax({
            url: '/APInvoiceBatchList/CreateEdit',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };

    var AccountNocall = function (masterObj, done, fail) {

        $.ajax({
            url: '/APInvoice/Acc?AccountNo=' + masterObj,
            method: 'get',
        })
            .done(done)
            .fail(fail);


    };



    var APIMultiplePost = function (masterObj, done, fail) {

        $.ajax({
            url: '/APInvoice/MultiplePost',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };
    var  APIMultiplePush = function (masterObj, done, fail) {

        $.ajax({
            url: '/APInvoice/MultiplePush',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };
    var APIMultipleUnPost = function (masterObj, done, fail) {

        $.ajax({
            url: '/APInvoice/MultipleUnPost',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);


    };





   

    return {
        save: save,
        saveBatch: saveBatch,
        APIMultiplePost: APIMultiplePost,
        AccountNocall: AccountNocall,
        APIMultiplePush: APIMultiplePush,
        APIMultipleUnPost: APIMultipleUnPost
      


    }


}();