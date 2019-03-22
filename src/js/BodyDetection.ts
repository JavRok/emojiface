/*
 * Class that interprets result from the body parts detection model, and puts an emoji on the (single) face detected
 */

import * as bodyPix from '@tensorflow-models/body-pix';

const emoji = document.getElementById('face-emoji');

export class BodyDetection {
    // Video HTML element in which to output the stream
    private videoElem: HTMLVideoElement;
    private canvasElem: HTMLCanvasElement;
    // Scale an image down to a certain factor. Too large of an image will
    // slow down the GPU
    private readonly outputStride = 16;
    private readonly segmentationThreshold = 0.8;
    private readonly depthMultiplier = 0.25;

    public constructor(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
        this.videoElem = video;
        this.canvasElem = canvas;
    }

    public async getBodyParts() {
        // load the BodyPix model from a checkpoint
        const net = await bodyPix.load(this.depthMultiplier);

        await this.bodySegmentationFrame(net);
    }

    /*
     * Runs a loop that calculates the position of the face, and puts an emoji on top of it
     */
    public async bodySegmentationFrame(net: any) {
        const partSegmentation = await net.estimatePartSegmentation(
            this.videoElem,
            this.outputStride,
            this.segmentationThreshold,
        );

        const width = partSegmentation.width;
        const height = partSegmentation.height;
        const bodyPartsMap = partSegmentation.data;

        const leftFaceId = 0;
        const rightFaceId = 1;

        let partId;
        // Loop over the image pixel map to get area and position of the face
        // loop over the 'rows'
        let top = height,
            left = width,
            bottom = -1,
            right = -1;
        for (let i = 0; i < height; i++) {
            // loop over the 'columns'
            for (let j = 0; j < width; j++) {
                partId = Math.round(bodyPartsMap[i * width + j]);
                if (partId === leftFaceId || partId === rightFaceId) {
                    top = i < top ? i : top;
                    left = j < left ? j : left;
                    right = j > right ? j : right;
                    bottom = i > bottom ? i : bottom;
                }
            }
        }

        // If video is downsized due to max-width: 100%, apply that to the coordinates we just calculated
        const realWidth = this.videoElem.offsetWidth;
        const relation = realWidth / width;

        top = Math.round(top * relation);
        left = Math.round(left * relation);
        right = Math.round(right * relation);
        bottom = Math.round(bottom * relation);

        const square = {
            width: right - left,
            height: bottom - top,
            top,
            left,
        };

        emoji.style.left = square.left + 'px';
        emoji.style.top = square.top + 'px';
        emoji.style.width = square.width + 'px';
        emoji.style.height = square.height + 'px';

        // Uncomment to use coloured mapped body parts on a canvas
        // const colorScale = [
        //     [110, 64, 170], [143, 61, 178], [178, 60, 178], [210, 62, 167], [238, 67, 149], [255, 78, 125], [255, 94, 99], [255, 115, 75],
        //     [255, 140, 56], [239, 167, 47], [217, 194, 49], [194, 219, 64], [175, 240, 91], [135, 245, 87], [96, 247, 96], [64, 243, 115],
        //     [40, 234, 141], [28, 219, 169], [26, 199, 194], [33, 176, 213], [47, 150, 224], [65, 125, 224], [84, 101, 214], [99, 81, 195],
        // ];

        // const coloredPartImageData = bodyPix.toColoredPartImageData(partSegmentation, colorScale);
        //
        // const maskBlurAmount = 0;
        // const opacity = 0.6;
        // const flipHorizontally = true;
        //
        // bodyPix.drawMask(
        //     this.canvasElem,
        //     this.videoElem,
        //     coloredPartImageData,
        //     opacity,
        //     maskBlurAmount,
        //     flipHorizontally,
        // );

        // Run again
        requestAnimationFrame(() => this.bodySegmentationFrame(net));
    }
}
