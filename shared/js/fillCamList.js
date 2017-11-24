
function fillCamList(cameraMenu) {
    if (!(cameraMenu instanceof Element)) {
        cameraMenu = document.getElementById(cameraMenu);
    }

    navigator
        .mediaDevices
        .enumerateDevices()
        .then(gotDevices)
        .catch(x => console.log("error", x));

    function clearMenu() {
        while (cameraMenu.firstChild) {
            cameraMenu.removeChild(cameraMenu.firstChild);
        }
    }

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

        clearMenu();

        for (var i = 0; i < all.video.length; i++) {
            let option = document.createElement('option');
            option.value = all.video[i].id;
            option.innerHTML = all.video[i].label;
            cameraMenu.appendChild(option);
        }
    }
}