
fillCamList("cameraMenu");

// get media => stream => recorder => video1|2
//                     => videoLive

let gl = new GlPlayer('outputCanvas');
gl.start();

setTimeout(function() {
    //gl.stop();
}, 1000);

let md = new DelayedRecorder(null);
