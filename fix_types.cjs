const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(/\}\n\n\}\nexport interface NumerologyMetrics/g, '}\n\nexport interface NumerologyMetrics');

fs.writeFileSync('src/types.ts', code);
console.log('Fixed types.ts');
