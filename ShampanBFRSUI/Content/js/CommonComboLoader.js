
function LoadCombo(controlId, url, isDefaultRecordRequired = true) {
    $.ajax({
        url: url,
        data: {},
        type: 'get',
        async: false,
        cache: false,
        success: function (res) {
            var data = res;
            $("#" + controlId).empty();
            $("#" + controlId).get(0).options.length = 0;

            if (isDefaultRecordRequired) {
                $("#" + controlId).get(0).options[0] = new Option("----- Select -----", "xx");
            }
            if (data != null) {
                $.each(data, function (index, item) {
                    $("#" + controlId).get(0).options[$("#" + controlId).get(0).options.length] = new Option(item.Name, item.Value);
                });
            }

            var value = $("#" + controlId).attr("data-selected");
            var readonly = $("#" + controlId).attr("data-readonly");
            if (value > 0) {
                $("#" + controlId).val(value).change();
            } else {
                $("#" + controlId).val(value);
            }

            if (readonly) {
                $("#" + controlId).attr('disabled', true);

            }
        },
        error: function (e) {
            ShowNotification('Error in LoadCombo!');
        }
    });
};


// auto complete


function getBloodHound(url) {   
    return new Bloodhound({
        datumTokenizer: datum => Bloodhound.tokenizers.whitespace(datum.value),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: url +'?Prefix=%QUERY',
            // Map the remote source JSON array to a JavaScript object array
            filter: movies => $.map(movies, movie => ({
                value: movie.name,
            })),
            wildcard: '%QUERY',
        }
    });
};

function getTypeAheadConfig(url) {
    return {
        displayKey: 'value',
        source: getBloodHound(url).ttAdapter()
    }
};

