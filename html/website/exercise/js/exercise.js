/*
 * Author: Hcyang
 * Time: 2019-06-25
 */

let ed = -1;
let problems = []
let started = 0

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
    if(started == 0)
    {
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
    let distance;

    if (ed == -1) {
        ed = time;
        distance = 0;
    } else {
        distance = d.getTime() - ed;
    }

    if (distance >= 59.9 * 1000) {
        distance = 60 * 1000;
    }

    let seconds = distance / 1000;
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

$(document).ready(function () {
    $('.progress-rate').css('width', '2%');
    $('.middle-top').css('display', 'none');
    $('.middle-bottom').css('display', 'none');
    $('.buttons').css('display', 'none');
});

function showMiddle() {
    $('.middle-top').css('display', 'block');
    $('.middle-bottom').css('display', 'block');
    $('.buttons').css('display', 'block');
}

function handle_problems(data) { 
    console.log(data)
 }

$('.easy').click(function (e) { 
    showMiddle();
    $('.easy').css('background-color', 'rgb(66, 133, 244)');
    $('.easy').css('border-radius', '20px');
    $('.easy').css('color', 'white');
    $('.medium').css('background-color', 'white');
    $('.medium').css('color', 'black');
    $('.hard').css('background-color', 'white');
    $('.hard').css('color', 'black');

    var data = new Object()
    data.level = 1;
    if (problems.length == 0) {
        $.ajax({
            type: "POST",
            url: "http://119.23.248.43/getproblem",
            data: JSON.stringify(data),
            dataType: "json",
            success: function (response) {
                handle_problems(response);
                // started = 1;
            }
        });
    }
});

$('.medium').click(function (e) { 
    $('.easy').css('background-color', 'white');
    $('.easy').css('color', 'black');
    $('.medium').css('background-color', 'rgb(251, 188, 5)');
    $('.medium').css('border-radius', '20px');
    $('.medium').css('color', 'white');
    $('.hard').css('background-color', 'white');
    $('.hard').css('color', 'black');

    var data = new Object()
    data.level = 2;
    if (problems.length == 0) {
        $.ajax({
            type: "POST",
            url: "http://119.23.248.43/getproblem",
            data: JSON.stringify(data),
            dataType: "json",
            success: function (response) {
                console.log(response)
                started = 1;
            }
        });
    }
});

$('.hard').click(function (e) { 
    $('.easy').css('background-color', 'white');
    $('.easy').css('color', 'black');
    $('.medium').css('background-color', 'white');
    $('.medium').css('color', 'black');
    $('.hard').css('background-color', 'rgb(234, 67, 53)');
    $('.hard').css('border-radius', '20px');
    $('.hard').css('color', 'white');

    var data = new Object()
    data.level = 3;
    if (problems.length == 0) {
        $.ajax({
            type: "POST",
            url: "http://119.23.248.43/getproblem",
            data: JSON.stringify(data),
            dataType: "json",
            success: function (response) {
                console.log(response)
                started = 1;
            }
        });
    }
});