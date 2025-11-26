var CompanyInfoService = function () {
    var save = function (masterObj, done, fail) {

        $.ajax({
            url: '/CompanyInfo/CreateEdit',
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