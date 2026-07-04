const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

code = code.replace(
  /type ActiveTab = 'profile' \| 'timeline' \| 'karmic' \| 'remedies' \| 'optimizer' \| 'compatibility' \| 'forecast' \| 'sectors' \| 'analysis' \| 'assets';/,
  `type ActiveTab = 'profile' | 'timeline' | 'karmic' | 'remedies' | 'optimizer' | 'compatibility' | 'forecast' | 'sectors' | 'name_analysis' | 'lifestyle';`
);

// Also fix the loop in ReportView that breaks over metrics:
code = code.replace(
  /Object\.entries\(metrics\)\.map\(\(\[key, metric\]\) => \{/g,
  `Object.entries(metrics).map(([key, metric]) => {\n                        if (key === 'rootNumber') return null;`
);

fs.writeFileSync('src/components/ReportView.tsx', code);
