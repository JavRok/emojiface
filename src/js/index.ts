import 'normalize.css';
import '../css/main.css';
import { logToDom } from './helpers';

import { hasGetUserMedia, getCameras, getCameraPermission } from './camera';

const video: HTMLVideoElement = document.querySelector('.video');
const logText = document.getElementById('log');

async function start() {
    try {
        if (hasGetUserMedia()) {
            const cameras = await getCameras();
            console.log('Cameras!', cameras[0].deviceId);
            logToDom('Cameras! ' + cameras[0].deviceId, logText);
            if (cameras.length) {
                const permission = await getCameraPermission(cameras[0].deviceId);
                // console.log('Permission !', permission);
                logToDom('Permission! ' + permission, logText);
            }
        } else {
            console.log('getUserMedia() is not supported by your browser');
            logToDom('getUserMedia() is not supported by your browser', logText);
        }
    } catch (e) {
        console.log(e);
        logToDom('exc' + e, logText);
    }
}

start();
