const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const colormap = require('colormap');
const Tweakpane = require('tweakpane');

const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  name: seed,
};

const params = {
  cols: 72,
  rows: 8,
  gw: 0.8,
  gh: 0.8,
  frequency: 0.002,
  amplitude: 90,
  mx: 0.6,
  my: 5.5,
  theme: 'salinity',
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    random.setSeed(seed);
    const cols = params.cols;
    const rows = params.rows;
    const numCells = cols * rows;
  
    //grid
    const gw = width * params.gw;
    const gh = height * params.gh;
  
    //cell
    const cw = gw / cols;
    const ch = gh / rows;
  
    //margin
    const mx = (width - gw) * 0.5;
    const my = (height - gh) * 0.5;
  
    const points = [];
  
    let x, y, n, lineWidth, color;
    let frequency = params.frequency;
    let amplitude = params.amplitude;
  
    const colors = colormap({
      colormap: params.theme,
      nshades: amplitude,
    })
    
    for (let i = 0; i < numCells; i++) {
      x = (i % cols) * cw;
      y = Math.floor(i / cols) * ch;
  
      n = random.noise2D(x, y, frequency, amplitude);
      // x += n;
      // y += n;
  
      lineWidth = math.mapRange(n, -amplitude, amplitude, 0, 5);
  
      color = colors[Math.floor(math.mapRange(n, -amplitude, amplitude, 0, amplitude))];
      
      points.push(new Point({ x,y, lineWidth, color }));
    }
  
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.save();
    context.translate(mx, my);
    context.translate(cw * 0.5, ch * 0.5);
    context.strokeStyle = 'red';
    context.lineWidth = 4;

    //update positions
    points.forEach(point => {
      n = random.noise2D(point.ix + frame, point.iy, frequency, amplitude);
      point.x = point.ix + n;
      point.y = point.iy + n;
    });

    let lastx, lasty;

    //draw lines
    for (let r = 0; r < rows; r++) {
      
      for (let c = 0; c < cols - 1; c++) {
        const curr = points[r * cols + c + 0];
        const next = points[r * cols + c + 1];
        
        const mx = curr.x + (next.x - curr.x) * params.mx;
        const my = curr.y + (next.y - curr.y) * params.my;

        if (!c) {
          lastx = curr.x;
          lasty = curr.y;
        }
        
        context.beginPath();
        context.lineWidth = curr.lineWidth;
        context.strokeStyle = curr.color;

        context.moveTo(lastx, lasty);
        context.quadraticCurveTo(curr.x, curr.y, mx, my);
        
        context.stroke();

        lastx = mx - c / cols * 250 ;
        lasty = my - r / rows * 250;
      }
    
    }

    //draw points
    points.forEach(point => {
      // point.draw(context);
    });



    context.restore();
  };
};

const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({title: 'Curves'});
  folder.addInput(params, 'frequency', {min: 0, max: 0.1, step: 0.0001});
  folder.addInput(params, 'amplitude', {min: 0, max: 100, step: 1});
  folder.addInput(params, 'mx', {min: -10, max: 10, step: 0.1});
  folder.addInput(params, 'my', {min: -10, max: 10, step: 0.1});
  folder.addInput(params, 'gw', {min: -10, max: 10, step: 0.01});
  folder.addInput(params, 'gh', {min: -10, max: 10, step: 0.01});
  folder.addInput(params, 'cols', {min: 2, max: 100, step: 1});
  folder.addInput(params, 'rows', {min: 2, max: 100, step: 1});
  folder.addInput(params, 'theme', {options: {
    'jet': 'jet',
    'hsv': 'hsv',
    'hot': 'hot',
    'cool': 'cool',
    'spring': 'spring',
    'summer': 'summer',
    'autumn': 'autumn',
    'winter': 'winter',
    'bone': 'bone',
    'copper': 'copper',
    'greys': 'greys',
    'yignbu': 'yignbu',
    'greens': 'greens',
    'yiorrd': 'yiorrd',
    'bluered': 'bluered',
    'rdbu': 'rdbu',
    'picnic': 'picnic',
    'rainbow': 'rainbow',
    'portland': 'portland',
    'blackbody': 'blackbody',
    'earth': 'earth',
    'electric': 'electric',
    'viridis': 'viridis',
    'inferno': 'inferno',
    'magma': 'magma',
    'plasma': 'plasma',
    'warm': 'warm',
    'bathymetry': 'bathymetry',
    'cdom': 'cdom',
    'chlorophyll': 'chlorophyll',
    'density': 'density',
    'freesurface-blue': 'freesurface-blue',
    'freesurface-red': 'freesurface-red',
    'oxygen': 'oxygen',
    'par': 'par',
    'phase': 'phase',
    'salinity': 'salinity',
    'temperature': 'temperature',
    'turbidity': 'turbidity',
    'velocity-blue': 'velocity-blue',
    'velocity-green': 'velocity-green',
    'cubehelix': 'cubehelix',
  } });
};

createPane();

canvasSketch(sketch, settings);

class Point {
  constructor({x, y, lineWidth, color}) {
    this.x = x;
    this.y = y;
    this.lineWidth = lineWidth;
    this.color = color;

    this.ix = x;
    this.iy = y;
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.fillStyle = 'red';

    context.beginPath();
    context.arc(0, 0, 10, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }
}