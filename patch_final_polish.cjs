const fs = require('fs');

// --- 1. Audio Utility ---
const audioCode = `
let audioCtx: AudioContext | null = null;
let isAudioInitialized = false;

export const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const playTactileClick = () => {
  if (navigator.vibrate) navigator.vibrate(10);
  try {
    const ctx = initAudio();
    if (!isAudioInitialized) {
      isAudioInitialized = true;
      playAmbientDrone(ctx);
    }
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

let droneGain: GainNode | null = null;
const playAmbientDrone = (ctx: AudioContext) => {
  try {
    droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(0, ctx.currentTime);
    droneGain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 5); 
    
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

// --- 2. Index CSS Update ---
let css = fs.readFileSync('src/index.css', 'utf8');
css = css.replace(/--color-dark-bg: [^;]+;/, '--color-dark-bg: #000000;');
css = css.replace(/--color-dark-panel: [^;]+;/, '--color-dark-panel: rgba(10, 15, 30, 0.4);');
css = css.replace(/background-image:[\s\S]*?scroll-behavior:/, `background-image: 
    radial-gradient(circle at 15% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.04) 0%, transparent 40%),
    radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.05) 0%, transparent 50%);
  background-attachment: fixed;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  scroll-behavior:`);
css = css.replace(/rgba\(139,92,246,0\.05\)/g, 'rgba(59,130,246,0.1)'); // glass glow
css = css.replace(/rgba\(139,92,246,0\.2\)/g, 'rgba(59,130,246,0.3)'); // button glow
fs.writeFileSync('src/index.css', css);

// --- 3. Replace Colors in Components ---
function replaceColors(filePath) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  
  // Revert back to primary blue colors
  code = code.replace(/violet-500/g, 'blue-500');
  code = code.replace(/violet-900/g, 'blue-900');
  code = code.replace(/violet-300/g, 'blue-300');
  
  fs.writeFileSync(filePath, code);
}
['src/App.tsx', 'src/components/ReportView.tsx', 'src/components/IntakeForm.tsx', 'src/components/ChatBot.tsx', 'src/components/DailyAffirmation.tsx'].forEach(replaceColors);

// --- 4. ReportView Zodiac Animation & Haptics ---
let reportCode = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

// Inject audio import safely
if (!reportCode.includes("playTactileClick")) {
  reportCode = reportCode.replace(
    "import { \n  NumerologyReport,",
    "import { playTactileClick } from '../audio';\nimport { \n  NumerologyReport,"
  );
}

// Add playTactileClick to tabs
reportCode = reportCode.replace(/if \(navigator\.vibrate\) navigator\.vibrate\(\d+\);/g, 'playTactileClick();');

const animatedZodiac = `
const ZodiacConstellation = ({ sign }: { sign: string }) => {
  const constellations: Record<string, any> = {
    Aries: "M10,90 L30,40 L60,30 L90,80",
    Taurus: "M20,20 L40,50 L70,50 L80,30 M40,50 L50,80",
    Gemini: "M30,20 L30,80 M70,20 L70,80 M10,10 L90,10 M10,90 L90,90",
    Cancer: "M30,30 A20,20 0 1,0 50,50 M70,70 A20,20 0 1,0 50,50",
    Leo: "M20,80 L30,30 L60,20 L80,50 L50,70",
    Virgo: "M20,20 L40,80 L60,20 L80,80 M60,50 L90,50",
    Libra: "M10,80 L90,80 M20,60 L40,20 L60,20 L80,60",
    Scorpio: "M20,20 L40,80 L60,20 L80,80 M80,80 L95,60",
    Sagittarius: "M20,80 L80,20 M60,20 L80,20 L80,40 M40,60 L60,80",
    Capricorn: "M20,20 L50,80 L80,20 M50,50 A15,15 0 1,0 65,65",
    Aquarius: "M10,30 L30,10 L50,30 L70,10 L90,30 M10,70 L30,50 L50,70 L70,50 L90,70",
    Pisces: "M20,10 L20,90 M80,10 L80,90 M20,50 L80,50"
  };
  const currentPath = constellations[sign] || constellations['Aries'];
  return (
    <div className="relative w-full h-24 mt-2 mb-4 bg-transparent border border-white/[0.04] rounded-xl flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent"></div>
      <svg viewBox="0 0 100 100" className="w-full h-full text-indigo-400/80 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]">
        <motion.path 
          d={currentPath} 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />
        <motion.circle cx="30" cy="40" r="2" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.5, 1] }} transition={{ delay: 1, duration: 2, repeat: Infinity }} />
        <motion.circle cx="60" cy="30" r="1.5" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} />
        <motion.circle cx="80" cy="50" r="2.5" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.2, 1] }} transition={{ delay: 2, duration: 3, repeat: Infinity }} />
        <motion.circle cx="40" cy="80" r="1.5" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} />
      </svg>
    </div>
  );
};
`;

let zStart = reportCode.indexOf("const ZodiacConstellation");
let zEnd = reportCode.indexOf("};\n", zStart);
if (zStart !== -1 && zEnd !== -1) {
  reportCode = reportCode.substring(0, zStart) + animatedZodiac + reportCode.substring(zEnd + 3);
}

// Preserve purple/indigo accents for aesthetic areas as requested
reportCode = reportCode.replace(/<linearGradient id="energyGradient"[\s\S]*?<\/linearGradient>/, 
  '<linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="0%">\n    <stop offset="0%" stopColor="#818cf8" />\n    <stop offset="100%" stopColor="#3b82f6" />\n  </linearGradient>');

// Make Astro Aspect map use purple accents to satisfy user request
reportCode = reportCode.replace(/fill=\{isActive \? "#3b82f6" : "rgba\(255,255,255,0\.1\)"\}/g, 'fill={isActive ? "#818cf8" : "rgba(255,255,255,0.1)"}');
reportCode = reportCode.replace(/stroke="#3b82f6"/g, 'stroke="#818cf8"');
reportCode = reportCode.replace(/rgba\(59, 130, 246, 0\.15\)/g, 'rgba(129, 140, 248, 0.15)');

// Also make the lunar phase insight text softly purple/indigo
reportCode = reportCode.replace(/className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1"/, 'className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1"');

// More tactile hooks
reportCode = reportCode.replace(/onClick=\{\(\) => setActiveTab/g, 'onClick={() => { playTactileClick(); setActiveTab');

fs.writeFileSync('src/components/ReportView.tsx', reportCode);

// --- 5. IntakeForm Audio Injection ---
let intakeCode = fs.readFileSync('src/components/IntakeForm.tsx', 'utf8');
if (!intakeCode.includes("playTactileClick")) {
  intakeCode = intakeCode.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { playTactileClick } from '../audio';");
  intakeCode = intakeCode.replace(/onSubmit=\{handleSubmit\}/, 'onSubmit={(e) => { playTactileClick(); handleSubmit(e); }}');
  fs.writeFileSync('src/components/IntakeForm.tsx', intakeCode);
}

// --- 6. ChatBot Audio Injection ---
let chatCode = fs.readFileSync('src/components/ChatBot.tsx', 'utf8');
if (!chatCode.includes("playTactileClick")) {
  chatCode = chatCode.replace("import ReactMarkdown from 'react-markdown';", "import ReactMarkdown from 'react-markdown';\nimport { playTactileClick } from '../audio';");
  chatCode = chatCode.replace(/if \(navigator\.vibrate\) navigator\.vibrate\(\d+\);/g, 'playTactileClick();');
  fs.writeFileSync('src/components/ChatBot.tsx', chatCode);
}

// --- 7. App.tsx Audio Injection ---
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
if (!appCode.includes("playTactileClick")) {
  appCode = appCode.replace("import { NumerologyInput, NumerologyReport } from './types';", "import { NumerologyInput, NumerologyReport } from './types';\nimport { playTactileClick } from './audio';");
  appCode = appCode.replace(/<button([^>]*)onClick=\{\(\) => setReport\(null\)\}/g, '<button$1onClick={() => { playTactileClick(); setReport(null); }}');
  fs.writeFileSync('src/App.tsx', appCode);
}

console.log("All themes and audio applied successfully!");
