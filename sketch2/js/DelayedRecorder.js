class DelayedRecorder {

    constructor(stream) {

        this._isRunning = false;
        this._delayMillis = 0;
        this._stream = stream;

        this._mediaRecorder = new MediaRecorder(stream);
        this._track = stream.getVideoTracks()[0];
        //let constraints = track.getConstraints();

        //event (either recorder-data-blob or live-video|webcam)
        this.onNewData = undefined;
    }

    set delayMillis(value) {
        if (value === this._delayMillis)
            return;

        this._delayMillis = value;

        if (this._delayMillis > 0) {
            //from media recorder
            // start/restart  recorder
            // set/reset timer
            // notify new stream event (null?)
        } else {
            //live from stream
            // stop recorder
            // stop timer
            // notify new stream event
        }
    }

    get delayMillis() {
        return this._delayMillis;
    }

    start() {
        if (this._delayMillis > 0) {
            this._mediaRecorder.start();
        }
        this._isRunning = true;
    }

    stop() {
        this._isRunning = false;
        //stop track
    }
}