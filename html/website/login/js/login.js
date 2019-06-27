/*
 * Author: Hcyang
 * Time: 2019-06-25
 */

const CODE_SIGNIN_ERR = 602;
const CODE_UNVERIFIED = 603;
const CODE_SIGNIN_SUCC = 701;
const CODE_UNKNOWN_ERR = 900;


var loguser = window.localStorage.getItem("loguser");
var page_score = window.localStorage.getItem("page_score")
if (loguser == null) {
    loguser = "未登录"
}
if (page_score == null) {
    page_score = 0;
}
$('.user-id').children(':first').text("当前用户：" + loguser);
$('.points').children(':first').text("总积分：" + String(page_score));


var check_array = new Array(4).fill(0);

//get parameters in url
var url = location.search;
var data = new Object();
if (url.indexOf("?") != -1) {
    var str = url.substr(1);
    var strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
        data[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
    }
}
if ("loguser" in data) {
    loguser = data["loguser"]
    $('.user-id').children(':first').text(loguser);
}


function error_input(name, index, inputbox) {
    $(name).css('display', 'block');
    $(inputbox).css('border-color', '#D44000');
    check_array[index - 1] = 1;
}

function eliminate_error(name, index, inputbox, error) {
    $(name).css('display', 'none');
    if (!error) {
        $(inputbox).css('border-color', '#000000');
    }
    check_array[index - 1] = 0
}

$('#userid').focus(function (e) {
    hideMessage()
});
$('#password').focus(function (e) {
    hideMessage()
});

// Check userid
$('#userid').blur(function (e) {
    var inputbox = '#userid'
    eliminate_error('.check4', 4, inputbox);
    var userid = $('#userid').val();
    var error = false;

    //Empty check
    if (userid == "") {
        error = true;
        error_input('.check1', 1, inputbox);
    } else {
        if (check_array[0] == 1) {
            eliminate_error('.check1', 1, inputbox, error);
        }
    }
});

// Check password
$('#password').blur(function (e) {
    var inputbox = '#password'
    eliminate_error('.check4', 4, inputbox);
    var pwd = $('#password').val();
    var error = false;

    //Empty check
    if (pwd == "") {
        error = true;
        error_input('.check3', 3, inputbox);
    } else {
        if (check_array[2] == 1) {
            eliminate_error('.check3', 3, inputbox, error);
        }
    }
});

function shake_animation(name) {
    $(name).css('animation', 'shake 0.3s');
    setTimeout(function () {
        $(name).css('animation', 'none');
    }, 300);
}

function mask() {
    $('.loading').css('display', 'block');
}

function unmask() {
    $('.loading').css('display', 'none');
}

function showMessageSucess(title, msg) {
    $('.error-message-succeed').children(':first').children().text(title);
    $('.error-message-succeed').children(':last').children().text(msg);
    $('.error-message-succeed').css('display', 'block');
}

function hideMessage() {
    $('.error-message-succeed').children(':first').children().text('');
    $('.error-message-succeed').children(':last').children().text('');
    $('.error-message-succeed').css('display', 'none');
    $('.error-message-failed').children(':first').children().text('');
    $('.error-message-failed').children(':last').children().text('');
    $('.error-message-failed').css('display', 'none');
}

function showMessageFailed(title, msg) {
    $('.error-message-failed').children(':first').children().text(title);
    $('.error-message-failed').children(':last').children().text(msg);
    $('.error-message-failed').css('display', 'block');
}

function HandleResponse(res, username) {
    unmask();
    var code = res.code;
    var msg = res.msg;

    if (code == CODE_SIGNIN_ERR) {
        $("#password").val("");
        error_input('.check4', 4, '#password');
    } else if (code == CODE_SIGNIN_SUCC) {
        loguser = username;
        console.log(res)
        window.localStorage.setItem('loguser', username);
        window.localStorage.setItem('page_score', res.score);
        window.location.href = '../../../home.html';
    } else if (code == CODE_UNVERIFIED) {
        showMessageFailed('登陆失败', '您的账号未通过邮箱验证')
    } else {
        showMessageFailed('十分抱歉', '服务器开了小差，请稍后再试')
    }
}

function ErrorNetwork() {
    showMessageFailed('网络错误', '请检查网络状态并重试')
}

$('form').submit(function (e) {
    e.preventDefault();

    $('#userid').trigger("blur");
    $('#password').trigger("blur");
    var global_error = false;
    for (var i = 0; i < check_array.length; i++) {
        if (check_array[i] == 1) {
            shake_animation('.check' + (i + 1));
            global_error = true;
        }
    }

    var userid = $('#userid').val();
    var password = $('#password').val();
    var data = new Object();
    data.username = userid;
    data.password = password;

    mask();
    $.ajax({
        type: "POST",
        url: "http://119.23.248.43/signin",
        data: JSON.stringify(data),
        dataType: "json",
        success: function (response) {
            unmask();
            console.log(response);
            HandleResponse(response, userid)
        },
        error: function () {
            unmask();
            ErrorNetwork();
        },
        complete: function () {
            unmask();
        }
    });

});

$('.home').click(function (e) {
    window.location.href = '../../../home.html'
});

$('.signup').click(function (e) {
    window.location.href = '../../signup/html/signup.html'
});

$('#signup').click(function (e) {
    window.location.href = '../../signup/html/signup.html'
});

$('.exercise').click(function (e) {
    window.location.href = '../../exercise/html/exercise.html'
});

$('.rank').click(function (e) {
    window.location.href = '../../rank-list/html/rank-list.html'
});

$(document).ready(function () {
    $(".user-info").hover(function () {
        $(".user-msg").fadeIn();
        $(".user-info").css("background-color", "#1a87e8")
    }, function () {
        $(".user-info").css("background-color", "#f7f7f700")
        $(".user-msg").fadeOut(100);

    });
});