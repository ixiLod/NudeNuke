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
    }
    else if (e.key === ' ') {
        toggleBorder();
        hideElement(tutorial);
    }
});
//# sourceMappingURL=keys.js.map