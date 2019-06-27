/*
 * Author: Hcyang
 * Time: 2019-06-15
 */

const CODE_DNAME_ERR = 600;
const CODE_SIGNUP_SUCC = 700;
const CODE_UNKNOWN_ERR = 900;
const MAX_USERID_LENGTH = 10;


var loguser = window.localStorage.getItem("loguser");
var page_score = window.localStorage.getItem("page_score")
if (loguser == null) {
    loguser = "未登录"
}
if (page_score == null) {
    page_score = 0;
}
$('.user-id').children(':first').text(loguser);
$('.points').children(':first').text("总积分：" + String(page_score));

var check_array = new Array(8).fill(0);

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
$('#email').focus(function (e) {
    hideMessage()
});
$('#password1').focus(function (e) {
    hideMessage()
});
$('#password2').focus(function (e) {
    hideMessage()
});

// Check userid
$('#userid').blur(function (e) {
    var inputbox = '#userid'
    eliminate_error('.check3', 3, inputbox);
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

    //Format check
    var format_error = false;
    for (c in userid) {
        console.log(userid[c])
        if (c >= 10) {
            error = true;
            format_error = true;
            error_input('.check2', 2, inputbox);
            break;
        }

        if (userid[c] >= 'a' && c <= 'z' || userid[c] >= 'A' && c <= 'Z' || userid[c] >= '0' && c <= '9') {
            continue;
        } else {
            error = true;
            format_error = true;
            error_input('.check2', 2, inputbox);
            break;
        }
    }
    if (!format_error) {
        if (check_array[1] == 1) {
            eliminate_error('.check2', 2, inputbox, error);
        }
    }

});

// Check email
$('#email').blur(function (e) {
    var inputbox = '#email'
    var email = $('#email').val();
    var error = false;

    //Empty check
    if (email == "") {
        error = true;
        error_input('.check4', 4, inputbox);
    } else {
        if (check_array[3] == 1) {
            eliminate_error('.check4', 4, inputbox, error);
        }
    }

    //Format check
    if (email.indexOf('@') == -1 || email.indexOf('@') == 0) {
        error = true;
        error_input('.check5', 5, inputbox);
    } else {
        var pos = email.indexOf('@')
        if (email.length - pos != 1) {
            if (check_array[4] == 1) {
                eliminate_error('.check5', 5, inputbox, error);
            }
        } else {
            error = true;
            error_input('.check5', 5, inputbox);
        }
    }

});

// Check password
$('#password1').blur(function (e) {
    var inputbox = '#password1'
    var pwd1 = $('#password1').val();
    var error = false;

    //Empty check
    if (pwd1.length < 8 || pwd1.length > 25) {
        error = true;
        error_input('.check6', 6, inputbox);
    } else {
        if (check_array[5] == 1) {
            eliminate_error('.check6', 6, inputbox, error);
        }
    }

    //Format check
    var format_error = false;
    for (c in pwd1) {
        if (pwd1[c] >= 'a' && c <= 'z' || pwd1[c] >= 'A' && c <= 'Z' || pwd1[c] >= '0' && c <= '9') {
            continue;
        } else {
            error = true;
            format_error = true;
            error_input('.check7', 7, inputbox);
            break;
        }
    }
    if (!format_error) {
        if (check_array[6] == 1) {
            eliminate_error('.check7', 7, inputbox, error);
        }
    }

});

// Check password again
$('#password2').blur(function (e) {
    var inputbox = '#password2'
    var pwd1 = $('#password1').val();
    var pwd2 = $('#password2').val();
    var error = false;

    if (pwd1 != pwd2) {
        error = true;
        error_input('.check8', 8, inputbox);
    } else {
        if (check_array[7] == 1) {
            eliminate_error('.check8', 8, inputbox, error);
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

function HandleResponse(res) {
    unmask();
    var code = res.code;
    var msg = res.msg;

    if (code == CODE_DNAME_ERR) {
        error_input('.check3', 3, '#userid');
    } else if (code == CODE_SIGNUP_SUCC) {
        $("#userid").val("");
        $("#email").val("");
        $("#password1").val("");
        $("#password2").val("");
        showMessageSucess('注册成功', '已发送身份验证邮件')
    } else {
        showMessageFailed('十分抱歉', '服务器开了小差，请稍后再试')
    }
}

function ErrorNetwork() {
    showMessageFailed('网络错误', '请检查网络状态并重试')
}

$('form').submit(function (e) {
    e.preventDefault();

    if (!$('#protocol').get(0).checked) {
        return;
    }

    $('#userid').trigger("blur");
    $('#email').trigger("blur");
    $('#password1').trigger("blur");
    $('#password2').trigger("blur");
    var global_error = false;
    for (var i = 0; i < check_array.length; i++) {
        if (check_array[i] == 1) {
            shake_animation('.check' + (i + 1));
            global_error = true;
        }
    }

    if (global_error) {
        return;
    }

    //send request
    var userid = $('#userid').val();
    var email = $('#email').val();
    var password = $('#password1').val();
    var data = new Object();
    data.username = userid;
    data.email = email;
    data.password = password;

    mask();
    $.ajax({
        type: "POST",
        url: "http://119.23.248.43/signup",
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json",
        success: function (response) {
            unmask();
            console.log(response);
            HandleResponse(response)
        },
        error: function () {
            unmask();
            ErrorNetwork();
        },
        complete: function () {
            unmask();
        }
    });

    return;
});

$('#protocol').change(function (e) {
    if (e.target.checked) {
        $('#submit').css('background-color', 'rgb(0, 168, 98)');
        $('#submit').addClass('submit-active');
    } else {
        $('#submit').css('background-color', 'rgb(194, 194, 194)');
        $('#submit').removeClass('submit-active');
    }
});

$('.home').click(function (e) {
    window.location.href = '../../../home.html'
});

$('.login').click(function (e) {
    window.location.href = '../../login/html/login.html'
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