const fs = require('fs');

let typesCode = fs.readFileSync('src/types.ts', 'utf8');

typesCode = typesCode.replace(
  "export interface NumerologyMetrics {",
  "export interface NumerologyMetrics {\n  peaceIndex?: number;\n  prosperityPotential?: number;"
);

fs.writeFileSync('src/types.ts', typesCode);
