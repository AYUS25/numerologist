const fs = require('fs');
let code = fs.readFileSync('src/numerologyEngine.ts', 'utf8');

code = code.replace(
  /function calculateLunarPhase/g,
  'export function calculateLunarPhase'
);
code = code.replace(
  /function calculatePlanetaryHour/g,
  'export function calculatePlanetaryHour'
);

fs.writeFileSync('src/numerologyEngine.ts', code);
console.log('Exported functions');
