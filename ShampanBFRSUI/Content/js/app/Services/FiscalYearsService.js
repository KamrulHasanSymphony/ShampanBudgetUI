var FiscalYearsService = function () {
    var save = function (masterObj, done, fail) {

        $.ajax({
            url: '/FiscalYears/CreateEdit',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);

    };
    return {
        save: save,
    
    }
}();