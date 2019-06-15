
var check_array = new Array(4).fill(0);

function error_input(name, index, inputbox) {
    $(name).css('display', 'block');
    $(inputbox).css('border-color', '#D44000');
    check_array[index - 1] = 1;
}

function eliminate_error(name, index, inputbox, error) {
    $(name).css('display', 'none');
    if (!error) {
        $(inputbox).css('border-color', '#000000');
    }
    check_array[index - 1] = 0
}

// Check userid
$('#userid').blur(function (e) {
    var inputbox = '#userid'
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

// Check password
$('#password').blur(function (e) {
    var inputbox = '#password'
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

function shake_animation(name) {
    $(name).css('animation', 'shake 0.3s');
    setTimeout(function () {
        $(name).css('animation', 'none');
    }, 300);
}

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
});


$('.signup').click(function (e) { 
    window.location.href = '../../signup/html/signup.html'
});

$('#signup').click(function (e) { 
    window.location.href = '../../signup/html/signup.html'
});

$('.home').click(function (e) { 
    window.location.href = '../../../home.html'
});