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

    public async getCameras(): Promise<any> {
        try {
            if (!this.hasGetUserMedia) {
                console.log('getUserMedia() is not supported by your browser');
                return null;
            }

            const devices = await navigator.mediaDevices.enumerateDevices();
            this.devices = devices.filter(device => device.kind === 'videoinput');
            return this.devices;
        } catch (e) {
            return null;
        }
    }

    /*
     * Asks the user for access to the camera(s). If granted, selects the 1st camera in the list of devices.
     */
    public async getCameraPermission(): Promise<any> {
        try {
            if (!this.hasGetUserMedia) {
                console.log('getUserMedia() is not supported by your browser');
                return null;
            }

            if (!this.devices) {
                await this.getCameras();
            }
            if (this.devices === null || this.devices.length === 0) {
                console.log('No cameras available');
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
            // (window as any).stream = currentStream; // make variable available to browser console
            this.videoElem.srcObject = this.currentStream;
            // We can only know the resolution when we pass the stream to the <video> element
            this.videoElem.onloadedmetadata = () => {
                console.log('Video resolution: ', this.videoElem.videoWidth, this.videoElem.videoHeight);
                this.cameraResolution = { width: this.videoElem.videoWidth, height: this.videoElem.videoHeight };
            };
            return true;
        } catch (err) {
            console.error('getUserMedia error: ' + err.name, err);
            if (err.name === 'ConstraintNotSatisfiedError') {
                throw 'The constraints are not supported ';
            } else if (err.name === 'PermissionDeniedError') {
                throw 'User denied permission to access the camera. Too bad.';
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

    public async selectNextCamera(): Promise<any> {
        try {
            if (!this.hasGetUserMedia) {
                console.log('getUserMedia() is not supported by your browser');
                return null;
            }
            if (this.devices.length < 2) {
                console.log("There's only one camera, can't switch");
                logToDom("There's only one camera, can't switch", logText);
                return null;
            }

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
                console.log('Video resolution: ', this.videoElem.videoWidth, this.videoElem.videoHeight);
                this.cameraResolution = { width: this.videoElem.videoWidth, height: this.videoElem.videoHeight };
            };
            return true;
        } catch (err) {
            console.error('getUserMedia error: ' + err.name, err);
            logToDom('ERR ' + err, logText);

            if (err.name === 'ConstraintNotSatisfiedError') {
                throw 'The constraints are not supported ';
            } else if (err.name === 'PermissionDeniedError') {
                throw 'User denied permission to access the camera. Too bad.';
            }
        }
    }
}

// let currentStream;
//
// export async function getCameras(): Promise<any> {
//     try {
//         if (!hasGetUserMedia()) {
//             console.log('getUserMedia() is not supported by your browser');
//             return null;
//         }
//         const devices = await navigator.mediaDevices.enumerateDevices();
//         return devices.filter(device => device.kind === 'videoinput');
//     } catch (e) {
//         return null;
//     }
// }
//
// export async function getCameraPermission(deviceId: string): Promise<any> {
//     try {
//         logToDom('getCameraPermission', logText);
//         if (!hasGetUserMedia()) {
//             console.log('getUserMedia() is not supported by your browser');
//             logToDom('getUserMedia() is not supported by your browser', logText);
//             return null;
//         }
//         logToDom('getCameraPermission2', logText);
//
//         const constraints = {
//             video: {
//                 deviceId: {
//                     exact: deviceId,
//                 },
//             },
//             audio: false,
//         };
//         currentStream = await navigator.mediaDevices.getUserMedia(constraints);
//         logToDom('getCameraPermission3', logText);
//
//         logToDom('currentStream', logText);
//         (window as any).stream = currentStream; // make variable available to browser console
//         video.srcObject = currentStream;
//         // We can only know the resolution when we pass the stream to the <video> element
//         video.onloadedmetadata = () => {
//             console.log('GOT IT  asd !', video.videoWidth, video.videoHeight);
//         };
//         logToDom('return true', logText);
//         return true;
//     } catch (err) {
//         console.error('getUserMedia error: ' + err.name, err);
//         if (err.name === 'ConstraintNotSatisfiedError') {
//             throw 'The constraints are not supported ' + constraints;
//         } else if (err.name === 'PermissionDeniedError') {
//             throw 'User denied permission to access the camera. Too bad.';
//         }
//     }
// }

// if (hasGetUserMedia()) {
//     navigator.mediaDevices
//         .getUserMedia(constraints)
//         .then(function(stream) {
//             currentStream = stream;
//             (window as any).stream = stream; // make variable available to browser console
//             video.srcObject = stream;
//             video.onloadedmetadata = () => {
//                 console.log('GOT IT !', video.videoWidth, video.videoHeight);
//             };
//         })
//         .catch(function(error) {
//             if (error.name === 'ConstraintNotSatisfiedError') {
//                 console.error('The constraints are not supported ', constraints);
//             } else if (error.name === 'PermissionDeniedError') {
//                 console.error(
//                     'Permissions have not been granted to use your camera and ' +
//                         'microphone, you need to allow the page access to your devices in ' +
//                         'order for the demo to work.',
//                 );
//             }
//             console.error('getUserMedia error: ' + error.name, error);
//         });
// } else {
//     console.log('getUserMedia() is not supported by your browser');
// }
