/*
 * Author: Hcyang
 * Time: 2019-06-25
 */

// window.localStorage.clear();
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

$('.login').click(function (e) {
    window.location.href = './website/login/html/login.html'
});

$('.signup').click(function (e) {
    window.location.href = './website/signup/html/signup.html'
});

$('.exercise').click(function (e) {
    window.location.href = './website/exercise/html/exercise.html'
});

$('.rank').click(function (e) {
    window.location.href = './website/rank-list/html/rank-list.html'
});

$(document).ready(function () {
    $('.middle-text').addClass('fadein');
    $('.middle-img').addClass('fadein');
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