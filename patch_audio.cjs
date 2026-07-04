const fs = require('fs');
let code = fs.readFileSync('src/audio.ts', 'utf8');

// Add playMechanicalDial
const mechanicalDialStr = `
export const playMechanicalDial = () => {
  if (navigator.vibrate) navigator.vibrate([15, 10, 15]);
  try {
    const ctx = initAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Create a thicker, lower "chunk" sound for mechanical dial
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {}
};
`;

code = code.replace(/export const playHoverTick/, mechanicalDialStr + "\nexport const playHoverTick");
fs.writeFileSync('src/audio.ts', code);
console.log("Added playMechanicalDial to audio.ts");
