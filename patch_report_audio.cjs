const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

if (!code.includes('playMechanicalDial')) {
  code = code.replace(
    /import \{ playTactileClick, playHoverTick \} from '\.\.\/audio';/,
    "import { playTactileClick, playHoverTick, playMechanicalDial } from '../audio';"
  );
  
  // When activeTab is set, change it to use playMechanicalDial instead of playTactileClick
  code = code.replace(
    /onClick=\{\(\) => \{ playTactileClick\(\); setActiveTab\(t\.id as any\); \}\}/g,
    "onClick={() => { playMechanicalDial(); setActiveTab(t.id as any); }}"
  );
  
  fs.writeFileSync('src/components/ReportView.tsx', code);
  console.log("Patched ReportView with playMechanicalDial for tabs");
}
