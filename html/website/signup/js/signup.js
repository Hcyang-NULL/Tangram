/*
 * Author: Hcyang
 * Time: 2019-06-15
 */


/**
 * 常量与变量定义
 */
const CODE_DNAME_ERR = 600;
const CODE_SIGNUP_SUCC = 700;
const CODE_UNKNOWN_ERR = 900;
const MAX_USERID_LENGTH = 10;

var loguser = window.localStorage.getItem("loguser");
var page_score = window.localStorage.getItem("page_score")
var check_array = new Array(8).fill(0);

/**
 * 显示错误信息提示
 * @param {string} name 错误信息类名
 * @param {int} index 错误信息编号
 * @param {string} inputbox 对应的输入框
 */
function error_input(name, index, inputbox) {
    $(name).css('display', 'block');
    $(inputbox).css('border-color', '#D44000');
    check_array[index - 1] = 1;
}

/**
 * 消除错误信息
 * @param {string} name 错误信息类名
 * @param {int} index 错误信息编号
 * @param {string} inputbox 对应的输入框
 * @param {bool} error 是否错误
 */
function eliminate_error(name, index, inputbox, error) {
    $(name).css('display', 'none');
    if (!error) {
        $(inputbox).css('border-color', '#000000');
    }
    check_array[index - 1] = 0
}

/**
 * focus时消除错误信息
 */
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

/**
 * 检查用户名正确性
 */
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

/**
 * 检查邮件格式正确性
 */
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

/**
 * 检查密码正确性
 */
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

/**
 * 检查第二遍密码的正确性
 */
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

/**
 * 错误信息抖动动画
 * @param {string} name 类名
 */
function shake_animation(name) {
    $(name).css('animation', 'shake 0.3s');
    setTimeout(function () {
        $(name).css('animation', 'none');
    }, 300);
}

/**
 * 显示蒙层
 */
function mask() {
    $('.loading').css('display', 'block');
}

/**
 * 隐藏蒙层
 */
function unmask() {
    $('.loading').css('display', 'none');
}

/**
 * 显示成功信息提示
 * @param {string} title 标题
 * @param {string} msg 具体信息
 */
function showMessageSucess(title, msg) {
    $('.error-message-succeed').children(':first').children().text(title);
    $('.error-message-succeed').children(':last').children().text(msg);
    $('.error-message-succeed').css('display', 'block');
}

/**
 * 隐藏成功信息提示
 */
function hideMessage() {
    $('.error-message-succeed').children(':first').children().text('');
    $('.error-message-succeed').children(':last').children().text('');
    $('.error-message-succeed').css('display', 'none');
    $('.error-message-failed').children(':first').children().text('');
    $('.error-message-failed').children(':last').children().text('');
    $('.error-message-failed').css('display', 'none');
}

/**
 * 显示失败信息提示
 * @param {string} title 标题
 * @param {string} msg 具体信息
 */
function showMessageFailed(title, msg) {
    $('.error-message-failed').children(':first').children().text(title);
    $('.error-message-failed').children(':last').children().text(msg);
    $('.error-message-failed').css('display', 'block');
}

/**
 * 处理ajax返回数据
 * @param {object} res 返回json数据
 */
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

/**
 * 显示网络错误信息
 */
function ErrorNetwork() {
    showMessageFailed('网络错误', '请检查网络状态并重试')
}

/**
 * 表单提交事件
 */
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

/**
 * 同意用户协议按钮点击事件
 */
$('#protocol').change(function (e) {
    if (e.target.checked) {
        $('#submit').css('background-color', 'rgb(0, 168, 98)');
        $('#submit').addClass('submit-active');
    } else {
        $('#submit').css('background-color', 'rgb(194, 194, 194)');
        $('#submit').removeClass('submit-active');
    }
});

/**
 * 页面跳转
 */
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

/**
 * 页面初始化
 */
$(document).ready(function () {
    $(".user-info").hover(function () {
        $(".user-msg").fadeIn();
        $(".user-info").css("background-color", "#1a87e8")
        $('.user-info').css('cursor', 'pointer');
    }, function () {
        $(".user-info").css("background-color", "#f7f7f700")
        $(".user-msg").fadeOut(100);

    });
    if (loguser == null) {
        $('.user-id').css('display', 'none');
    }
    else
    {
        $('.user-id').children(':first').text("当前用户：" + loguser);
        $('.user-id').fadeIn();
    }
    if (page_score == null) {
        $('.points').css('display', 'none');
        $('.star').css('display', 'none');
    }
    else
    {
        $('.points').children(':first').text("总积分：" + String(page_score));
        $('.points').fadeIn();
        $('.star').fadeIn();
    }
});

/**
 * 退出登录
 */
$('.logout').click(function (e) { 
    window.localStorage.clear();
    $('.user-info').fadeOut();
    $('.total-points').fadeOut();
});

/**
 * 切换用户
 */
$('.switch').click(function (e) { 
    window.localStorage.clear();
    $('.user-info').fadeOut();
    $('.total-points').fadeOut();
    setTimeout(() => {
        window.location.href = '../../login/html/login.html'
    }, 700);
});