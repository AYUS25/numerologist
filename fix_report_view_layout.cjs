const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

// 1. Move Planetary Hour inside the grid
code = code.replace(
  /<\/div>\s*\{\/\* Planetary Hour Widget \*\/\}\s*<div className="bg-white\/\[0\.03\] backdrop-blur-md border border-indigo-500\/20 p-4 rounded-xl flex items-start gap-4">/,
  `        {/* Planetary Hour Widget */}
        <div className="bg-white/[0.03] backdrop-blur-md border border-indigo-500/20 p-4 rounded-xl flex items-start gap-4">`
);
code = code.replace(
  /\{\/\* Planetary Hour Widget \*\/\}[\s\S]*?<\/div>\s*<\/div>/,
  (match) => match + '\n      </div>'
); // this is tricky, let's just do a manual replace for the widgets div.

fs.writeFileSync('src/components/ReportView.tsx', code);
