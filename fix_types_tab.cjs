const fs = require('fs');

let typesCode = fs.readFileSync('src/types.ts', 'utf8');

// Move peaceIndex and prosperityPotential from NumerologyReport to NumerologyMetrics
typesCode = typesCode.replace(
  "export interface NumerologyReport {\n  phoneAnalysis?: PhoneAnalysis;\n  nameAnalysis?: NameAnalysis;\n  lifecyclePhases?: LifecyclePhase[];\n  peaceIndex?: number;\n  prosperityPotential?: number;",
  "export interface NumerologyReport {\n  phoneAnalysis?: PhoneAnalysis;\n  nameAnalysis?: NameAnalysis;\n  lifecyclePhases?: LifecyclePhase[];"
);

if (!typesCode.includes("peaceIndex: number;")) {
  typesCode = typesCode.replace(
    "soulUrge: NumerologyNumber;",
    "soulUrge: NumerologyNumber;\n  peaceIndex?: number;\n  prosperityPotential?: number;"
  );
}
fs.writeFileSync('src/types.ts', typesCode);

let reportViewCode = fs.readFileSync('src/components/ReportView.tsx', 'utf8');
reportViewCode = reportViewCode.replace(
  "type ActiveTab = 'profile' | 'timeline' | 'karmic' | 'remedies' | 'optimizer' | 'compatibility' | 'forecast' | 'sectors';",
  "type ActiveTab = 'profile' | 'timeline' | 'karmic' | 'remedies' | 'optimizer' | 'compatibility' | 'forecast' | 'sectors' | 'analysis';"
);
fs.writeFileSync('src/components/ReportView.tsx', reportViewCode);
console.log("Fixed types and ActiveTab");
