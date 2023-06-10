const filter = document.querySelector('.blur');
const borderBlur = document.querySelector('.border-blur');
const borderWindow = document.querySelector('.colored-border-window');
const startBorderWindow = document.querySelector('.start-border-window');
const tutorial = document.querySelector('.tutorial');

const animationTutorial = () => {
  startBorderWindow.classList.add('tutorial-border');
  tutorial.classList.add('tutorial-active');
};

const toggleBlur = () => {
  filter.classList.toggle('active-style-blur');
  borderBlur.classList.toggle('active-style-border-blur');
};

const autoBlur = () => {
  filter.classList.add('active-style-blur');
  borderBlur.classList.add('active-style-border-blur');
  setTimeout(() => {
    filter.classList.remove('active-style-blur');
    borderBlur.classList.remove('active-style-border-blur');
  }, 10000);
};

const toggleBorder = () => {
  borderWindow.classList.toggle('colored-border-window-active');
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
window.electron.ipcRenderer.on('auto-blur', autoBlur);
window.electron.ipcRenderer.on('toggle-border', toggleBorder);