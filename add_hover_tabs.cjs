const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

code = code.replace(
  /onClick=\{\(\) => setActiveTab\(tab\.id as ActiveTab\)\}/g,
  "onClick={() => { playTactileClick(); setActiveTab(tab.id as ActiveTab); }} onMouseEnter={() => playHoverTick()} onTouchMove={() => playHoverTick()}"
);

fs.writeFileSync('src/components/ReportView.tsx', code);
