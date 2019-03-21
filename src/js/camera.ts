import { logToDom } from './helpers';

const video: HTMLVideoElement = document.querySelector('.video');
const logText = document.getElementById('log');

const constraints = {
    audio: false,
    video: true,
};

export function hasGetUserMedia(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

class Camera {}

let currentStream;

export async function getCameras(): Promise<any> {
    try {
        if (!hasGetUserMedia()) {
            console.log('getUserMedia() is not supported by your browser');
            return null;
        }
        const devices = await navigator.mediaDevices.enumerateDevices();
        return devices.filter(device => device.kind === 'videoinput');
    } catch (e) {
        return null;
    }
}

export async function getCameraPermission(deviceId: string): Promise<any> {
    try {
        logToDom('getCameraPermission', logText);
        if (!hasGetUserMedia()) {
            console.log('getUserMedia() is not supported by your browser');
            logToDom('getUserMedia() is not supported by your browser', logText);
            return null;
        }
        logToDom('getCameraPermission2', logText);

        const constraints = {
            video: {
                deviceId: {
                    exact: deviceId,
                },
            },
            audio: false,
        };
        currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        logToDom('getCameraPermission3', logText);

        logToDom('currentStream', logText);
        (window as any).stream = currentStream; // make variable available to browser console
        video.srcObject = currentStream;
        // We can only know the resolution when we pass the stream to the <video> element
        video.onloadedmetadata = () => {
            console.log('GOT IT  asd !', video.videoWidth, video.videoHeight);
        };
        logToDom('return true', logText);
        return true;
    } catch (err) {
        console.error('getUserMedia error: ' + err.name, err);
        if (err.name === 'ConstraintNotSatisfiedError') {
            throw 'The constraints are not supported ' + constraints;
        } else if (err.name === 'PermissionDeniedError') {
            throw 'User denied permission to access the camera. Too bad.';
        }
    }
}

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
