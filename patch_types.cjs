const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(
  /export interface NumerologyMetrics \{\\n  rootNumber: number;/,
  `export interface NumerologyMetrics {\n  rootNumber: number;`
);

fs.writeFileSync('src/types.ts', code);
