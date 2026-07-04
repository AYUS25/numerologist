const fs = require('fs');

function safeInjectHover(filePath) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  
  // First ensure playHoverTick is imported
  if (code.includes('import { playTactileClick } from') && !code.includes('playHoverTick')) {
    code = code.replace('import { playTactileClick } from', 'import { playTactileClick, playHoverTick } from');
  } else if (!code.includes('playTactileClick')) {
     code = code.replace("import React", "import { playTactileClick, playHoverTick } from './audio';\nimport React");
  }

  // A safer injection: look for `<button ` and add it if not present, avoiding multiline issues
  // Split by line and inject
  let lines = code.split('\n');
  for (let i=0; i<lines.length; i++) {
    if (lines[i].includes('<button ') && !lines[i].includes('playHoverTick')) {
      lines[i] = lines[i].replace('<button ', '<button onMouseEnter={() => playHoverTick()} onTouchMove={() => playHoverTick()} ');
    }
  }
  
  fs.writeFileSync(filePath, lines.join('\n'));
}

['src/components/IntakeForm.tsx', 'src/components/ChatBot.tsx', 'src/App.tsx', 'src/components/DailyAffirmation.tsx'].forEach(safeInjectHover);
console.log("Safely applied hover ticks");
