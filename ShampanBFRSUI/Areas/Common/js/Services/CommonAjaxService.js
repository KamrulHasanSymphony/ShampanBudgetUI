var CommonAjaxService = function () {

    var finalSave = function (url, masterObj, done, fail) {

        $.ajax({
            url: url,
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);

    };

    var finalImageSave = function (url, masterObj, done, fail) {
        debugger;
        $.ajax({
            url: url,
            method: 'post',
            data: masterObj,
            processData: false,  
            contentType: false,
            timeout: 60000
        })
            .done(done)
            .fail(fail);

    };

    var deleteData = function (url, masterObj, done, fail) {
        $.ajax({
            url: url,
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);

    };

    var multiplePost = function (url, masterObj, done, fail) {
        $.ajax({
            url: url,
            method: 'post',
            data: masterObj

        })
            .done(done)
            .fail(fail);

    };

    var ImportExcel = function (url, masterObj, done, fail) {
        $.ajax({
            url: url,
            method: 'POST',
            data: masterObj,
            contentType: false,  // Important for file upload
            processData: false,  // Prevent jQuery from processing FormData
            beforeSend: function () {
                console.log("Uploading file...");
            }
        })
            .done(done)
            .fail(fail);
    };


    return {
        finalSave: finalSave,
        finalImageSave: finalImageSave,
        deleteData: deleteData,
        multiplePost: multiplePost,
        ImportExcel: ImportExcel,
    }


}();