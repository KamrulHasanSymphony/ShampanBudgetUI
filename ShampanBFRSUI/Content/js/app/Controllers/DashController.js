var DashController = function () {

    var init = function (count) {
        if (count == 0) {
            //$("#branchProfiles").modal("show");
            loadBranchProfiles();
        }

        $("#tBranchProfiles").on("dblclick", "td",
            function () {
                var branchCode = $(this).closest("tr").find("td:eq(0)").text().trim();
                var BranchName = $(this).closest("tr").find("td:eq(1)").text().trim();
                var userId = $(this).closest("tr").find("td:eq(2)").text().trim();

                var form = $('<form>', { method: 'POST' });
                var targetURL = '/Common/Home/AssignBranch';
                form.attr('action', targetURL);
                form.append($('<input>', {
                    type: 'BranchCode',
                    name: 'BranchCode',
                    value: branchCode
                }));
                form.append($('<input>', {
                    type: 'BranchName',
                    name: 'BranchName',
                    value: BranchName
                }));
                form.append($('<input>', {
                    type: 'UserId',
                    name: 'UserId',
                    value: userId
                }));

                form.hide();

                $(".container-fluid").append(form);

                form.submit();
                form.remove();
            }
        );
    };


    function loadBranchProfiles() {
        $.ajax({
            url: '/Common/Home/LoadBranchProfiles',
            type: 'GET',
            dataType: 'json',
            success: function (response) {

                if (response && response.data && response.data.length > 0) {

                    if (response.data.length === 1) {

                        var branch = response.data[0];

                        var form = $('<form>', { method: 'POST' });
                        form.attr('action', '/Common/Home/AssignBranch');

                        form.append($('<input>', {
                            type: 'hidden',
                            name: 'BranchCode',
                            value: branch.Code
                        }));

                        form.append($('<input>', {
                            type: 'hidden',
                            name: 'BranchName',
                            value: branch.Name
                        }));

                        form.append($('<input>', {
                            type: 'hidden',
                            name: 'UserId',
                            value: branch.UserId
                        }));

                        form.hide();
                        $(".container-fluid").append(form);
                        form.submit();
                        form.remove();

                    }
                    else {
                        $("#branchProfiles").modal("show");
                        var tbody = $('#tbdBranchProfiles');
                        tbody.empty();
                        response.data.forEach(function (branch) {
                            var row = `<tr>
                            <td>${branch.Code}</td>
                            <td>${branch.Name}</td>
                            <td style="display: none;">${branch.UserId}</td>
                        </tr>`;
                            tbody.append(row);
                        });
                        $('#tBranchProfiles').DataTable({
                            destroy: true,
                            paging: true,
                            searching: true,
                            lengthMenu: [[5, 10, 25, -1], [5, 10, 25, "All"]],
                            pageLength: 10,

                        });
                        $('#branchProfiles').modal('show');
                    }
                } else {
                    alert('No data available.');
                }
            },
            error: function () {
                alert('Failed to fetch branch profiles.');
            }
        });
    };


    return {
        init: init,
    }

}();