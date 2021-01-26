const maxW = 500;
const maxH = 600;

let actualW, actualH;

const w = window.innerWidth;
const h = window.innerHeight;

if (maxW > w) {
  actualW = window.width = w;
  actualH = window.height = h;
} else {
  actualW = window.width = maxW;
  actualH = window.height = maxH;
}

const canvas = document.createElement('canvas');

canvas.setAttribute('width', `${actualW}px`);
canvas.setAttribute('height', `${actualH}px`);

canvas.classList.add('output_canvas');

document.querySelector('.content').append(canvas);
