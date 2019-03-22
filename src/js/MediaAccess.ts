import { logToDom } from './helpers';

const logText = document.getElementById('log');

export class MediaAccess {
    // True if browser is compatible
    public hasGetUserMedia: boolean;
    // True is user has granted access
    public hasCameraAccess: boolean;

    // List of cameras available
    private devices: any[];
    // Index of the active camera
    private currentDevice: number;
    // Current camera resolution, only available until stream is passed to <video> element
    private cameraResolution: { width: number; height: number };
    // Current active camera stream
    private currentStream: MediaStream;
    // Video HTML element in which to output the stream
    private videoElem: HTMLVideoElement;

    public constructor(video: HTMLVideoElement) {
        this.hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
        this.hasCameraAccess = false;
        this.devices = null;
        this.currentDevice = -1;
        this.videoElem = video;
    }

    /*
     * Get the available cameras in the system
     */
    public async getCameras(): Promise<MediaDeviceInfo[]> {
        if (!this.hasGetUserMedia) {
            throw 'Your browser doesn\'t support media access. Please use iOS Safari or Android Chrome.';
        }
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            this.devices = devices.filter(device => device.kind === 'videoinput');
            return this.devices;
        } catch (e) {
            throw e;
        }
    }

    /*
     * Asks the user for access to the camera(s). If granted, selects the 1st camera in the list of devices.
     */
    public async getCameraPermission(): Promise<boolean> {
        if (!this.hasGetUserMedia) {
            throw 'Your browser doesn\'t support media access. Please use iOS Safari or Android Chrome.';
        }
        try {
            if (!this.devices) {
                await this.getCameras();
            }
            if (this.devices === null || this.devices.length === 0) {
                logToDom('No cameras available', logText);
                return null;
            }

            // Select 1st camera in list of devices
            const constraints = {
                video: {
                    deviceId: {
                        exact: this.devices[0].deviceId,
                    },
                },
                audio: false,
            };

            this.currentStream = await navigator.mediaDevices.getUserMedia(constraints);
            this.currentDevice = 0;
            this.videoElem.srcObject = this.currentStream;
            // We can only know the resolution when we pass the stream to the <video> element
            this.videoElem.onloadedmetadata = () => {
                this.cameraResolution = { width: this.videoElem.videoWidth, height: this.videoElem.videoHeight };
            };
            return true;
        } catch (err) {
            console.error('getUserMedia error: ' + err.name, err);
            if (err.name === 'ConstraintNotSatisfiedError') {
                throw 'The constraints are not supported';
            } else if (err.name === 'PermissionDeniedError' || err.name === 'NotAllowedError') {
                throw 'User denied camera use 😒';
            } else {
                throw err;
            }
        }
    }

    /*
     * Needed deinitialization for camera switch
     */
    public stopCurrentStream() {
        if (this.currentStream) {
            this.currentStream.getVideoTracks().forEach(track => {
                track.stop();
            });
            this.videoElem.srcObject = null;
        }
    }

    /*
     * Selects next camera on the list
     */
    public async selectNextCamera(): Promise<boolean> {
        if (!this.hasGetUserMedia) {
            throw 'Your browser doesn\'t support media access. Please use iOS Safari or Android Chrome.';
        }
        if (this.devices.length < 2) {
            throw "There's only one camera, can't switch";
        }
        try {
            // Next camera available
            this.currentDevice = (this.currentDevice + 1) % this.devices.length;
            const constraints = {
                video: {
                    deviceId: {
                        exact: this.devices[this.currentDevice].deviceId,
                    },
                },
                audio: false,
            };
            this.stopCurrentStream();
            this.currentStream = await navigator.mediaDevices.getUserMedia(constraints);
            // (window as any).stream = currentStream; // make variable available to browser console
            this.videoElem.srcObject = this.currentStream;
            // We can only know the resolution when we pass the stream to the <video> element
            this.videoElem.onloadedmetadata = () => {
                this.cameraResolution = { width: this.videoElem.videoWidth, height: this.videoElem.videoHeight };
            };
            return true;
        } catch (err) {
            console.error('getUserMedia error: ' + err.name, err);
            if (err.name === 'ConstraintNotSatisfiedError') {
                throw 'The constraints are not supported';
            } else if (err.name === 'PermissionDeniedError' || err.name === 'NotAllowedError') {
                throw 'User denied camera use 😒';
            } else {
                throw err;
            }
        }
    }
}
