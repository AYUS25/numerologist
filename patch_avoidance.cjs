const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');
code = code.replace(
  '  setbacks: string;\n}',
  '  setbacks: string;\n  avoidance: string;\n}'
);

code = code.replace(
  '  karmicDebts: KarmicDebt[];',
  '  karmicDebts: KarmicDebt[];\n  remedies: { category: string; advice: string }[];'
);
fs.writeFileSync('src/types.ts', code);
console.log("Updated types");
