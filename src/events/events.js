const filter = document.querySelector('.blur');
const borderBlur = document.querySelector('.border-blur');
const borderWindow = document.querySelector('.colored-border-window');
const tutorial = document.querySelector('.tutorial');

borderWindow.classList.add('start-animation');

borderWindow.addEventListener('animationend', () => {
  borderWindow.classList.remove('start-animation');
});

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
  } , 10000);
}
window.electron.ipcRenderer.on('auto-blur', autoBlur);

const toggleBorder = () => {
  borderWindow.classList.toggle('colored-border-window-active');
};
window.electron.ipcRenderer.on('toggle-border', toggleBorder);

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
