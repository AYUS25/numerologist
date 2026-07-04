const fs = require('fs');

function patchFile(filepath) {
  let code = fs.readFileSync(filepath, 'utf8');
  
  // Find all `<button` without onMouseEnter and add it
  code = code.replace(/<button(?![^>]*onMouseEnter)([^>]*)>/g, '<button onMouseEnter={() => playHoverTick()} onTouchMove={() => playHoverTick()} $1>');
  
  // Make sure to add the import if missing
  if (!code.includes('playHoverTick')) {
    code = `import { playTactileClick, playHoverTick } from '../audio';\n` + code;
  }
  
  // Make sure we have playTactileClick on onClick if it exists and doesn't have it
  // This is a bit risky with regex, but let's try a simple approach.
  // We'll leave onClick alone, the main thing requested is consistent hover ticks, and perhaps click.
  fs.writeFileSync(filepath, code);
}

patchFile('src/App.tsx');
patchFile('src/components/ReportView.tsx');
patchFile('src/components/IntakeForm.tsx');
patchFile('src/components/ChatBot.tsx');

console.log('Patched buttons with hover ticks');
