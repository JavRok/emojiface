function greeter(person: string) {
    return 'Hello, ' + person;
}

let user = 'Jane User';

document.body.innerHTML = greeter(user);

const constraints = {
    audio: false,
    video: {
        width: { min: 1024, ideal: 1280, max: 1920 },
        height: { min: 776, ideal: 720, max: 1080 },
    },
};

navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function(mediaStream) {
        /* usar el flujo de datos */
    })
    .catch(function(err) {
        /* manejar el error */
    });
