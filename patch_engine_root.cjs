const fs = require('fs');
let code = fs.readFileSync('src/numerologyEngine.ts', 'utf8');

code = code.replace(
  /let root = sumDigits\(birthDay\);\n\s*while \(root > 9\) root = sumDigits\(root\);/,
  `let root = reduceNumber(birthDay, false);`
);

fs.writeFileSync('src/numerologyEngine.ts', code);
