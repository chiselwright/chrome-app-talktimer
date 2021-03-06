
var seconds, warningseconds;
var  oktime = true;
var  active = false;
var timerId;

var warningSounded  = false;
var timeUpSounded   = false;
var overrunSounded  = false;

$(document).ready(function() {
    $('body').addClass('time-warning');

    initialiseProperties();

    resetTimer();

    $( "body" ).keypress(function( event ) {
        // unless otherwise stated we don't fade out
        fadeOut=false;
        // make the key control help blocks vanish on a keypress
        if (event.which == 32 ) { // space
            trackKeyPress(event);
            fadeOut=true;
            startstopTimer();
            event.preventDefault();
        }
        else if (event.which == 114 || event.which == 82) { // 'r' and 'R'
            trackKeyPress(event);
            // don't fade out on a reset
            // we'll be showing it again shortly
            resetTimer();
            event.preventDefault();
        }
        else if (event.which == 99 || event.which == 67) { // 'c' and 'C'
            trackKeyPress(event);
            fadeOut=true;
            openOptions(true);
            event.preventDefault();
        }

        if (fadeOut) {
            $('.keyboard-info').fadeTo(600, 0);
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
        if (!overrunSounded) {
            var audio = new Audio("assets/NukeSiren.mp3");
            audio.loop = false;
            audio.play();
            overrunSounded = true;
        };
        clearInterval(timerId);
        warningTimer();
        seconds = -30;
    }
    else if (seconds < 1) {
        if (!timeUpSounded) {
            var audio = new Audio("assets/Inception.mp3");
            audio.loop = false;
            audio.play();
            timeUpSounded = true;
        };
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

    warningSounded = false;
    timeUpSounded  = false;
    overrunSounded = false;

    okTimer();
    // set value from options
    seconds = (localStorage.countdownMinutes * 60)
                +
              (localStorage.countdownSeconds * 1);
    warningseconds = (localStorage.warningMinutes * 60)
                        +
                     (localStorage.warningSeconds * 1);
    showCurrentTime(seconds);

    // make the help text visible again
    $('.keyboard-info').fadeTo(1000, 1);
}

function initialiseProperties() {
    keys = ['countdownMinutes', 'countdownSeconds', 'warningMinutes', 'warningSeconds'];
    for (var i in keys) {
        if(localStorage.getItem(keys[i]) === null) {
            openOptions(true);
            return false; // so we don't open more than we need to
        }
    }
    return true;
}

function openOptions(closeTab) {
    // http://stackoverflow.com/a/16130739
    var optionsUrl = chrome.extension.getURL('options.html');
    location.href = optionsUrl;
}

function okTimer() {
    // remove 'warning' colouring
    $('body').removeClass('time-warning');

    // set back to 'ok' colours
    $('body').addClass('time-ok');
}

function warningTimer() {
    if (!warningSounded) {
        var audio = new Audio("assets/TempleBell.mp3");
        audio.loop = false;
        audio.play();
        warningSounded = true;
    };

    // remove 'ok' colouring
    $('body').removeClass('time-ok');

    // set to 'warning' colours
    $('body').addClass('time-warning');
}
