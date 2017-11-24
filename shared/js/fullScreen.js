
function requestFullScreen(element) {
    element = element || document.body;
    
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

    if (requestMethod) { // Native full screen.
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

function cancelFullScreen() {
    var requestMethod = document.cancelFullScreen||document.webkitCancelFullScreen||document.mozCancelFullScreen||document.exitFullscreen;
    
    if (requestMethod) { // cancel full screen.
        requestMethod.call(document);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

function toggleFullScreen() {
    var elem = document.body; // Make the body go full screen.
    var isInFullScreen = (document.fullScreenElement && document.fullScreenElement !== null) ||  (document.mozFullScreen || document.webkitIsFullScreen);

    if (isInFullScreen) {
        cancelFullScreen();
    } else {
        requestFullScreen();
    }
    return false;
}