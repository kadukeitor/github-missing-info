$(function () {

    stats();

    // submit from credentials
    $('#credentials').submit(function (event) {
        stats();
        event.preventDefault();
    });

});


function stats() {

    //////////////////////////////
    //                          //
    // popular-repositories     //
    //                          //
    //////////////////////////////

    request("https://api.github.com/search/repositories?q=stars:%3E1", function (err, data) {
        if (err) {
            return false;
        }
        var items = [];
        $.each(data.items, function (index, repo) {
            var row = ["<tr>",
                "<td class='left'>" + (index + 1) + "</td>",
                "<td class='left'>" + "<a target='_blank' href='" + repo.html_url + "'>" + repo.full_name + "</a>" + "</td>",
                "<td>" + repo.stargazers_count + "</td>",
                "<td>" + timeSince(new Date(repo.pushed_at)) + " ago </td>",
                "</tr>"
            ].join("");
            items.push(row);
        });
        if (items.length) {
            render("#popular-repositories", items.join(""));
        }
    });

    //////////////////////////////
    //                          //
    // popular-users            //
    //                          //
    //////////////////////////////

    request("https://api.github.com/search/users?q=followers:%3E1", function (err, data) {
        if (err) {
            return false;
        }
        var items = [];
        $.each(data.items, function (index, user) {
            var row = ["<tr>",
                "<td class='left'>" + (index + 1) + "</td>",
                "<td class='left'>" + "<a target='_blank' href='" + user.html_url + "'>" + user.login + "</a>" + "</td>",
                "</tr>"
            ].join("");
            items.push(row);
        });
        if (items.length) {
            render("#popular-users", items.join(""));
        }
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