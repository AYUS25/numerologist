const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

code = code.replace(
  /Object\.entries\(metrics\)\.map\(\(\[key, metric\]\) => \{/g,
  `Object.entries(metrics).filter(([key, value]) => typeof value === 'object' && value !== null).map(([key, metric]: [string, any]) => {`
);

fs.writeFileSync('src/components/ReportView.tsx', code);
