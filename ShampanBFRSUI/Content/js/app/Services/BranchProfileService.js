var BranchProfileService = function () {
    var save = function (masterObj, done, fail) {

        $.ajax({
            url: '/BranchProfile/CreateEdit',
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