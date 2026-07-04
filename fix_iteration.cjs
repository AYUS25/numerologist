const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

// The iteration is likely `Object.entries(metrics).map` or similar. Let's find it.
code = code.replace(
  /Object.entries\(metrics\)/g,
  "Object.entries(metrics).filter(([key]) => key !== 'peaceIndex' && key !== 'prosperityPotential')"
);

fs.writeFileSync('src/components/ReportView.tsx', code);
