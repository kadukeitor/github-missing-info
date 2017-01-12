$(function () {

    $('#credentials').submit(function (event) {
        $('#search').submit();
        event.preventDefault();
    });

    $("#search").submit(function (event) {
        var repo_full_name = $("#repository_url").val();
        repo_full_name = repo_full_name.replace('https://github.com/', '');
        repo_full_name = repo_full_name.replace(/\/$/, '');
        info(repo_full_name);
        event.preventDefault();
    });

});


function info(repo_full_name) {

    const api = "https://api.github.com/repos/" + repo_full_name;

    //////////////////////
    //                  //
    // info             //
    //                  //
    //////////////////////

    request(api, function (err, repo) {

        if (err) {
            return false;
        }

        var items = [];
        // name
        items.push(["<tr>",
            "<td class='left'>name</td>",
            "<td>" + "<a target='_blank' href='" + repo.html_url + "'>" + repo.name + "</a>" + "</td>",
            "</tr>"
        ].join(""));
        // author
        items.push(["<tr>",
            "<td class='left'>author</td>",
            "<td>" + "<a target='_blank' href='" + repo.owner.html_url + "'>" + repo.owner.login + "</a>" + "</td>",
            "</tr>"
        ].join(""));
        // latest push
        items.push(["<tr>",
            "<td class='left'>latest push</td>",
            "<td>" + timeSince(new Date(repo.pushed_at)) + " ago </td>",
            "</tr>"
        ].join(""));
        // stars
        items.push(["<tr>",
            "<td class='left'>stars</td>",
            "<td>" + repo.stargazers_count + "</td>",
            "</tr>"
        ].join(""));
        // watchers
        items.push(["<tr>",
            "<td class='left'>watchers</td>",
            "<td>" + repo.subscribers_count + "</td>",
            "</tr>"
        ].join(""));
        // open issues
        items.push(["<tr>",
            "<td class='left'>open issues</td>",
            "<td>" + repo.open_issues_count + "</td>",
            "</tr>"
        ].join(""));
        render("#info", items.join(""));
    });

    //////////////////////
    //                  //
    // popular-forks    //
    //                  //
    //////////////////////

    request(api + "/forks?sort=stargazers", function (err, data) {

        if (err) {
            return false;
        }

        var items = [];
        $.each(data, function (index, repo) {
            var row = ["<tr>",
                "<td class='left'>" + "<a target='_blank' href='" + repo.html_url + "'>" + repo.full_name + "</a>" + "</td>",
                "<td>" + repo.stargazers_count + "</td>",
                "<td>" + timeSince(new Date(repo.pushed_at)) + " ago </td>",
                "</tr>"
            ].join("");
            items.push(row);
        });
        render("#popular-forks", items.join(""));
    });


}

function render(selector, html) {
    $(selector).removeClass('hide');
    $(selector + ' table tbody').html("");
    $("<tbody />", {
        html: html
    }).appendTo(selector + " table");
}

function request(url, callback) {
    var selector = ".error-message";
    var username = $('#username').val();
    var password = $('#password').val();
    $(selector).addClass('hide');
    $.getJSON({
        url: url,
        beforeSend: function (xhr) {
            if (username && password) {
                xhr.setRequestHeader("Authorization", "Basic " + window.btoa(username + ":" + password));
            }
        },
        success: function (result) {
            callback(null, result);
        },
        error: function (error) {
            var message = error.responseJSON.message;
            $(selector).html(message);
            $(selector).removeClass('hide');
            callback(message);
        }
    });
}

function timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}