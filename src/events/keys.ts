const filter = document.querySelector('.blur') as HTMLElement;
const borderBlur = document.querySelector('.border-blur') as HTMLElement;
const borderWindow = document.querySelector('.colored-border-window') as HTMLElement;
const tutorial = document.querySelector('.tutorial') as HTMLElement;

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

const hideElement = (element: HTMLElement) => {
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
