/*
 * Author: Hcyang
 * Time: 2019-06-25
 */

/**
 * 变量与常量定义
 */
const CODE_SIGNIN_ERR = 602;
const CODE_UNVERIFIED = 603;
const CODE_SIGNIN_SUCC = 701;
const CODE_UNKNOWN_ERR = 900;

var loguser = window.localStorage.getItem("loguser");
var page_score = window.localStorage.getItem("page_score")
var check_array = new Array(4).fill(0);

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
$('#password').focus(function (e) {
    hideMessage()
});

/**
 * 检查用户名正确性
 */
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

/**
 * 检查密码正确性
 */
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
 * @param {string} username 用户名
 */
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

/**
 * 页面跳转
 */
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
 * 切换账号
 */
$('.switch').click(function (e) { 
    window.localStorage.clear();
    $('.user-info').fadeOut();
    $('.total-points').fadeOut();
    setTimeout(() => {
        window.location.href = '../../login/html/login.html'
    }, 700);
});