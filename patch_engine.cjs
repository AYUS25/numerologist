const fs = require('fs');
let code = fs.readFileSync('src/numerologyEngine.ts', 'utf8');

code = code.replace(
  /const metrics: NumerologyMetrics = \{/,
  "  let root = sumDigits(birthDay);\n  while (root > 9) root = sumDigits(root);\n\n  const metrics: NumerologyMetrics = {\n    rootNumber: root,"
);

fs.writeFileSync('src/numerologyEngine.ts', code);
