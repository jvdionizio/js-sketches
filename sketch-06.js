const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const Color = require('canvas-sketch-util/color');
const risoColors = require('riso-colors');
const Tweakpane = require('tweakpane');

const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: seed,
};

const params = {
  sides: 3,
  radius: 0.4,
  degrees: -30,
  rotate: 0,
};

const sketch = ({ context, width, height }) => {
  random.setSeed(seed);

  let x, y, w, h, fill, stroke, blend, direction, velocity;

  const num = 25;

  const rects = [];

  const rectColors = random.shuffle(risoColors).slice(0, 3);

  const bgColor = random.pick(risoColors).hex;

  const maskX= width * 0.5;
  const maskY = height * 0.58;


  for (let i = 0; i < num; i++) {
    x = random.range(0, width);
    y = random.range(0, height);
    w = random.range(300, 500);
    h = random.range(40,150);

    fill = random.pick(rectColors).hex;
    stroke = random.pick(rectColors).hex;

    blend = (random.value() > 0.5) ? 'overlay' : 'multiply';

    direction = random.value() > 0.5 ? 1 : -1;

    velocity = random.range(0.6, 1.5);

    rects.push({x, y, w, h, fill, stroke, blend, direction, velocity});
  }
  
  return ({ context, width, height, frame }) => {
    const degrees = params.degrees;
    // params.sides === 3 ? maskY = height * 0.58 : maskY = height * 0.5;
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    context.save();
    context.translate(maskX, maskY);

    drawPolygon({ context, radius: width * params.radius, sides: params.sides, rotate : params.rotate });
    context.clip();

    //update rects positions
    rects.forEach(rect => {
      rect.x += rect.direction * rect.velocity;
      rect.y += -1 * rect.direction * rect.velocity;
    });

    // //wrap rects around not fineshed
    // rects.forEach(rect => {
    //   if (rect.x + rect.w <= 0) {
    //     rect.x = width;
    //   }
    //   if (rect.x >= width) {
    //     rect.x = -rect.w;
    //   }
    //   if (rect.y + rect.h <= 0) {
    //     rect.y = height;
    //   }
    //   if (rect.y >= height) {
    //     rect.y = -rect.h;
    //   }
    // });

    //bounce rects
    rects.forEach(rect => {
      if (rect.x <= 0 >= width) {
        rect.direction *= -1;
      }
      if (rect.y <= 0 || rect.y + rect.h >= height) {
        rect.direction *= -1;
      }
    });

    rects.forEach(({x, y, w, h, fill, stroke, blend}) => {
      let shadowColor;

      context.save();
      context.translate(-maskX, -maskY);
      context.translate(x, y);
      context.strokeStyle = stroke;
      context.fillStyle = fill;
      context.lineWidth = 10;

      context.globalCompositeOperation = blend;

      drawSkewedRect({context, w, h, degrees });

      shadowColor = Color.offsetHSL(fill, 0, 0, -20);
      shadowColor.rgba[3] = 0.5;

      context.shadowColor = Color.style(shadowColor.rgba);
      context.shadowOffsetX = -10;
      context.shadowOffsetY = 20;

      context.fill();

      context.shadowColor = null;
      context.stroke();

      context.globalCompositeOperation = 'source-over';

      context.lineWidth = 2;
      context.strokeStyle = 'white';
      context.stroke();

      context.restore();
    });

    context.restore();

    context.save();
    context.translate(maskX, maskY);
    context.lineWidth = 20;

    drawPolygon({ context, radius: width * params.radius - context.lineWidth, sides: params.sides, rotate : params.rotate });
    
    context.globalCompositeOperation = 'color-burn';
    context.strokeStyle = rectColors[0].hex;
    context.stroke();
    
    context.restore();
  };
};

const drawSkewedRect = ({context, w=600, h=200, degrees= -45}) => {  
  const angle = math.degToRad(degrees);
  const rx = Math.cos(angle) * w;
  const ry = Math.sin(angle) * w;
  
  context.save();
  context.translate(rx * -0.5, (ry + h) * -0.5);
  
  context.beginPath();
  context.moveTo(0,0);
  context.lineTo(rx,ry);
  context.lineTo(rx, ry+h);
  context.lineTo(0,h);
  context.closePath();
  context.stroke();

  context.restore();
};

const drawPolygon = ({ context, radius = 100 ,sides = 3, rotate = 0}) => {
  const slice = (Math.PI * 2) / sides;

  context.rotate(slice * rotate);

  context.beginPath();
  context.moveTo(0, -radius);

  for (let i = 1; i < sides; i++) {
    const theta = i * slice - Math.PI * 0.5;
    context.lineTo(Math.cos(theta) * radius, Math.sin(theta) * radius);
  }

  context.closePath();
};

const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;
  
  folder = pane.addFolder({ title: 'Polygon Mask' });
  folder.addInput(params, 'sides', { min: 3, max: 120, step: 1 });
  folder.addInput(params, 'radius', { min: 0, max: 1, step: 0.01 });
  folder.addInput(params, 'rotate', { min: 0, max: 4, step: 0.01 });
  
  folder = pane.addFolder({ title: 'Rectangles' });
  folder.addInput(params, 'degrees', { min: -90, max: 90, step: 1 });

};

createPane();

canvasSketch(sketch, settings);
