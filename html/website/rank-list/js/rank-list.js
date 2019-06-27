/*
 * Author: Hcyang
 * Time: 2019-06-26
 */

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

$('.home').click(function (e) {
    window.location.href = '../../../home.html'
});

$('.login').click(function (e) {
    window.location.href = '../../login/html/login.html'
});

$('.signup').click(function (e) {
    window.location.href = '../../signup/html/signup.html'
});

$('.exercise').click(function (e) {
    window.location.href = '../../exercise/html/exercise.html'
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