const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(/    friendship: \{ score: number; label: string; description: string \};\n    business: \{ score: number; label: string; description: string \};\n  \};\n  warnings: string\[\];\n  matchDetails: \{\n    lifePath: string;\n    soulUrge: string;\n    expression: string;\n    destiny: string;\n    karmic: string;\n  \};\n\}/, '');

fs.writeFileSync('src/types.ts', code);
console.log('types.ts fixed');
