const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

if (!code.includes("import InfoTooltip")) {
  code = code.replace(
    "import { motion, AnimatePresence } from 'motion/react';",
    "import { motion, AnimatePresence } from 'motion/react';\nimport InfoTooltip from './InfoTooltip';"
  );
}

// Add tooltip to Pinnacle
code = code.replace(
  'Solar Age Pinnacles & Challenges',
  'Solar Age Pinnacles & Challenges <InfoTooltip text="Pinnacles represent the overarching themes and opportunities of four major periods in your life, calculated from your birth date." />'
);

// Add tooltip to Karmic Debts
code = code.replace(
  'Karmic Debts (Cosmic Corrections)',
  'Karmic Debts (Cosmic Corrections) <InfoTooltip text="Karmic Debts (13, 14, 16, 19) indicate burdens brought over from past lives that must be paid back or mastered in this lifetime." />'
);

// Add tooltip to Karmic Lessons
code = code.replace(
  'Karmic Lessons (Missing Vibrations)',
  'Karmic Lessons (Missing Vibrations) <InfoTooltip text="Karmic lessons represent numbers missing from your name, indicating energies or skills you have not yet mastered in previous incarnations." />'
);

fs.writeFileSync('src/components/ReportView.tsx', code);
console.log("Patched tooltips");
