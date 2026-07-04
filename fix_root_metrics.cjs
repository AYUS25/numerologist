const fs = require('fs');

// 1. Fix types.ts
let typesCode = fs.readFileSync('src/types.ts', 'utf8');
// Remove from NumerologyMetrics
typesCode = typesCode.replace(
  "export interface NumerologyMetrics {\n  peaceIndex?: number;\n  prosperityPotential?: number;",
  "export interface NumerologyMetrics {"
);
// Add to NumerologyReport
typesCode = typesCode.replace(
  "export interface NumerologyReport {",
  "export interface NumerologyReport {\n  peaceIndex?: number;\n  prosperityPotential?: number;"
);
fs.writeFileSync('src/types.ts', typesCode);


// 2. Fix numerologyEngine.ts
let engineCode = fs.readFileSync('src/numerologyEngine.ts', 'utf8');
engineCode = engineCode.replace(
  "metrics: { ...metrics, peaceIndex, prosperityPotential },",
  "metrics,\n    peaceIndex,\n    prosperityPotential,"
);
fs.writeFileSync('src/numerologyEngine.ts', engineCode);

// 3. Fix ReportView.tsx
let reportCode = fs.readFileSync('src/components/ReportView.tsx', 'utf8');
// Revert the Object.entries cast because NumerologyMetrics is pure again
reportCode = reportCode.replace(
  /\(Object\.entries\(metrics\) as \[string, any\]\[\]\)\.filter\(\(\[key\]\) => key !== 'peaceIndex' && key !== 'prosperityPotential'\)/g,
  "Object.entries(metrics)"
);
// Fix the references from report.metrics.peaceIndex to report.peaceIndex
reportCode = reportCode.replace(/report\.metrics\.peaceIndex/g, 'report.peaceIndex');
reportCode = reportCode.replace(/report\.metrics\.prosperityPotential/g, 'report.prosperityPotential');

fs.writeFileSync('src/components/ReportView.tsx', reportCode);
console.log("Fixed metrics locations");
