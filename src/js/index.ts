import 'normalize.css';
import '../css/main.css';

import { logToDom, wait } from './helpers';

import { MediaAccess } from './MediaAccess';

const video: HTMLVideoElement = document.querySelector('.video');
const logText = document.getElementById('log');
const introText = document.querySelector('.intro-text');
const cameraSwitchBtn: HTMLElement = document.querySelector('.switch-camera');

async function start() {
    try {
        const mediaAccess = new MediaAccess(video);
        const permission = await mediaAccess.getCameraPermission();
        if (!permission) {
            introText.innerHTML = 'User denied camera use 😒';
            return;
        }
        introText.innerHTML = 'Now focus on some body parts 💪 👱';

        const cameras = await mediaAccess.getCameras();
        if (cameras && cameras.length > 1) {
            cameraSwitchBtn.addEventListener('click', async evt => {
                // disable/spin button while waiting
                video.classList.add('switching');
                await wait(400);
                await mediaAccess.selectNextCamera();
                video.classList.remove('switching');
            });
        } else {
            // Hide button if there's only one camera.
            cameraSwitchBtn.classList.add('hidden');
        }
    } catch (e) {
        console.log(e);
        logToDom('Error: ' + e, logText);
        video.classList.remove('switching');
    }
}

start();
