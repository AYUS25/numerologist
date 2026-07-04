const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(
  /export interface CompatibilityResult \{[\s\S]*?\}\;/g,
  `export interface CompatibilityResult {
  partnerName: string;
  partnerDob: string;
  score: number;
  overallSynergy: string;
  verdict: 'Excellent' | 'Good' | 'Neutral' | 'Challenging' | 'Warning';
  recommendations: {
    romance: { score: number; label: string; description: string };
    friendship: { score: number; label: string; description: string };
    business: { score: number; label: string; description: string };
  };
  warnings: string[];
  matchDetails: {
    lifePath: string;
    soulUrge: string;
    expression: string;
    destiny: string;
    karmic: string;
  };
}`
);

fs.writeFileSync('src/types.ts', code);
console.log('types.ts updated');
