const fs = require('fs');

function applyHovers(filePath) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  
  if (code.includes('import { playTactileClick } from') && !code.includes('playHoverTick')) {
    code = code.replace('import { playTactileClick } from', 'import { playTactileClick, playHoverTick } from');
  } else if (!code.includes('playTactileClick')) {
     code = code.replace("import React", "import { playTactileClick, playHoverTick } from '../audio';\nimport React");
  }

  // Add onMouseEnter to standard buttons
  // Using a regex to find <button and add the handler if not there
  code = code.replace(/<button([^>]*)>/g, (match, p1) => {
    if (match.includes('onMouseEnter')) return match;
    return `<button${p1} onMouseEnter={() => playHoverTick()} onTouchMove={() => playHoverTick()}>`;
  });
  
  fs.writeFileSync(filePath, code);
}

['src/components/IntakeForm.tsx', 'src/components/ChatBot.tsx', 'src/App.tsx', 'src/components/DailyAffirmation.tsx'].forEach(applyHovers);
console.log("Applied hover ticks to buttons globally");
