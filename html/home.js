/*
 * Author: Hcyang
 * Time: 2019-06-25
 */

// window.localStorage.clear();
var loguser = window.localStorage.getItem("loguser");
var page_score = window.localStorage.getItem("page_score")


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


$(document).ready(function () {
    $(".user-info").hover(function () {
        $(".user-msg").fadeIn();
        $(".user-info").css("background-color", "#1a87e8")
        $('.user-info').css('cursor', 'pointer');
    }, function () {
        $(".user-info").css("background-color", "#f7f7f700")
        $(".user-msg").fadeOut(100);

    });
});

$('.logout').click(function (e) { 
    window.localStorage.clear();
    $('.user-info').fadeOut();
    $('.total-points').fadeOut();
});

$('.switch').click(function (e) { 
    window.localStorage.clear();
    $('.user-info').fadeOut();
    $('.total-points').fadeOut();
    setTimeout(() => {
        window.location.href = './website/login/html/login.html'
    }, 700);
});