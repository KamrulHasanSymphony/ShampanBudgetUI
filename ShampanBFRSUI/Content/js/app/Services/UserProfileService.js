var UserProfileService = function () {
    var save = function (masterObj, done, fail) {

        $.ajax({
            url: '/UserProfile/CreateEdit',
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