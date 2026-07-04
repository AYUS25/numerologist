const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

code = code.replace(
  'const optRep = generateNumerologyReport(testName.trim(), input.dateOfBirth);',
  'const optRep = generateNumerologyReport(testName.trim(), input.dateOfBirth, input.timeOfBirth, input.placeOfBirth);'
);

fs.writeFileSync('src/components/ReportView.tsx', code);
