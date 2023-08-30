const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

const sketch = ({ context, width, height}) => {
  const cx = width * 0.5;
  const cy = height * 0.5;

  const w = width * 0.01;
  const h = height * 0.1;
  let x,y;
  
  const num = 60;
  const radius = width * 0.3;

  const visualObjs = []

  for (let i = 0; i < num; i++) {
    const slice = math.degToRad(360/num);
    const angle = slice * i;

    visualObjs.push({
      slice,
      i,
      angle,
      rotation: random.range(0, 1) > 0.5 ? -1 : 1,
      width: random.range(0.01, 0.5),
      height: random.range(0.01, 0.5),
      rectHeight: random.range(0, -h * 0.5),
      scale: {
        x: random.range(1,3),
        y: random.range(0.2, 2),
      },
      lineWidth: random.range(5, 20),
      arcRadius: radius * random.range(0.3, 1.3),
      startAngle: slice * random.range(1, -8),
      endAngle: slice * random.range(1, 5),
    });
  }

  return ({ context, width, height, frame }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
  
    context.fillStyle = 'black';

    visualObjs.forEach( visualObj => {
      const {slice, i, angle, rotation, lineWidth,startAngle, endAngle, scale, rectHeight, arcRadius } = visualObj;

      const rectAngle = slice * i + frame * 0.01 * rotation;

      const color = random.range(0, 1) < 0.2 ? "red" : "black";

      const rx = cx + Math.sin(rectAngle) * radius;
      const ry = cy + Math.cos(rectAngle) * radius;
      //animate rects and arcs
      visualObj.startAngle += 0.01 * rotation;
      visualObj.endAngle += 0.01 * rotation;
      
      context.save();
      context.translate(rx , ry);
      context.rotate(-rectAngle);
      context.scale(scale.x, scale.y);
  
      context.beginPath();
      context.rect(-w * 0.5, rectHeight,w,h);
      context.fillStyle = color;
      context.fill();
      context.restore();
      

      context.save();
      context.translate(cx, cy);
      context.rotate(-angle);

      context.lineWidth = lineWidth;

      context.beginPath();
      context.arc(
          0,
          0,
          arcRadius,
          startAngle,
          endAngle
        );
      context.strokeStyle = color;
      context.stroke();

      context.restore();
      
    });
  };
};

canvasSketch(sketch, settings);
