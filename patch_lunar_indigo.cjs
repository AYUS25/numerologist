const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

// The user wanted the astrological/mystical bits to have the purple/indigo glow, and primary to be blue.
// Let's replace the remaining text-violet-400 with text-indigo-400 in these astrological widgets so it looks premium and intentional.
code = code.replace(/text-violet-400/g, 'text-indigo-400');
// Also change the globe icon background in planetary hour to indigo to match
code = code.replace(/bg-blue-500\/20 border border-blue-500\/40/g, 'bg-indigo-500/10 border border-indigo-500/30');

fs.writeFileSync('src/components/ReportView.tsx', code);
