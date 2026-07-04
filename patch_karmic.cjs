const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

code = code.replace(
  '<span>Karmic Debts (Ancient Obstacles)</span>',
  '<span>Karmic Debts (Ancient Obstacles) <InfoTooltip text="Karmic Debts (13, 14, 16, 19) indicate burdens brought over from past lives that must be paid back or mastered in this lifetime." /></span>'
);

fs.writeFileSync('src/components/ReportView.tsx', code);
console.log("Patched Karmic Debts");
