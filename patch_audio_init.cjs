const fs = require('fs');
let code = fs.readFileSync('src/audio.ts', 'utf8');

code = code.replace(
  "export const initAudio = () => {",
  `export const initAudio = () => {
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
};`
);

// Remove the inline check inside playTactileClick to avoid duplicates
code = code.replace(
  `    if (!isAudioInitialized) {
      isAudioInitialized = true;
      playAmbientDrone(ctx);
    }`,
  ``
);

fs.writeFileSync('src/audio.ts', code);
