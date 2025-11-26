var MenuAuthorizationService = function () {

    var save = function (masterObj, done, fail) {
        
        $.ajax({
            url: '/SetUp/MenuAuthorization/RoleMenuCreateEdit',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);
    };

    var userMenuSave = function (masterObj, done, fail) {
        
        $.ajax({
            url: '/SetUp/MenuAuthorization/UserMenuCreateEdit',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);
    };

    var roleSave = function (masterObj, done, fail) {
        
        $.ajax({
            url: '/SetUp/MenuAuthorization/RoleCreateEdit',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);
    };

    var userGroupSave = function (masterObj, done, fail) {

        $.ajax({
            url: '/SetUp/MenuAuthorization/UserGroupCreateEdit',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);
    };

    var userGroupMenuSave = function (masterObj, done, fail) {

        $.ajax({
            url: '/SetUp/MenuAuthorization/UserGroupMenuCreateEdit',
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);
    };


    return {
        save: save,
        userMenuSave: userMenuSave,
        roleSave: roleSave,
        userGroupSave: userGroupSave,
        userGroupMenuSave: userGroupMenuSave,

    }

}();
