// https://developer.chrome.com/extensions/tut_analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-25425412-11']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

function trackButtonClick(e) {
    _gaq.push(['_trackEvent', 'click', e.target.id]);
};

function trackKeyPress(e) {
    var key = String.fromCharCode(e.which);
    if (key === ' ') {
        key = 'Space';
    }
    _gaq.push(['_trackEvent', 'keypress', key]);
};

$(document).ready(function() {
    $('button').click(function(e) {
        trackButtonClick(e);
    });
});
