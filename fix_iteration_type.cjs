const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

code = code.replace(
  /Object.entries\(metrics\)\.filter\(\(\[key\]\) => key !== 'peaceIndex' && key !== 'prosperityPotential'\)/g,
  "(Object.entries(metrics) as [string, any][]).filter(([key]) => key !== 'peaceIndex' && key !== 'prosperityPotential')"
);

fs.writeFileSync('src/components/ReportView.tsx', code);
