import { BrowserWindow, globalShortcut } from 'electron';
import { viewX, viewY, viewWidth, viewHeight } from './main';
import * as tf from '@tensorflow/tfjs-node';
import * as nsfw from 'nsfwjs';
import screenshot from 'screenshot-desktop';
import sharp from 'sharp';

type Prediction = {
  className: 'Neutral' | 'Drawing' | 'Hentai' | 'Porn' | 'Sexy';
  probability: number;
};

let isRunning = false;
let intervalId = null;
let model: nsfw.NSFWJS;

const DETECTION_INTERVAL_MS: number = 500;
const NSFW_THRESHOLD: number = 0.65;

async function loadModel(): Promise<nsfw.NSFWJS> {
  if (model) return model;
  model = await nsfw.load();
  return model;
}

async function checkNSFW(): Promise<boolean> {
  const screenshotBuffer: Buffer = await screenshot();

  const resizedBuffer = await sharp(screenshotBuffer)
    .extract({
      left: viewX,
      top: viewY,
      width: viewWidth,
      height: viewHeight,
    })
    .resize(224, 224, { fit: 'contain' })
    .toBuffer();

  const imageTensor: tf.Tensor3D = tf.tidy(() => {
    return tf.node.decodeImage(resizedBuffer, 3) as tf.Tensor3D;
  });

  const predictions: Prediction[] = await model.classify(imageTensor);

  const nsfwScore = predictions.find((prediction) => prediction.className === 'Porn')?.probability;

  imageTensor.dispose();

  return nsfwScore !== undefined && nsfwScore >= NSFW_THRESHOLD;
}

export function startDetection(mainWindow: BrowserWindow) {
  loadModel().catch((error) => {
    console.error(`Error loading the model: ${error}`);
  });

  mainWindow.on('focus', () => {
    globalShortcut.register('Space', async () => {
      isRunning = !isRunning;
      mainWindow.webContents.send('toggle-border');

      if (isRunning) {
        intervalId = setInterval(async () => {
          try {
            const isNSFW = await checkNSFW();

            if (isNSFW) {
              console.log('NSFW content detected!');
              mainWindow.webContents.send('auto-blur');
            } else {
              console.log('SFW content detected.');
            }
          } catch (err) {
            console.error(`Error while checking for NSFW content: ${err}`);
            clearInterval(intervalId);
            intervalId = null;
          }
        }, DETECTION_INTERVAL_MS);
      } else if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    });
  });
}
