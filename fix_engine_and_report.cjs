const fs = require('fs');

// Fix numerologyEngine.ts
let engineCode = fs.readFileSync('src/numerologyEngine.ts', 'utf8');

// replace oCore.karmicDebts with oKarmic (mapped array)
// and pCore.karmicDebts with pKarmic
const oKarmic = "ownerReport.karmicDebts.map(d => d.debtNumber)";
const pKarmic = "pReport.karmicDebts.map(d => d.debtNumber)";

engineCode = engineCode.replace(/oCore\.karmicDebts/g, oKarmic).replace(/pCore\.karmicDebts/g, pKarmic);

// Fix the return at the very end of calculatePartnerCompatibility if there are other return statements
// Ah, there was a second calculatePartnerCompatibility return maybe?
// Let's check line 1705 which is: src/numerologyEngine.ts(1705,3): error TS2739: Type '{ ... }' is missing properties
// Let's find line 1705 in engine
const engineLines = engineCode.split('\\n');
fs.writeFileSync('src/numerologyEngine.ts', engineCode);

// Fix ReportView.tsx
let reportCode = fs.readFileSync('src/components/ReportView.tsx', 'utf8');
reportCode = reportCode.replace(/import \{ Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer \} from 'recharts';\nimport \{ Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer \} from 'recharts';/, "import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';");
// just to be sure we remove the duplicate import at line 4 or 37
fs.writeFileSync('src/components/ReportView.tsx', reportCode);

console.log('Fixed engine and report');
