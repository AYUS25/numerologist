const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

code = code.replace(
  /<button onMouseEnter=\{\(\) => playHoverTick\(\)\} \n              key=\{tab\.id\}\n              onClick=\{\(\) => \{ playTactileClick\(\); setActiveTab\(tab\.id as ActiveTab\); \}\} onMouseEnter=\{\(\) => playHoverTick\(\)\} onTouchMove=\{\(\) => playHoverTick\(\)\}/g,
  '<button\n              key={tab.id}\n              onClick={() => { playTactileClick(); setActiveTab(tab.id as ActiveTab); }} onMouseEnter={() => playHoverTick()} onTouchMove={() => playHoverTick()}'
);

code = code.replace(
  /<button onMouseEnter=\{\(\) => playHoverTick\(\)\} \n                    key=\{sector\.category\}\n                    onClick=\{\(\) => \{ playTactileClick\(\); setActiveSector\(sector\.category\); \}\} onMouseEnter=\{\(\) => playHoverTick\(\)\} onTouchMove=\{\(\) => playHoverTick\(\)\}/g,
  '<button\n                    key={sector.category}\n                    onClick={() => { playTactileClick(); setActiveSector(sector.category); }} onMouseEnter={() => playHoverTick()} onTouchMove={() => playHoverTick()}'
);

fs.writeFileSync('src/components/ReportView.tsx', code);
console.log("Fixed double onMouseEnter");
