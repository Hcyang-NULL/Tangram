/*
 * Author: Hcyang
 * Time: 2019-06-26
 */

var readyData = 0
var error = 0
var finish = 0

var loguser = window.localStorage.getItem("loguser");
var page_score = window.localStorage.getItem("page_score")


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
        $(".user-info").css("background-color", "#1a87e8");
        $('.user-info').css('cursor', 'pointer');
    }, function () {
        $(".user-info").css("background-color", "#f7f7f700")
        $(".user-msg").fadeOut(100);
    });
    if (loguser == null) {
        $('.user-id').css('display', 'none');
        $('.user-info').css('display', 'none');
    }
    else
    {
        $('.user-id').children(':first').text("当前用户：" + loguser);
        $('.user-info').css('display', 'block');
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

function showLoading() {
    $('.loading').css('display', 'block');
}

function hideLoading() {  
    $('.loading').css('display', 'none');
}

function hideTable() {
    $('.rank-list').css('display', 'none');
    $('.info').css('display', 'none');
}

function showTable() {
    hideLoading();
    $('.error').css('display', 'none');
    $('.rank-list').css('display', 'block');
    $('.info').css('display', 'block');
}

function handle_score(res) {
    if(res.code == 704)
    {
        wait(2);
    }
    else
    {
        wait(0);
        return;
    }

    var grecord = res.grecord

    $('.rank-table').empty();
    var head = "<tr><td>排名</td><td>用户</td><td>总积分</td></tr>"
    $('.rank-table').append(head);

    for(var i = 0; i < grecord.length; i++)
    {
        var temp;
        if(grecord[i][1] == loguser)
        {
            temp = '<tr style="color:red"><td>'+String(grecord[i][0])+"</td><td>"+
            String(grecord[i][1])+"</td><td>"+String(grecord[i][2])+"</td></tr>"
        }   
        else
        {
            temp = "<tr><td>"+String(grecord[i][0])+"</td><td>"+
            String(grecord[i][1])+"</td><td>"+String(grecord[i][2])+"</td></tr>"
        }
        $('.rank-table').append(temp);
    }
}

function handle_easydata(res) {
    if(res.code == 705)
    {
        wait(2);
    }
    else
    {
        wait(0);
        return;
    }
    
    var acc_rate = (parseFloat(res.acc_rate)*100).toFixed(2)+"%";
    var time_rate = (parseFloat(res.time_rate)).toFixed(2)+"s";

    $('.easy-table').empty();
    var head = "<tr><td>难度</td><td>正确率</td><td>平均时间</td></tr>"
    $('.easy-table').append(head);

    var temp = "<tr><td>简单</td><td>"+String(acc_rate)+"</td><td>"+String(time_rate)+"</td></tr>";
    $('.easy-table').append(temp);
}

function handle_mediumdata(res) {
    if(res.code == 706)
    {
        wait(2);
    }
    else
    {
        wait(0);
        return;
    }
    
    var acc_rate = (parseFloat(res.acc_rate)*100).toFixed(2)+"%";
    var time_rate = (parseFloat(res.time_rate)).toFixed(2)+"s";

    $('.medium-table').empty();
    var head = "<tr><td>难度</td><td>正确率</td><td>平均时间</td></tr>"
    $('.medium-table').append(head);

    var temp = "<tr><td>中等</td><td>"+String(acc_rate)+"</td><td>"+String(time_rate)+"</td></tr>";
    $('.medium-table').append(temp);
}

function handle_harddata(res) {
    if(res.code == 707)
    {
        wait(2);
    }
    else
    {
        wait(0);
        return;
    }
    
    var acc_rate = (parseFloat(res.acc_rate)*100).toFixed(2)+"%";
    var time_rate = (parseFloat(res.time_rate)).toFixed(2)+"s";

    $('.hard-table').empty();
    var head = "<tr><td>难度</td><td>正确率</td><td>平均时间</td></tr>"
    $('.hard-table').append(head);

    var temp = "<tr><td>困难</td><td>"+String(acc_rate)+"</td><td>"+String(time_rate)+"</td></tr>";
    $('.hard-table').append(temp);
}

function wait(type) {
    console.log(String(type)+"  "+String(readyData)+"  "+String(finish))
    if(type == 0)
    {
        error++;
        hideLoading();
        $('.error').css('display', 'block');
    }
    else if(type == 2)
    {
        readyData++;
        if(readyData == 4)
        {
            showTable();
        }
    }

}

$(document).ready(function () {
    hideTable();
    $('error').css('display', 'none');

    if(loguser == null)
    {
        hideTable();
        $('.unverify').css('display', 'block');
        return;
    }
    else
    {
        $('.unverify').css('display', 'none');
    }

    showLoading();

    var data = new Object();
    data.username = loguser;

    $.ajax({
        type: "POST",
        url: "http://119.23.248.43/geteasydata",
        data: JSON.stringify(data),
        dataType: "json",
        success: function (response) {
            console.log(response)
            handle_easydata(response);
        },
        error: function () {
            wait(0);
        },
        complete: function () {  
        }
    });

    $.ajax({
        type: "POST",
        url: "http://119.23.248.43/getmediumdata",
        data: JSON.stringify(data),
        dataType: "json",
        success: function (response) {
            console.log(response)
            handle_mediumdata(response)
        },
        error: function () {
            wait(0);
        },
        complete: function () {  
        }
    });

    $.ajax({
        type: "POST",
        url: "http://119.23.248.43/getharddata",
        data: JSON.stringify(data),
        dataType: "json",
        success: function (response) {
            console.log(response)
            handle_harddata(response);
        },
        error: function () {
            wait(0);
        },
        complete: function () {  
        }
    });

    $.ajax({
        type: "POST",
        url: "http://119.23.248.43/getscorerank",
        data: JSON.stringify(data),
        dataType: "json",
        success: function (response) {
            console.log(response)
            handle_score(response);
        },
        error: function () {
            wait(0);
        },
        complete: function () {  
        }
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
        window.location.href = '../../login/html/login.html'
    }, 700);
});