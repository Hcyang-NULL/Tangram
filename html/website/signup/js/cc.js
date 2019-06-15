/*
 * Author: Hcyang
 * Time: 2019-06-15
 */

var MAX_USERID_LENGTH = 10;

var check_array = new Array(8).fill(0);

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

    //Format check
    var format_error = false;
    for (c in userid) {
        console.log(userid[c])
        if (c >= 10) {
            error = true;
            format_error = true;
            error_input('.check2', 2, inputbox);
            break;
        }

        if (userid[c] >= 'a' && c <= 'z' || userid[c] >= 'A' && c <= 'Z' || userid[c] >= '0' && c <= '9') {
            continue;
        } else {
            error = true;
            format_error = true;
            error_input('.check2', 2, inputbox);
            break;
        }
    }
    if (!format_error) {
        if (check_array[1] == 1) {
            eliminate_error('.check2', 2, inputbox, error);
        }
    }

});

// Check email
$('#email').blur(function (e) {
    var inputbox = '#email'
    var email = $('#email').val();
    var error = false;

    //Empty check
    if (email == "") {
        error = true;
        error_input('.check4', 4, inputbox);
    } else {
        if (check_array[3] == 1) {
            eliminate_error('.check4', 4, inputbox, error);
        }
    }

    //Format check
    if (email.indexOf('@') == -1 || email.indexOf('@') == 0) {
        error = true;
        error_input('.check5', 5, inputbox);
    } else {
        var pos = email.indexOf('@')
        if (email.length - pos != 1) {
            if (check_array[4] == 1) {
                eliminate_error('.check5', 5, inputbox, error);
            }
        } else {
            error = true;
            error_input('.check5', 5, inputbox);
        }
    }

});

// Check password
$('#password1').blur(function (e) {
    var inputbox = '#password1'
    var pwd1 = $('#password1').val();
    var error = false;

    //Empty check
    if (pwd1.length < 8 || pwd1.length > 25) {
        error = true;
        error_input('.check6', 6, inputbox);
    } else {
        if (check_array[5] == 1) {
            eliminate_error('.check6', 6, inputbox, error);
        }
    }

    //Format check
    var format_error = false;
    for (c in pwd1) {
        if (pwd1[c] >= 'a' && c <= 'z' || pwd1[c] >= 'A' && c <= 'Z' || pwd1[c] >= '0' && c <= '9') {
            continue;
        } else {
            error = true;
            format_error = true;
            error_input('.check7', 7, inputbox);
            break;
        }
    }
    if (!format_error) {
        if (check_array[6] == 1) {
            eliminate_error('.check7', 7, inputbox, error);
        }
    }

});

// Check password again
$('#password2').blur(function (e) {
    var inputbox = '#password2'
    var pwd1 = $('#password1').val();
    var pwd2 = $('#password2').val();
    var error = false;

    if (pwd1 != pwd2) {
        error = true;
        error_input('.check8', 8, inputbox);
    } else {
        if (check_array[7] == 1) {
            eliminate_error('.check8', 8, inputbox, error);
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

    if(!$('#protocol').get(0).checked)
    {
        return;
    }

    $('#userid').trigger("blur");
    $('#email').trigger("blur");
    $('#password1').trigger("blur");
    $('#password2').trigger("blur");
    var global_error = false;
    for (var i = 0; i < check_array.length; i++) {
        if (check_array[i] == 1) {
            shake_animation('.check' + (i + 1));
            global_error = true;
        }
    }

    

    return;
});

$('#protocol').change(function (e) { 
    if(e.target.checked)
    {
        $('#submit').css('background-color', 'rgb(0, 168, 98)');
        $('#submit').addClass('submit-active');
    }
    else
    {
        $('#submit').css('background-color', 'rgb(194, 194, 194)');
        $('#submit').removeClass('submit-active');
    }
});

$('.login').click(function (e) { 
    window.location.href = '../../login/html/login.html'
});

$('.home').click(function (e) { 
    window.location.href = '../../../home.html'
});