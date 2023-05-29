const filter = document.querySelector('.blur');
const borderBlur = document.querySelector('.border-blur');
const borderWindow = document.querySelector('.colored-border-window');

borderWindow.classList.add('start-animation');

borderWindow.addEventListener('animationend', () => {
  borderWindow.classList.remove('start-animation');
});

const toggleBlur = () => {
  filter.classList.toggle('active-style-blur');
  borderBlur.classList.toggle('active-style-border-blur');
};

const toggleBorder = () => {
  borderWindow.classList.toggle('colored-border-window-active');
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'b') {
    toggleBlur();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    toggleBorder();
  }
});
