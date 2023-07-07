const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const eases = require('eases');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

let audio;
let audioContext, audioData, sourceNode, analyserNode;
let manager;
let minDb, maxDb;

let imgA;

const sketch = ({ context, width, height }) => {
  let circles = [
    {
      w : width * 0.002,
      h : height * 0.088,      
      num : 60,
      radius : 52,
      bin: 4,
    },
    {
      w : width * 0.003,
      h : height * 0.17,      
      num : 70,
      radius : 102,
      bin: 100,
    },
    {
      w : width * 0.002,
      h : height * 0.32,      
      num : 60,
      radius : 200,
      angle: 140,
      rotation: 89,
      bin: 150,
    },
    {
      w : width * 0.002,
      h : height * 0.54,      
      num : 60,
      radius : 296,
      angle: 71,
      rotation: 99,
      bin: 230,
    },
  ];

  const cx = width * 0.359;
  const cy = height * 0.626;
  
  return ({ context, width, height }) => {
    context.fillStyle = '#e6e6da';
    context.fillRect(0, 0, width, height);

    context.drawImage(imgA, 70, 900, imgA.width * 0.7, imgA.height * 0.7);
    
    context.fillStyle = '#4c0116';

    //draw canvas border
    context.save();
    context.translate(width * 0.5, height * 0.5);
    context.lineWidth = 50;
    context.strokeStyle = '#4c0116';


    context.beginPath();
    context.rect(-width * 0.5, -height * 0.5, width, height);
    context.stroke();

    context.restore();

    //text
    context.save();
    context.translate(0, 0);
    context.fillText('behance.net/joovidionizi', 75, 50);

    context.restore();

    //text
    context.save();
    context.translate(width, 0);
    context.fillText('Original art by -', -175, 50);
    context.fillText('Rob Shuttleworth', -174, 70);

    context.restore();

    if(!audioContext) return;
    
    analyserNode.getFloatFrequencyData(audioData);
  

    circles.forEach(circle => {
      let x,y;

      let cw = circle.w;
      const ch = circle.h;
      
      const cNum = circle.num;
      const cRadius = circle.radius;

      const cAngle = circle.angle || 360;

      let cRotation = circle.rotation ? math.degToRad(circle.rotation) :  0;

      const cBin = circle.bin;

      //use Bin to change cRotation softly
      if (cBin) {;
        const db = audioData[cBin];
        const dbNorm = math.mapRange(db, minDb, maxDb, 0, 1);

        cRotation = math.lerp(cRotation, dbNorm * Math.PI * 1.4, 1);
      }

      for (let i = 0; i < cNum; i++) {
        const slice = math.degToRad(cAngle/cNum);
        const angle = slice * i + cRotation;

        x = cx + Math.sin(angle) * cRadius;
        y = cy + Math.cos(angle) * cRadius;

        if (cAngle !== 360){
          cw += eases.quadIn(i) * 0.00003;
        }

        context.save();
        context.translate(x, y);
        context.rotate(-angle);
    
        context.beginPath();
        context.rect(-cw * 0.5, -ch * 0.5,cw,ch);
        context.fill();
        context.restore();

        //draw circle above each rect
        context.save();
        
        context.translate(cx, cy)
        context.rotate(-angle);

        context.beginPath();
        context.arc(0, circle.radius + ch * 0.5, cw * 0.8, 0, Math.PI * 2);
        context.fill();

        context.restore();
      }
    });
  };
};

const addListeners = () => {
  window.addEventListener('mouseup', () => {
    if (!audioContext) createAudio();

    if (audio.paused) {
      audio.play();
      manager.play();
    } else {
      audio.pause();
      manager.pause();
    }
  })
};

const createAudio = () => {
  audio = document.createElement('audio');
  audio.src = './public/audio/bruno-major-music.mp3';

  audioContext = new AudioContext();
  
  sourceNode = audioContext.createMediaElementSource(audio);
  sourceNode.connect(audioContext.destination);

  analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 512;
  analyserNode.smoothingTimeConstant = 0.9;
  sourceNode.connect(analyserNode);

  minDb = analyserNode.minDecibels;
  maxDb = analyserNode.maxDecibels;

  audioData = new Float32Array(analyserNode.frequencyBinCount);

  // console.log(audioData.length);
};

const getAverage = data => {
  let sum = 0;

  for (let i = 0; i < data.length; i++) {
    sum += data[i];
  }

  return sum / data.length;
}

const loadImage = async (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject();
    img.src = src;
  });
};

const start = async () => {
  addListeners();
  imgA = await loadImage('./public/images/text-image-2.png');
  manager = await canvasSketch(sketch, settings);
  manager.pause();
};

start();
