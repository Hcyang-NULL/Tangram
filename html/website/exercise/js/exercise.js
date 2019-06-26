/*
 * Author: Hcyang
 * Time: 2019-06-25
 */

const TOTAL_PROBLEM = 20;

let ed = -1;
let problems = [
    [],
    [],
    []
]
let started = 0
let now_problem_index = 0;
let now_problem_formula = "";
let now_problem_correct = "";
let now_level = -1;
let now_time;
let record = [];

var loguser = ""
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

$('.home').click(function (e) {
    var tail = "";
    if (loguser != "") {
        tail = "?loguser=" + loguser;
    }
    window.location.href = '../../../home.html' + tail
});

$('.login').click(function (e) {
    var tail = "";
    if (loguser != "") {
        tail = "?loguser=" + loguser;
    }
    window.location.href = '../../login/html/login.html' + tail
});

$('.signup').click(function (e) {
    var tail = "";
    if (loguser != "") {
        tail = "?loguser=" + loguser;
    }
    window.location.href = '../../signup/html/signup.html' + tail
});

$('.rank').click(function (e) {
    var tail = "";
    if (loguser != "") {
        tail = "?loguser=" + loguser;
    }
    window.location.href = '../../rank-list/html/rank-list.html' + tail
});

function setup() {
    // console.log('setup')
    pixelDensity(2.0);
    let canvas = createCanvas(320, 150);
    angleMode(DEGREES);
    canvas.parent('sketch-holder');
}

function draw() {
    // console.log('draw')
    if (started == 0) {
        return;
    }

    let timer = getTimer();
    clear();

    if ((timer.seconds.text) <= 0) {
        let zeroTime = {
            "seconds": {
                "text": 0,
                "remain": 0,
                "map": -89
            },
            "milli": {
                "text": -89
            }
        };

        shapeCreator(zeroTime);

    } else {
        shapeCreator(timer);
    }


}

function shapeCreator(timer) {
    stroke(220);
    strokeWeight(1);
    fill(255);
    ellipse(160, 65, 90, 90);

    stroke(48, 188, 200);
    noFill();
    strokeWeight(3);
    strokeCap(ROUND);

    arc(160, 65, 90, 90, 270, timer.seconds.map);

    textSize(24);
    textAlign(CENTER);
    textFont('DINPro-Light');
    noStroke();
    fill(48, 188, 200);

    text(Math.round(timer.seconds.text), 160, 67);

    textSize(10);
    textAlign(CENTER);
    fill(125);
    text("SECS", 160, 82);
}

function getTimer() {
    let d = new Date();
    let time = d.getTime()

    if (ed == -1) {
        ed = time;
        now_time = 0;
    } else if (ed == -2) {
        now_time = 0;
    } else {
        now_time = d.getTime() - ed;
    }

    if (now_time >= 59.9 * 1000) {
        now_time = 60 * 1000;
    }

    let seconds = now_time / 1000;
    Math.floor(seconds) != 0 ? ms = seconds % Math.floor(seconds) : ms = seconds; // ms - milliseconds remaining
    let secondsText = Math.floor(seconds);

    let milliText = Math.round(ms * 1000);
    let milli = ms * 1000;

    let finalTime = {
        "seconds": {
            "text": secondsText,
            "remain": ms,
            "map": map(seconds * 1000, 60000, 0, 269, -89)
        },
        "milli": {
            "text": milliText
        }
    };

    return finalTime;

}

function hideMiddle() {
    $('.middle-top').css('display', 'none');
    $('.middle-bottom').css('display', 'none');
    $('.buttons').css('display', 'none');
}

function init() {
    $('.progress-rate').css('width', '0%');
    hideMiddle();
    $('#next-q').css('display', 'block');
    ed = -1;
    problems = [
        [],
        [],
        []
    ]
    started = 0
    now_problem_index = 0;
    now_problem_formula = "";
    now_problem_correct = "";
    now_level = -1;
    now_time;
    record = [];
    $('table').empty();
}

