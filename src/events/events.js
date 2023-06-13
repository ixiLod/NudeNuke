const startBorderWindow = document.querySelector('.start-border-window');
const borderWindow = document.querySelector('.colored-border-window');
const messageOutScreen = document.querySelector('.message-out-screen');
const tutorial = document.querySelector('.tutorial');
const borderBlur = document.querySelector('.border-blur');
const filter = document.querySelector('.blur');

let autoBlurRunning = false;

const animationTutorial = () => {
  startBorderWindow.classList.add('tutorial-border');
  tutorial.classList.add('tutorial-active');
};

const toggleBorder = () => {
  borderWindow.classList.toggle('colored-border-window-active');
};

const toggleBlur = () => {
  if (autoBlurRunning) return;
  filter.classList.toggle('active-style-blur');
  borderBlur.classList.toggle('active-style-border-blur');
};

const autoBlur = () => {
  if (autoBlurRunning) return;
  autoBlurRunning = true;
  filter.classList.add('active-style-blur');
  borderBlur.classList.add('active-style-border-blur');
  setTimeout(() => {
    if (autoBlurRunning) {
      filter.classList.remove('active-style-blur');
      borderBlur.classList.remove('active-style-border-blur');
      autoBlurRunning = false;
    }
  }, 9000);
};

const outScreen = () => {
  messageOutScreen.classList.add('out-screen');
  borderWindow.classList.add('warning-border');
};

const inScreen = () => {
  messageOutScreen.classList.remove('out-screen');
  borderWindow.classList.remove('warning-border');
};

const hideElement = (element) => {
  element.style.animation = 'none';
  element.style.opacity = '0';
  element.style.visibility = 'hidden';
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'b') {
    toggleBlur();
    hideElement(tutorial);
  } else if (e.key === ' ') {
    toggleBorder();
    hideElement(tutorial);
  }
});

window.electron.ipcRenderer.on('animation-tutorial', animationTutorial);
window.electron.ipcRenderer.on('toggle-border', toggleBorder);
window.electron.ipcRenderer.on('auto-blur', autoBlur);
window.electron.ipcRenderer.on('out-screen', outScreen);
window.electron.ipcRenderer.on('in-screen', inScreen);
