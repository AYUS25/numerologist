const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

code = code.replace(
  /<AssetAnalyzer \/>/,
  "<AssetAnalyzer lifePathNumber={report.metrics.lifePath.number} />"
);

fs.writeFileSync('src/components/ReportView.tsx', code);
console.log('Passed lifePathNumber to AssetAnalyzer');
