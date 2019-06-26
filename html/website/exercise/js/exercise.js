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

$('.rank').click(function (e) { 
    var tail = "";
    if(loguser != "")
    {
        tail = "?loguser="+loguser;
    }
    window.location.href = '../../rank-list/html/rank-list.html'+tail
});

// Months start at 0 and the timer caluclates to Midnight
// use month - 1 to get an accurate count down
let ed = new Date(2019, 8 - 1, 13);

function setup() {
    pixelDensity(2.0);
    let canvas = createCanvas(320, 150);
    angleMode(DEGREES);
    canvas.parent('sketch-holder');
}

function draw() {
    let timer = getTimer();
    clear();

    if ((timer.seconds.text) <=0) {
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

    let distance = ed.getTime() - d.getTime();

    let days = distance / (1000 * 60 * 60 * 24);
    Math.floor(days) != 0 ? hmsms = days % Math.floor(days) : hmsms =
        days; // hmsms - hours, minutes, seconds, milliseconds remaining
    let daysText = Math.floor(days);

    let hours = hmsms * 24;
    Math.floor(hours) != 0 ? msms = hours % Math.floor(hours) : msms =
        hours; // msms - minutes, seconds, milliseconds remaining
    let hoursText = Math.floor(hours);

    let minutes = msms * 60;
    Math.floor(minutes) != 0 ? sms = minutes % Math.floor(minutes) : sms =
        minutes; // sms - seconds, milliseconds remaining
    let minutesText = Math.floor(minutes);

    let seconds = sms * 60;
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