import { BrowserWindow, globalShortcut } from 'electron';
import { currentWidth, currentHeight, currentX, currentY } from './main';
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
let modelPromise: Promise<nsfw.NSFWJS>;

async function loadModel(): Promise<nsfw.NSFWJS> {
  const model = await nsfw.load();
  return model;
}

async function checkNSFW(modelPromise: Promise<nsfw.NSFWJS>): Promise<boolean> {
  const model = await modelPromise;

  const screenshotBuffer: Buffer = await screenshot();

  const resizedBuffer = await sharp(screenshotBuffer)
    .extract({
      left: currentX,
      top: currentY,
      width: currentWidth - 25,
      height: currentHeight - 25,
    })
    .resize(224, 224, { fit: 'contain' })
    .toBuffer();

  const imageTensor: any = tf.node.decodeImage(resizedBuffer) as tf.Tensor3D;

  const predictions: Prediction[] = await model.classify(imageTensor);
  imageTensor.dispose();

  const nsfwScore: number | undefined = predictions.find(
    (prediction) => prediction.className === 'Porn'
  )?.probability;
  const threshold: number = 0.75; // Adjustable value

  return (nsfwScore !== undefined && nsfwScore > threshold);
}

export function startDetection(mainWindow: BrowserWindow) {
  modelPromise = loadModel();

  mainWindow.on('focus', () => {
    globalShortcut.register('Space', () => {
      isRunning = !isRunning;
      mainWindow.webContents.send('toggle-border');

      if (isRunning) {
        intervalId = setInterval(async () => {
          const isNSFW = await checkNSFW(modelPromise);

          if (isNSFW) {
            console.log('NSFW content detected!');
            mainWindow.webContents.send('auto-blur');
          } else {
            console.log('SFW content detected.');
          }
        }, 550);
      } else if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    });
  });
}