$(document).ready(function () {
    init();
    $('html').addClass('scroll');
});

function showMiddle() {
    $('.middle-top').css('display', 'block');
    $('.middle-bottom').css('display', 'block');
    $('.buttons').css('display', 'block');
}

function handle_problems(data, level) {
    now_level = level;
    started = 1;
    showMiddle();
    console.log(data)

    problems[level - 1] = data.problems;
    $('.formula').children(':first').text(problems[level - 1][now_problem_index][0]);

    now_problem_formula = problems[level - 1][now_problem_index][0];
    now_problem_correct = problems[level - 1][now_problem_index][1];

    now_problem_index++;
    $('.answer').attr('autofocus', 'autofocus');

    var rate = "0%";
    $('.progress-rate').css('width', rate);
}

function showLoading() {
    $('.loading').css('display', 'block');
}

function hideLoading() {
    $('.loading').css('display', 'none');
}

$('.easy').click(function (e) {
    init();
    $('.finish').css('display', 'none');
    $('.easy').css('background-color', 'rgb(66, 133, 244)');
    $('.easy').css('border-radius', '20px');
    $('.easy').css('color', 'white');
    $('.medium').css('background-color', 'white');
    $('.medium').css('color', 'black');
    $('.hard').css('background-color', 'white');
    $('.hard').css('color', 'black');

    showLoading();

    var data = new Object()
    data.level = 1;
    $.ajax({
        type: "POST",
        url: "http://119.23.248.43/getproblem",
        data: JSON.stringify(data),
        dataType: "json",
        success: function (response) {
            handle_problems(response, 1);
        },
        complete: function () {
            hideLoading();
        }
    });
});

$('.medium').click(function (e) {
    init();
    $('.finish').css('display', 'none');
    $('.easy').css('background-color', 'white');
    $('.easy').css('color', 'black');
    $('.medium').css('background-color', 'rgb(251, 188, 5)');
    $('.medium').css('border-radius', '20px');
    $('.medium').css('color', 'white');
    $('.hard').css('background-color', 'white');
    $('.hard').css('color', 'black');

    showLoading();

    var data = new Object()
    data.level = 2;
    $.ajax({
        type: "POST",
        url: "http://119.23.248.43/getproblem",
        data: JSON.stringify(data),
        dataType: "json",
        success: function (response) {
            handle_problems(response, 2);
        },
        complete: function () {
            hideLoading();
        }
    });
});

$('.hard').click(function (e) {
    init();
    $('.finish').css('display', 'none');
    $('.easy').css('background-color', 'white');
    $('.easy').css('color', 'black');
    $('.medium').css('background-color', 'white');
    $('.medium').css('color', 'black');
    $('.hard').css('background-color', 'rgb(234, 67, 53)');
    $('.hard').css('border-radius', '20px');
    $('.hard').css('color', 'white');

    showLoading();

    var data = new Object()
    data.level = 3;
    $.ajax({
        type: "POST",
        url: "http://119.23.248.43/getproblem",
        data: JSON.stringify(data),
        dataType: "json",
        success: function (response) {
            handle_problems(response, 3);
        },
        complete: function () {
            hideLoading();
        }
    });
});

function calcu_score(right) {
    if (right == 0) {
        return 0;
    } else {
        var score = 0;
        score += now_level;
        if (now_level == 1 && now_time <= 5000) {
            score += 0.2 * (5000 - now_time) / 1000;
        } else if (now_level == 2 && now_time <= 10000) {
            score += 0.2 * (10000 - now_time) / 1000;
        } else if (now_level == 3 && now_time <= 20000) {
            score += 0.2 * (20000 - now_time) / 1000;
        }
        return parseFloat(score.toFixed(2));
    }
}

