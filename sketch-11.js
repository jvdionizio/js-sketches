const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const eases = require('eases');
const random = require('canvas-sketch-util/random');
const colormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

const particles = [];

const cursor = { x: 9999, y: 9999 };

const colors = colormap({
  colormap: 'rainbow-soft',
  nshades: 20,
});

let elCanvas;

const sketch = ({ width, height, canvas }) => {
  let x, y, particle;
  let pos = [];

  const numCircle = 15;
  const gapCircle = 8;
  const gapDot = 4;
  let dotRadius = 12;
  let cirRadius = 0;
  const fitRadius = dotRadius;

  elCanvas = canvas;
  canvas.addEventListener('mousedown', onMouseDown);

  for (let i = 0; i < numCircle; i++) {
    const circumference = 2 * Math.PI * cirRadius;
    const numFit = i ? Math.floor(circumference / (fitRadius * 2 + gapDot)) : 1;
    const fitSlice = 2 * Math.PI / numFit;

    for (let j = 0; j < numFit ; j++){
      const theta = fitSlice * j;

      x = Math.cos(theta) * cirRadius + width * 0.5;
      y = Math.sin(theta) * cirRadius + height * 0.5;

      radius = dotRadius;

      particle = new Particle({ x, y, radius });
      particles.push(particle);
    }

    cirRadius += fitRadius * 2 + gapCircle;
    dotRadius = (1 - eases.quadOut(i / numCircle)) * fitRadius;
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    particles.sort((a, b) => a.scale - b.scale);

    particles.forEach(particle => {
      particle.update();
      particle.draw(context);
    });
  };
};

const onMouseDown = (e) => {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);

  onMouseMove(e);
};

const onMouseMove = (e) => {
  const x = (e.offsetX / elCanvas.offsetWidth) * elCanvas.width;
  const y = (e.offsetY / elCanvas.offsetHeight) * elCanvas.height;

  cursor.x = x;
  cursor.y = y;
};

const onMouseUp = (e) => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);

  cursor.x = 9999;
  cursor.y = 9999;
};

canvasSketch(sketch, settings);

class Particle {
  constructor({ x, y, radius = 10}) {
    //position
    this.x = x;
    this.y = y;

    //acceleration
    this.ax = 0;
    this.ay = 0;

    //velocity
    this.vx = 0;
    this.vy = 0;

    //initial position
    this.ix = x;
    this.iy = y;

    this.radius = radius;
    this.scale = 1;
    this.color = colors[0];
    
    this.minDist = random.range(100, 200);
    this.pushFactor = random.range(0.001, 0.02);
    this.pullFactor = random.range(0.002, 0.006);
    this.dampFactor = random.range(0.9, 0.95);
  }

  update() {
    let dx, dy, dd, distDelta;
    let idxColor;

    //pull force
    dx = this.ix - this.x;
    dy = this.iy - this.y;
    dd = Math.sqrt(dx * dx + dy * dy);

    this.ax = dx * this.pullFactor;
    this.ay = dy * this.pullFactor;

    this.scale = math.mapRange(dd, 0, 200, 0.8, 3)

    idxColor = Math.floor(math.mapRange(dd, 0, 200, 0, colors.length - 1, true));
    this.color = colors[idxColor];

    //push force
    dx = this.x - cursor.x;
    dy = this.y - cursor.y;
    dd = Math.sqrt(dx * dx + dy * dy);

    distDelta = this.minDist - dd;

    if (dd < this.minDist) {
      this.ax += dx * distDelta * this.pushFactor;
      this.ay += dy * distDelta * this.pushFactor;
    }

    this.ax += 0.001;

    this.vx += this.ax;
    this.vy += this.ay;

    this.vx *= this.dampFactor;
    this.vy *= this.dampFactor;


    this.x += this.vx;
    this.y += this.vy;
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.fillStyle = this.color;

    context.beginPath();
    context.arc(0, 0, this.radius * this.scale, 0, Math.PI * 2);
    context.fill();


    context.restore();
  }
}