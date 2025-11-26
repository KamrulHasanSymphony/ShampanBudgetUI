var UserBranchService = function () {
    var save = function (masterObj, done, fail) {

        $.ajax({
            url: '/UserBranch/CreateEdit',
            method: 'post',
            data: masterObj,id

        })
            .done(done)
            .fail(fail);

    };
    return {
        save: save,

    }
}();