$('#next-q').click(function (e) {
    var user_answer = $('.answer').val();
    $('.answer').val('');
    var now_score = 0;
    if (String(user_answer) == now_problem_correct) {
        now_score = calcu_score(1);
    } else {
        now_score = calcu_score(0);
    }

    //record
    var temp_record = [];
    temp_record.push(now_problem_index);
    temp_record.push(now_problem_formula);
    temp_record.push(user_answer);
    temp_record.push(now_problem_correct);
    temp_record.push(now_score);
    temp_record.push(parseFloat((now_time / 1000).toFixed(1)));
    ed = -1;

    $('.formula').children(':first').text(problems[now_level - 1][now_problem_index][0]);

    now_problem_formula = problems[now_level - 1][now_problem_index][0];
    now_problem_correct = problems[now_level - 1][now_problem_index][1];

    record.push(temp_record);
    now_problem_index++;


    if (now_problem_index == TOTAL_PROBLEM) {
        $('#next-q').css('display', 'none');
    }

    var rate = String((((now_problem_index - 1) / TOTAL_PROBLEM) * 100).toFixed(0)) + "%";
    $('.progress-rate').css('width', rate);
});

function fill_table() {
    console.log(record);
    var total_score = 0;
    var total_time = 0;
    var head = "<tr><td>编号</td><td>题目</td><td>你的答案</td><td>正确答案</td><td>得分</td><td>用时</td></tr>"
    $('table').append(head);
    for (var i = 0; i < record.length; i++) {
        var item;
        total_time += record[i][5];
        if (record[i][4] == 0) {
            item = "<tr><td>" + String(record[i][0]) + "</td><td>" + String(record[i][1]) +
                '</td><td style="color:rgb(234, 67, 53)">' + String(record[i][2]) + "</td><td>" + String(record[i][3]) + "</td><td>" +
                String(record[i][4]) + "</td><td>" + String(record[i][5]) + "s</td></tr>"
            $('table').append(item);
        } else {
            total_score += record[i][4];
            item = "<tr><td>" + String(record[i][0]) + "</td><td>" + String(record[i][1]) +
                '</td><td  style="color:rgb(52, 168, 83)">' + String(record[i][2]) + "</td><td>" + String(record[i][3]) + "</td><td>" +
                String(record[i][4]) + "</td><td>" + String(record[i][5]) + "s</td></tr>"
            $('table').append(item);
        }
    }
    var statistic = "<tr><td>总计</td><td></td><td></td><td></td><td>" +
        String(total_score.toFixed(2)) + "</td><td>" + String(total_time.toFixed(1)) + "s</td></tr>"
    console.log(statistic);
    $('table').append(statistic);
    $('.mask').css('display', 'block');
    $('.apprasial').css('display', 'block');
    $('html').removeClass('scroll');
}

$('#ok').click(function (e) {
    var user_answer = $('.answer').val();
    $('.answer').val('');
    var now_score = 0;
    if (String(user_answer) == now_problem_correct) {
        now_score = calcu_score(1);
    } else {
        now_score = calcu_score(0);
    }

    //record
    var temp_record = [];
    temp_record.push(now_problem_index);
    temp_record.push(now_problem_formula);
    temp_record.push(user_answer);
    temp_record.push(now_problem_correct);
    temp_record.push(now_score);
    temp_record.push(parseFloat((now_time / 1000).toFixed(1)));
    ed = -2;

    record.push(temp_record);

    var rate = "100%";
    $('.progress-rate').css('width', rate);

    hideMiddle();

    fill_table();
});

function onKeyPress(e) {
    var keyCode = null;

    if (e.which)
        keyCode = e.which;
    else if (e.keyCode)
        keyCode = e.keyCode;

    if (keyCode == 13) {
        if (now_problem_index == TOTAL_PROBLEM) {
            $('#ok').trigger('click');
        } else {
            $('#next-q').trigger('click');
        }
        return false;
    }
    return true;
}

$('#back').click(function (e) {
    $('.mask').fadeOut();
    $('.apprasial').fadeOut();
    init();
    $('.finish').css('display', 'block');
    $('html,body').animate({scrollTop:0},'fast');
    $('html').addClass('scroll');
});
