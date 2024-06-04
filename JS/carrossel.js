const container = document.querySelector('.container');
const containercarrossel = container.querySelector('.container-carrossel');
const carrossel = container.querySelector('.carrossel');
const carrosselItems = carrossel.querySelectorAll('.carrossel-item');

let isMouseDown = false;
let currentMousePos = 0;
let lastMousePos = 0;
let lastMoveTo = 0;
let moveTo = 0;

const createcarrossel = () => {
  const carrosselProps = onResize();
  const length = carrosselItems.length;
  const degress = 360 / length;
  const gap = 20;
  const tz = distanceZ(carrosselProps.w, length, gap);

  const fov = calculateFov(carrosselProps);
  const height = calculateHeight(tz);

  container.style.width = tz * 2 + gap * length + 'px';
  container.style.height = height + 'px';

  carrosselItems.forEach((item, i) => {
    const degressByItem = degress * i + 'deg';
    item.style.setProperty('--rotatey', degressByItem);
    item.style.setProperty('--tz', tz + 'px');
  });
};

const lerp = (a, b, n) => {
  return n * (a - b) + b;
};

// https://3dtransforms.desandro.com/carousel
const distanceZ = (widthElement, length, gap) => {
  return widthElement / 2 / Math.tan(Math.PI / length) + gap;
};

const calculateHeight = (z) => {
  const t = Math.atan((90 * Math.PI) / 180 / 2);
  const height = t * 2 * z;

  return height;
};

const calculateFov = (carrosselProps) => {
  const perspective = window.getComputedStyle(containercarrossel).perspective.split('px')[0];

  const length = Math.sqrt(carrosselProps.w * carrosselProps.w) + Math.sqrt(carrosselProps.h * carrosselProps.h);
  const fov = 2 * Math.atan(length / (2 * perspective)) * (180 / Math.PI);
  return fov;
};

const getPosX = (x) => {
  currentMousePos = x;

  moveTo = currentMousePos < lastMousePos ? moveTo - 3 : moveTo + 3; // Ditingkatkan dari 2 menjadi 3

  lastMousePos = currentMousePos;
};

const update = () => {
  lastMoveTo = lerp(moveTo, lastMoveTo, 0.2); // Dikurangi dari 0.05 menjadi 0.2
  carrossel.style.setProperty('--rotatey', lastMoveTo + 'deg');

  requestAnimationFrame(update);
};

const onResize = () => {
  const boundingcarrossel = containercarrossel.getBoundingClientRect();

  const carrosselProps = {
    w: boundingcarrossel.width,
    h: boundingcarrossel.height,
  };

  return carrosselProps;
};

const initEvents = () => {
  carrossel.addEventListener('mousedown', () => {
    isMouseDown = true;
    carrossel.style.cursor = 'grabbing';
  });
  carrossel.addEventListener('mouseup', () => {
    isMouseDown = false;
    carrossel.style.cursor = 'grab';
  });
  container.addEventListener('mouseleave', () => (isMouseDown = false));

  carrossel.addEventListener('mousemove', (e) => isMouseDown && getPosX(e.clientX));

  carrossel.addEventListener('touchstart', () => {
    isMouseDown = true;
    carrossel.style.cursor = 'grabbing';
  });
  carrossel.addEventListener('touchend', () => {
    isMouseDown = false;
    carrossel.style.cursor = 'grab';
  });
  container.addEventListener('touchmove', (e) => isMouseDown && getPosX(e.touches[0].clientX));

  window.addEventListener('resize', createcarrossel);

  update();
  createcarrossel();
};

initEvents();
