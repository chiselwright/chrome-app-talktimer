
var seconds, warningseconds;
var  oktime = true;
var  active = false;
var timerId;

$(document).ready(function() {
    $('body').addClass('time-warning');

    resetTimer();

    $( "body" ).keypress(function( event ) {
        if (event.which == 32 ) { // space
            startstopTimer();
            event.preventDefault();
        }
        else if (event.which == 114 || event.which == 82) { // 'r' and 'R'
            resetTimer();
            event.preventDefault();
        }
    });
});

function startstopTimer() {
    if (active) {
        clearInterval(timerId);
    }
    else {
        timerId = setInterval(function() { tick(); }, 1000);
    }
    // toggle the active state
    active=!active;
}


Number.prototype.pad = function(size) {
    var s = String(this);
    if(typeof(size) !== "number"){size = 2;}

    while (s.length < size) {s = "0" + s;}
    return s;
}

function tick() {
    seconds = seconds - 1;

    if (seconds < -30) {
        clearInterval(timerId);
        warningTimer();
        seconds = -30;
    }
    else if (seconds < 1) {
        clearInterval(timerId);
        timerId = setInterval(function() { tick(); }, 400);
        oktime = !oktime;
        if (oktime) {
            okTimer();
        }
        else {
            warningTimer();
        }
    }
    else if (seconds < warningseconds) {
        warningTimer();
    }

    showCurrentTime(seconds);
}

function showCurrentTime (seconds) {
    if (seconds >= 0) {
        var min = Math.floor(seconds / 60);
        var sec = seconds - (min * 60);

        $('#timer-minutes').text(min.pad());
        $('#timer-seconds').text(sec.pad());

        $(document).attr('title', min.pad() + 'm ' + sec.pad() + 's');
    }
}

function resetTimer() {
    if (timerId != null) {
        clearInterval(timerId);
        active = false;
    }
    okTimer();
    // set value from options
    seconds = (localStorage.countdownMinutes * 60)
                +
              (localStorage.countdownSeconds * 1);
    warningseconds = (localStorage.warningMinutes * 60)
                        +
                     (localStorage.warningSeconds * 1);
    showCurrentTime(seconds);
}

function okTimer() {
    // remove 'warning' colouring
    $('body').removeClass('time-warning');

    // set back to 'ok' colours
    $('body').addClass('time-ok');
}

function warningTimer() {
    // remove 'ok' colouring
    $('body').removeClass('time-ok');

    // set to 'warning' colours
    $('body').addClass('time-warning');
}
