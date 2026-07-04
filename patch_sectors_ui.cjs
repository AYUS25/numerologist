const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

// Rename "Life Sectors" to "Vibrational Life Domains"
code = code.replace(/Life Sectors & Cautions/g, 'Vibrational Life Domains');
code = code.replace(/Life Sectors Intensity Scaling/g, 'Vibrational Domains Intensity Scaling');
code = code.replace(/Tab 7: Life Sectors/g, 'Tab 7: Vibrational Domains');

// Fix the gap in the domains list if any (might be due to missing grid or max heights, let's just make sure it's clean)
// In ReportView, there's a flex wrap for buttons:
// <div className="flex flex-wrap gap-2 border-b border-white/[0.08] pb-4">
// Let's add onMouseEnter for hover sound to all buttons
// And change text-purple-400 to text-blue-500 or blue-400

code = code.replace(/text-purple-400/g, 'text-blue-400');
code = code.replace(/text-purple-300/g, 'text-blue-300');
code = code.replace(/text-purple-500/g, 'text-blue-500');
code = code.replace(/from-blue-900 via-blue-500 to-purple-400/g, 'from-blue-900 via-blue-500 to-blue-300');

// Inject hover play tick
if (code.includes('import { playTactileClick } from')) {
  code = code.replace('import { playTactileClick } from', 'import { playTactileClick, playHoverTick } from');
}

// Add onMouseEnter to buttons
code = code.replace(/<button([^>]*)onClick=\{\(\) => setActiveSector\(([^)]+)\)\}([^>]*)>/g, '<button$1onClick={() => { playTactileClick(); setActiveSector($2); }} onMouseEnter={() => playHoverTick()} onTouchMove={() => playHoverTick()}$3>');
code = code.replace(/<button([^>]*)onClick=\{\(\) => setActiveTab/g, '<button$1onMouseEnter={() => playHoverTick()} onTouchMove={() => playHoverTick()} onClick={() => { playTactileClick(); setActiveTab');

fs.writeFileSync('src/components/ReportView.tsx', code);
console.log("Patched ReportView sectors and hover events");
