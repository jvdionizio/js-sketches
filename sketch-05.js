const canvasSketch = require('canvas-sketch');
// const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const Tweakpane = require('tweakpane');


const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

const params = {
  xs:'/',
  sm:'/',
  md:'/',
  lg:'/',
  randomchars:'/',
}

let manager, image;


let text = 'A';
let fontSize = 1200;
let fontFamily = 'serif';

const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');

const sketch = ({ width, height }) => {
  const cell = 10;
  const cols = Math.floor(width / cell);
  const rows = Math.floor(height / cell);
  const numCells = cols * rows;
  
  typeCanvas.width = cols;
  typeCanvas.height = rows;
  
  return ({ context, width, height }) => {
    typeContext.fillStyle = 'white';
    typeContext.fillRect(0, 0, cols, rows);
    
    fontSize = cols * 1.2;

    typeContext.save();
    typeContext.drawImage(image, 0, 0, cols, rows); // draw image
    typeContext.restore();

    
    // const metrics = typeContext.measureText(text);
    // const mx = metrics.actualBoundingBoxLeft * -1;
    // const my = metrics.actualBoundingBoxAscent * -1;
    // const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    // const mh = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    
    // const tx = (cols - mw) * 0.5 -mx;
    // const ty = (rows - mh) * 0.5 -my;
    
    // typeContext.save();
    // typeContext.translate(tx, ty);
    
    // typeContext.beginPath();
    // typeContext.rect(mx, my, mw, mh);
    // typeContext.stroke();
    
    // typeContext.fillText(text, 0, 0)
    // typeContext.restore();
    
    const typeData = typeContext.getImageData(0, 0, cols, rows).data;
    
    
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    
    // context.drawImage(typeCanvas, 0, 0);
    
    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      
      const x = col * cell;
      const y = row * cell;
      
      const r = typeData[i * 4 + 0];
      const g = typeData[i * 4 + 1];
      const b = typeData[i * 4 + 2];
      const a = typeData[i * 4 + 3];
      
      const glyph = getGlyph(r);
      
      context.font = `${cell * 2}px ${fontFamily}`;
      if (Math.random() < 0.1) context.font = `${cell * 6}px ${fontFamily}`;
      
      context.fillStyle = 'white';
      
      context.save();
      context.translate(x, y);
      context.translate(cell * 0.5, cell * 0.5);
      
      // context.fillRect(0, 0, cell, cell);
      context.fillStyle = `rgb(${r}, ${g}, ${b}, ${a})`;
      context.fillText(glyph, 0, 0)
      
      context.restore();
    }

    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      
      const x = col * cell;
      const y = row * cell;
      
      const r = typeData[i * 4 + 0];
      const g = typeData[i * 4 + 1];
      const b = typeData[i * 4 + 2];
      const a = typeData[i * 4 + 3];
      
      const glyph = getGlyph(g);
      
      context.font = `${cell * 2}px ${fontFamily}`;
      if (Math.random() < 0.1) context.font = `${cell * 6}px ${fontFamily}`;
      
      context.fillStyle = 'white';
      
      context.save();
      context.translate(x, y);
      context.translate(cell * 0.5, cell * 0.5);
      
      // context.fillRect(0, 0, cell, cell);
      context.fillStyle = `rgb(${r}, ${g}, ${b}, ${a})`;

      context.fillText(glyph, 0, 0)
      
      context.restore();
    }
    
    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      
      const x = col * cell;
      const y = row * cell;
      
      const r = typeData[i * 4 + 0];
      const g = typeData[i * 4 + 1];
      const b = typeData[i * 4 + 2];
      const a = typeData[i * 4 + 3];
      
      const glyph = getGlyph(b);
      
      context.font = `${cell * 2}px ${fontFamily}`;
      if (Math.random() < 0.1) context.font = `${cell * 6}px ${fontFamily}`;
      
      context.fillStyle = 'white';
      
      context.save();
      context.translate(x, y);
      context.translate(cell * 0.5, cell * 0.5);
      
      // context.fillRect(0, 0, cell, cell);
      context.fillStyle = `rgb(${r}, ${g}, ${b}, ${a})`;

      context.fillText(glyph, 0, 0)
      
      context.restore();
    }

    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      
      const x = col * cell;
      const y = row * cell;
      
      const r = typeData[i * 4 + 0];
      const g = typeData[i * 4 + 1];
      const b = typeData[i * 4 + 2];
      const a = typeData[i * 4 + 3];
      
      const glyph = getGlyph(a);
      
      context.font = `${cell * 2}px ${fontFamily}`;
      if (Math.random() < 0.1) context.font = `${cell * 6}px ${fontFamily}`;
      
      context.fillStyle = 'white';
      
      context.save();
      context.translate(x, y);
      context.translate(cell * 0.5, cell * 0.5);
      
      // context.fillRect(0, 0, cell, cell);
      context.fillStyle = `rgb(${r}, ${g}, ${b}, ${a})`;
      context.fillText(glyph, 0, 0)
      
      context.restore();
    }
  };  
};

const getGlyph = (v) => {
  if (v < 50) return params.xs;
  if (v < 100) return params.sm;
  if (v < 150) return params.md;
  if (v < 200) return params.lg;

  const glyphs = params.randomchars.split('');

  return random.pick(glyphs);
};

  const onKeyUp = (e) => {
    text = e.key.toUpperCase();
    text === 'ENTER' && manager.render();
  }
  
  document.addEventListener('keyup', onKeyUp);
  
  const loadMeSomeImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject();
      img.src = url;
    });
  };
  
  const start = async () => {
    const url = './images/rain.png';
    image = await loadMeSomeImage(url);
    manager = await canvasSketch(sketch, settings);
  };

  const createPane = () => {
    const pane = new Tweakpane.Pane();
    let folder;
    
    folder = pane.addFolder({ title: 'Glyphs - Press ENTER to apply changes' });
    folder.addInput(params, 'xs', { label: 'xs' });
    folder.addInput(params, 'sm', { label: 'sm' });
    folder.addInput(params, 'md', { label: 'md' });
    folder.addInput(params, 'lg', { label: 'lg' });
    folder.addInput(params, 'randomchars', { label: 'randomchars' });
  };
  
  createPane();
  
  start();
