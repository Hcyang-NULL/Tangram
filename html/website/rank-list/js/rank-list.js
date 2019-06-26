/*
 * Author: Hcyang
 * Time: 2019-06-26
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

$('.home').click(function (e) { 
    var tail = "";
    if(loguser != "")
    {
        tail = "?loguser="+loguser;
    }
    window.location.href = '../../../home.html'+tail
});

$('.login').click(function (e) { 
    var tail = "";
    if(loguser != "")
    {
        tail = "?loguser="+loguser;
    }
    window.location.href = '../../login/html/login.html'+tail
});

$('.signup').click(function (e) { 
    var tail = "";
    if(loguser != "")
    {
        tail = "?loguser="+loguser;
    }
    window.location.href = '../../signup/html/signup.html'+tail
});

$('.exercise').click(function (e) { 
    var tail = "";
    if(loguser != "")
    {
        tail = "?loguser="+loguser;
    }
    window.location.href = '../../exercise/html/exercise.html'+tail
});