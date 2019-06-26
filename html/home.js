/*
 * Author: Hcyang
 * Time: 2019-06-25
 */

var loguser = ""

//get parameters in url
var url = location.search;
var data = new Object();
if(url.indexOf("?") != -1)
{
    var str = url.substr(1);
    var strs = str.split("&");
    for(var i = 0; i < strs.length; i++)
    {
        data[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
    }
}
if("loguser" in data)
{
    loguser = data["loguser"]
    $('.user-id').children(':first').text(loguser);
}

$('.login').click(function (e) { 
    var tail = "";
    if(loguser != "")
    {
        tail = "?loguser="+loguser;
    }
    window.location.href = './website/login/html/login.html'+tail
});

$('.signup').click(function (e) { 
    var tail = "";
    if(loguser != "")
    {
        tail = "?loguser="+loguser;
    }
    window.location.href = './website/signup/html/signup.html'+tail
});

$(document).ready(function () {
    $('.middle-text').addClass('fadein');
    $('.middle-img').addClass('fadein');
});
