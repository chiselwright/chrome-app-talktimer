$(document).ready(function() {
    initialise();
});

function initialise() {
    // default behaviours for notify.js
    $.notify.defaults({ className: "success", autoHideDelay: 2500 });

    // events we want to catch
    $( "#save-options" ).click(function() {
        saveOptions(this);
    });

    // sane defaults
    if (localStorage.countdownMinutes == null || localStorage.countdownMinutes < 0) {
        localStorage.countdownMinutes = 5;
    }
    if (localStorage.countdownSeconds == null || localStorage.countdownSeconds < 0) {
        localStorage.countdownSeconds = 0;
    }
    if (localStorage.warningMinutes == null || localStorage.warningMinutes < 0) {
        localStorage.warningMinutes = 0;
    }
    if (localStorage.warningSeconds == null || localStorage.warningSeconds < 0) {
        localStorage.warningSeconds = 0;
    }

    // load our options
    loadOptions();
    // so that we only ever notify about this at the start
    $.notify("Options Loaded", { arrowShow: false });
}

function loadOptions() {
    // countdown
    $('#countdownMinutes').val( localStorage.countdownMinutes );
    $('#countdownSeconds').val( localStorage.countdownSeconds );
    // warnings
    $('#warningMinutes').val( localStorage.warningMinutes );
    $('#warningSeconds').val( localStorage.warningSeconds );
}

function saveOptions(object) {
    var times, totalCountdownSeconds, totalWarningSeconds;

    // countdown
    times = sanitiseTime(
        $('#countdownMinutes').val(),
        $('#countdownSeconds').val()
    );
    totalCountdownSeconds         = times[0];
    localStorage.countdownMinutes = times[1];
    localStorage.countdownSeconds = times[2];

    // warnings
    times = sanitiseTime(
        $('#warningMinutes').val(),
        $('#warningSeconds').val()
    );
    totalWarningSeconds         = times[0];

    if (totalWarningSeconds >= totalCountdownSeconds) {
        var oldTimes = times;
        times = sanitiseTime(0, totalCountdownSeconds / 2);

        // error message
        $('#warning-starts').notify(
            "Warning can't be before start", {
                autoHideDelay:  8000,
                className:      'error',
                elementPosition:'top left',
            }
        );
        // info about the minutes field
        if (oldTimes[1] != times[1]) {
            $('#warningMinutes').notify(
                "Value changed from " + oldTimes[1], {
                    autoHideDelay:  12000,
                    className:      'info',
                    elementPosition:'bottom left',
                }
            );
        }
        // info about the seconds field
        if (oldTimes[2] != times[2]) {
            $('#warningSeconds').notify(
                "Value changed from " + oldTimes[2], {
                    autoHideDelay:  12000,
                    className:      'info',
                    elementPosition:'bottom left',
                }
            );
        }
    }

    localStorage.warningMinutes = times[1];
    localStorage.warningSeconds = times[2];

    loadOptions();

    $(object).notify('Options Saved');
}

Number.prototype.pad = function(size) {
    var s = String(this);
    if(typeof(size) !== "number"){size = 2;}

    while (s.length < size) {s = "0" + s;}
    return s;
};

function sanitiseTime(minutes, seconds) {
    // numerify the seconds to prevent it being treated as a string and
    // concatenated
    var totalSeconds = (60 * minutes) + (1 * seconds);

    if (totalSeconds <= 0) {
        return [0, 0];
    }

    var min = Math.floor(totalSeconds / 60);
    var sec = totalSeconds - (min * 60);

    return [totalSeconds, min, sec];
}
