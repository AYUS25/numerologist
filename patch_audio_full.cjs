const fs = require('fs');

const audioCode = `
let audioCtx: AudioContext | null = null;
let isAudioInitialized = false;
let droneGain: GainNode | null = null;

export const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  if (!isAudioInitialized) {
    isAudioInitialized = true;
    playAmbientDrone(audioCtx);
  }
  return audioCtx;
};

export const playTactileClick = () => {
  if (navigator.vibrate) navigator.vibrate(10);
  try {
    const ctx = initAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {}
};

export const playHoverTick = () => {
  if (navigator.vibrate) navigator.vibrate(2); // Very soft vibration for hover
  try {
    const ctx = initAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(4000, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.015);
    
    gain.gain.setValueAtTime(0.005, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.015);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.015);
  } catch (e) {}
};

const playAmbientDrone = (ctx: AudioContext) => {
  try {
    droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(0, ctx.currentTime);
    droneGain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 5); 
    
    const freqs = [55, 82.41, 110]; // Low celestial chord (A1, E2, A2)
    freqs.forEach(f => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = f;
      
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.05 + (Math.random() * 0.05);
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 3;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      
      osc.connect(droneGain!);
      osc.start();
      lfo.start();
    });
    
    droneGain.connect(ctx.destination);
  } catch (e) {}
};
`;
fs.writeFileSync('src/audio.ts', audioCode);
