const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

const additionalTypes = `
export interface LunarPhase {
  phase: string;
  illumination: number;
  insight: string;
}

export interface PlanetaryHour {
  planet: string;
  energy: string;
}
`;

if (!code.includes('LunarPhase')) {
  code = code.replace(
    'export interface NumerologyReport {',
    additionalTypes + '\nexport interface NumerologyReport {'
  );
  
  code = code.replace(
    '  analysisSummary: string;',
    '  analysisSummary: string;\n  lunarPhase?: LunarPhase;\n  planetaryHour?: PlanetaryHour;'
  );
  fs.writeFileSync('src/types.ts', code);
}
console.log("Patched types for Lunar/Planetary");
