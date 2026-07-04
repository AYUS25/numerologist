const fs = require('fs');
let code = fs.readFileSync('src/components/AssetAnalyzer.tsx', 'utf8');

code = code.replace(
  /remedyText \+= \`To improve energetic alignment/,
  `remedyText += \`If choosing a new vehicle, aim for a license plate whose digits sum to \${lp}. To improve current energetic alignment`
);

code = code.replace(
  /remedyText \+= \`To harmonize the energy/,
  `remedyText += \`If choosing a new home, aim for a house number that reduces to \${lp}. To harmonize the current energy`
);

fs.writeFileSync('src/components/AssetAnalyzer.tsx', code);
