const fs = require('fs');
let code = fs.readFileSync('src/numerologyEngine.ts', 'utf8');

code = code.replace(/ownerReport\.metrics\.destiny\?\.number/g, "ownerReport.metrics.maturity?.number");
code = code.replace(/pReport\.metrics\.destiny\?\.number/g, "pReport.metrics.maturity?.number");

code = code.replace(/d => d\.number/g, "d => d.debtNumber");

fs.writeFileSync('src/numerologyEngine.ts', code);
console.log('Fixed numerologyEngine.ts types');
