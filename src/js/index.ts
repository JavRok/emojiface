import 'normalize.css';
import '../css/main.css';

import { logToDom, wait } from './helpers';

import { MediaAccess } from './MediaAccess';
import { BodyDetection } from './BodyDetection';

const video: HTMLVideoElement = document.querySelector('.video');
const canvas: HTMLCanvasElement = document.getElementById('output') as HTMLCanvasElement;
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
        introText.innerHTML = "Now focus on someone's face 💪 👱";

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

        await wait(1000);
        const Bd = new BodyDetection(video, canvas);
        await Bd.getBodyParts();
    } catch (e) {
        console.log('Exception', e);
        logToDom('Error: ' + e, logText);
        video.classList.remove('switching');
    }
}

start();
