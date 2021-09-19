const params = new URLSearchParams(window.location.search)
uid = params.get('uid')
console.log(uid, params)

$(document).ready(function () {
    $messages.mCustomScrollbar();
    $.post('/talk', // url
    {
        t: "Begin",
        uid: uid
    }, // data to be submit

    function (data, status, jqXHR) { // success callback
        let str = ""
        data.forEach(element => {
            if (element.type == "speak") {
                str += "<div id='cm-msg-" + 1 + "' class=\"chat-msg user\">";
                str += "          <span class=\"msg-avatar\">";
                str += "            <img src=\"/images/avatar.png\">";
                str += "          <\/span>";
                str += "          <div class=\"cm-msg-text\">";
                str += element.payload.message;
                str += "          <\/div>";
                str += "        <\/div>";
            }
        });
        $(".chat-logs").append(str);
        $("#cm-msg-" + 0).hide().fadeIn(300);
        $(".chat-logs").stop().animate({
            scrollTop: $(".chat-logs")[0].scrollHeight
        }, 1000);

    })
});

var $messages = $('.messages-content'),
    d, h, m,
    i = 0;

function updateScrollbar() {
    $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
        scrollInertia: 10,
        timeout: 0
    });
}

function insertMessage() {
    msg = $('.message-input').val();
    if ($.trim(msg) == '') {
        return false;
    }
    $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
    $('.message-input').val(null);
    updateScrollbar();
}

$('.message-submit').click(function () {
    insertMessage();
});

$(window).on('keydown', function (e) {
    if (e.which == 13) {
        insertMessage();
    }
})

$('.button').click(function () {
    $('.menu .items span').toggleClass('active');
    $('.menu .button').toggleClass('active');
});

let f = 0;
let width, height;

function setup() {
    createCanvas(displayWidth, displayHeight);
    width = displayWidth
    height = displayHeight
}


let currentScene = "General"
let disappearScene = undefined
let nextScene = "General"


$(function () {
    var INDEX = 1;
    $("#chat-submit").click(function (e) {
        e.preventDefault();
        var msg = $("#chat-input").val();
        if (msg.trim() == '') {
            return false;
        }
        generate_message(msg, 'self');
        generate_message(msg, 'user', uid);

    })

    function generate_message(msg, type, uid) {
        INDEX++;
        var str = "";
        if (type == 'self') {
            str += "<div id='cm-msg-" + INDEX + "' class=\"chat-msg " + type + "\">";
            str += "          <span class=\"msg-avatar\">";
            str += "            <img src=\"/images/avatar.png\">";
            str += "          <\/span>";
            str += "          <div class=\"cm-msg-text\">";
            str += msg;
            str += "          <\/div>";
            str += "        <\/div>";

            $(".chat-logs").append(str);
            console.log(str)
            $("#cm-msg-" + INDEX).hide().fadeIn(300);
            if (type == 'self') {
                $("#chat-input").val('');
            }
            $(".chat-logs").stop().animate({
                scrollTop: $(".chat-logs")[0].scrollHeight
            }, 1000);
        } else {
            $.post('/talk', // url
                {
                    t: msg,
                    uid: uid
                }, // data to be submit
                function (data, status, jqXHR) { // success callback
                    data.forEach(element => {
                        if (element.type == "speak") {
                            str += "<div id='cm-msg-" + INDEX + "' class=\"chat-msg " + type + "\">";
                            str += "          <span class=\"msg-avatar\">";
                            str += "            <img src=\"/images/avatar.png\">";
                            str += "          <\/span>";
                            str += "          <div class=\"cm-msg-text\">";
                            str += element.payload.message;
                            str += "          <\/div>";
                            str += "        <\/div>";

                            nextScene = element.payload.message
                        }
                        if (element.type == "end") {
                            str += "<div id='cm-msg-" + INDEX + "' class=\"chat-msg " + type + "\">";
                            str += "          <span class=\"msg-avatar\">";
                            str += "            <img src=\"/images/avatar.png\">";
                            str += "          <\/span>";
                            str += "          <div class=\"cm-msg-text\">";
                            str += "Goodbye";
                            str += "          <\/div>";
                            str += "        <\/div>";
                        }
                    });
                    console.log(data)
                    $(".chat-logs").append(str);
                    console.log(str)
                    $("#cm-msg-" + INDEX).hide().fadeIn(300);
                    if (type == 'self') {
                        $("#chat-input").val('');
                    }
                    $(".chat-logs").stop().animate({
                        scrollTop: $(".chat-logs")[0].scrollHeight
                    }, 1000);

                })
        }
    }

    $(document).delegate(".chat-btn", "click", function () {
        var value = $(this).attr("chat-value");
        var name = $(this).html();
        $("#chat-input").attr("disabled", false);
        generate_message(name, 'self');
    })

    $("#chat-circle").click(function () {
        $("#chat-circle").toggle('scale');
        $(".chat-box").toggle('scale');
    })

    $(".chat-box-toggle").click(function () {
        $("#chat-circle").toggle('scale');
        $(".chat-box").toggle('scale');
    })

})

// Stuff
/*
function keyPressed() {
    nextScene = window.prompt("What do you want to see");
} */

let s = nextScene

function draw() {
    background(220);


    if (currentScene === nextScene) {
        if (disappearScene !== undefined) {
            fill(255)
            rect(width / 3 + f + (width / 3), height / 4, width / 3, height / 2)

            // draw everything on it
            fill(0)
            text(disappearScene, width / 2 - textWidth(s) / 2 + f + (width / 3) - textWidth(s) / 2, height / 4 + textAscent());
        }

        if (f < width / 3) {
            f += 5;
        } else {
            disappearScene = undefined
        }
        fill(255)
        rect(f, height / 4, width / 3, height / 2)
        fill(0)
        textSize(32);
        b = text(currentScene, f + width / 6 - textWidth(s) / 2, height / 4 + textAscent());

    } else {
        fill(0)
        text(nextScene, f + width / 6 - textWidth(s) / 2, height / 4 + textAscent());
        f += 4

        disappearScene = currentScene
        currentScene = nextScene
        f + 3
        f = -(width / 3)

    }


}