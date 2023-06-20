"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startDetection = void 0;
const electron_1 = require("electron");
const main_1 = require("./main");
const tf = __importStar(require("@tensorflow/tfjs-node"));
const nsfw = __importStar(require("nsfwjs"));
const screenshot_desktop_1 = __importDefault(require("screenshot-desktop"));
const sharp_1 = __importDefault(require("sharp"));
let isRunning = false;
let intervalId = null;
let model;
const DETECTION_INTERVAL_MS = 500;
const NSFW_THRESHOLD = 0.65;
async function loadModel() {
    if (model)
        return model;
    model = await nsfw.load();
    return model;
}
async function checkNSFW() {
    const screenshotBuffer = await (0, screenshot_desktop_1.default)();
    const resizedBuffer = await (0, sharp_1.default)(screenshotBuffer)
        .extract({
        left: main_1.viewX,
        top: main_1.viewY,
        width: main_1.viewWidth,
        height: main_1.viewHeight,
    })
        .resize(224, 224, { fit: 'contain' })
        .toBuffer();
    const imageTensor = tf.tidy(() => {
        return tf.node.decodeImage(resizedBuffer, 3);
    });
    const predictions = await model.classify(imageTensor);
    imageTensor.dispose();
    const nsfwScore = predictions.find((prediction) => prediction.className === 'Porn')?.probability;
    return nsfwScore !== undefined && nsfwScore >= NSFW_THRESHOLD;
}
function startDetection(mainWindow) {
    loadModel().catch((error) => {
        console.error(`Error loading the model: ${error}`);
    });
    mainWindow.on('focus', () => {
        electron_1.globalShortcut.register('Space', async () => {
            isRunning = !isRunning;
            mainWindow.webContents.send('toggle-border');
            if (isRunning) {
                intervalId = setInterval(async () => {
                    try {
                        const isNSFW = await checkNSFW();
                        if (isNSFW) {
                            console.log('NSFW content detected!');
                            mainWindow.webContents.send('auto-blur');
                        }
                        else {
                            console.log('SFW content detected.');
                        }
                    }
                    catch (err) {
                        console.error(`Error while checking for NSFW content: ${err}`);
                        clearInterval(intervalId);
                        intervalId = null;
                    }
                }, DETECTION_INTERVAL_MS);
            }
            else if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        });
    });
}
exports.startDetection = startDetection;
//# sourceMappingURL=nsfwDetector.js.map