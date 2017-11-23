// -- Get elements

//let canvas = document.getElementById("canvas");
let camerasSelect = document.getElementById("camerasSelect");
let inputDelay = document.getElementById("inputDelay");

let videoLiveContainer = document.getElementById("videoLiveContainer");
let videoDelayContainer = document.getElementById("videoDelayContainer");

let videoLive = document.getElementById("videoLive");
let videoDelay1 = document.getElementById("videoDelay1");
let videoDelay2 = document.getElementById("videoDelay2");

let timerDelayVideo;
let swapCount = 0;
let stream;
let mediaRecorder;// = new MediaRecorder(stream);

makeDraggable(videoLiveContainer);
makeDraggable(videoDelayContainer);

document.onkeyup = function(e){
    let LiveRect= videoLiveContainer.getBoundingClientRect();
    let delayRect= videoDelayContainer.getBoundingClientRect();

    if (e.key=="+"){
        videoDelayContainer.style.width =(LiveRect.width+10)+"px";
        videoDelayContainer.style.height = (LiveRect.height+10)+"px";

        videoLiveContainer.style.width = (delayRect.width+10)+"px";
        videoLiveContainer.style.height = (delayRect.height+10)+"px";
    }else if (e.key == "-"){
        videoDelayContainer.style.width =(LiveRect.width-10)+"px";
        videoDelayContainer.style.height = (LiveRect.height-10)+"px";

        videoLiveContainer.style.width = (delayRect.width-10)+"px";
        videoLiveContainer.style.height = (delayRect.height-10)+"px";
    }else if (e.key=="*"){
        videoDelayContainer.style.width = (w+10)+"px";
        videoDelayContainer.style.height = (h+10)+"px";

        videoLiveContainer.style.width = (w+10)+"px";
        videoLiveContainer.style.height = (h+10)+"px";
    }
}

//fill list
navigator
    .mediaDevices
    .enumerateDevices()
    .then(gotDevices)
    .catch(x => console.log("error", x));

//let stream = canvas.captureStream();
//let mediaRecorder;// = new MediaRecorder(stream);
//video.src = window.URL.createObjectURL(stream);

//-------------------------------------------------------

function clickStart() {
    let id = camerasSelect.options[camerasSelect.selectedIndex].value;
    let delay = Number.parseFloat(inputDelay.value.trim());
    if (!delay) {
        alert("select delay");
        return;
    }
    start(id, delay * 1000);
}

function clickStop() {
    stop();
}

//-------------------------------------------------------
function stop() {
    if (timerDelayVideo)
        clearInterval(timerDelayVideo);
    timerDelayVideo = null;

    if (mediaRecorder)
        mediaRecorder.stop();
    mediaRecorder = null;

    if (stream) {
        let track = stream.getTracks()[0];
        track.stop();
    }
    stream = null;

    swapCount = 0;
    show(videoDelay1);
    hide(videoDelay2);

    videoDelay1.onloadeddata = undefined;
    videoDelay2.onloadeddata = undefined;

    videoLive.src = "";
    videoDelay1.src = "";
    videoDelay2.src = "";
}

function start(mediaId, delay) {

    stop();

    swapCount = 0;
    show(videoDelay1);
    hide(videoDelay2);

    videoDelay1.onloadeddata = x => {
        //console.log("data loaded", x.target.id);
        show(videoDelay1);
        hide(videoDelay2);
    }

    videoDelay2.onloadeddata = x => {
        //console.log("data loaded", x.target.id);
        show(videoDelay2);
        hide(videoDelay1);
    }


    console.log(`setting input as: ${mediaId}`);
    navigator.mediaDevices.getUserMedia(
        {
            video: {
                mandatory: {
                    sourceId: mediaId,
                    minWidth: 1280,
                    minHeight: 720
                }
                //deviceId: mediaId,
                // minWidth: 1280,
                // minHeight: 720
                // mandatory: {                    
                // }
            }
        }
    ).then(s => {
        stream = s;
        let track = stream.getVideoTracks()[0];
        let constraints = track.getConstraints();

        videoLive.src = window.URL.createObjectURL(stream);

        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = handleDataAvailable;

        mediaRecorder.start();

        timerDelayVideo = setInterval(
            handleDelayVideoTick
            , delay);

        console.log(videoLive.src);
        console.log(track);
        console.log(constraints);
    }).catch(error => {
        console.error(error);
        alert("error finding camera " + error.message);
    })
}


function handleDelayVideoTick() {
    if (!mediaRecorder)
        return;
    mediaRecorder.stop();
    mediaRecorder.start();
}

function handleDataAvailable({ data }) {
    let oldVid = swapCount == 0 ? videoDelay1 : videoDelay2;
    let newVid = swapCount == 0 ? videoDelay2 : videoDelay1;

    newVid.src = window.URL.createObjectURL(data);

    swapCount = (swapCount + 1) % 2;
    //console.log('data');
}

//-------------------------------------------------------
//-------------------------------------------------------

function gotDevices(deviceInfos) {
    let all = {
        video: [],
        audio: [],
        speaker: []
    };

    for (var i = 0; i !== deviceInfos.length; ++i) {
        let obj = {};
        var deviceInfo = deviceInfos[i];

        obj.id = deviceInfo.deviceId;
        if (deviceInfo.kind === "audioinput") {
            obj.label =
                deviceInfo.label || "Microphone " + (all.audio.length + 1);
            all.audio.push(obj);
        } else if (deviceInfo.kind === "audiooutput") {
            obj.label =
                deviceInfo.label || "Speaker " + (all.speaker.length + 1);
            all.speaker.push(obj);
        } else if (deviceInfo.kind === "videoinput") {
            obj.label = deviceInfo.label || "Camera " + (all.video.length + 1);
            all.video.push(obj);
        }
    }

    console.log(all);

    while (camerasSelect.firstChild) {
        camerasSelect.removeChild(camerasSelect.firstChild);
    }

    for (var i = 0; i < all.video.length; i++) {
        let option = document.createElement('option');
        option.value = all.video[i].id;
        option.innerHTML = all.video[i].label;
        camerasSelect.appendChild(option);
    }
}

//-------------------------------------------------------
//-------------------------------------------------------

function hide(element) {
    element.classList.add("hide");
}
function show(element) {
    element.classList.remove("hide");
}

//-------------------------------------------------------
//-------------------------------------------------------

function makeDraggable(elmnt) {

    //let origPos = elmnt.getBoundingClientRect();

    elmnt.classList.add("draggable");

    //elmnt.style.top = origPos.top + "px";
    //elmnt.style.left = origPos.left + "px";

    let restore_onmouseup;
    let restore_onmousemove;

    let x = 0, y = 0, xOrig = 0, yOrig = 0;
    let topOrig = 0, leftOrig = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        elmnt.classList.add("dragging");
        e = e || window.event;

        restore_onmouseup = document.onmouseup;
        restore_onmousemove = document.onmousemove;

        // get the mouse cursor position at startup:
        xOrig = e.clientX;
        yOrig = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;

        let rect = elmnt.getBoundingClientRect();
        topOrig = parseFloat(elmnt.style.top ||0);
        leftOrig = parseFloat(elmnt.style.left||0);
    }

    function elementDrag(e) {
        e = e || window.event;
        x = xOrig - e.clientX;
        y = yOrig - e.clientY;


        elmnt.style.top = (topOrig - y) + "px";
        elmnt.style.left = (leftOrig - x) + "px";
    }

    function closeDragElement() {
        elmnt.classList.remove("dragging");
        document.onmouseup = restore_onmouseup;
        document.onmousemove = restore_onmousemove;
    }

}
