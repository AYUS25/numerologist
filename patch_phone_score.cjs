const fs = require('fs');

let engine = fs.readFileSync('src/numerologyEngine.ts', 'utf8');

const enhancedLogic = `
  // Phone Analysis
  let phoneAnalysis = undefined;
  if (phoneNumber) {
    const digits = phoneNumber.replace(/\\D/g, '');
    let sum = 0;
    for (const char of digits) {
      sum += parseInt(char, 10);
    }
    const vibration = sum > 0 ? reduceNumber(sum) : 0;
    
    // Compatibility scoring logic
    let score = 50; // Base score
    if (vibration === lifePathNumber) {
      score = 100;
    } else if (
      (vibration % 2 === 0 && lifePathNumber % 2 === 0) || 
      (vibration % 2 !== 0 && lifePathNumber % 2 !== 0)
    ) {
      score = 80;
    } else {
      score = 60;
    }

    phoneAnalysis = {
      number: phoneNumber,
      vibration,
      insight: \`A phone vibration of \${vibration} aligns with \${vibration % 2 === 0 ? 'receptive, magnetic' : 'active, projective'} energies.\`,
      suggestion: \`Compatibility Score: \${score}/100 against your Life Path (\${lifePathNumber}).\`
    };
  }
`;

engine = engine.replace(
  /\/\/ Phone Analysis[\s\S]*?phoneAnalysis = \{[\s\S]*?\};\n  \}/,
  enhancedLogic.trim()
);

fs.writeFileSync('src/numerologyEngine.ts', engine);
console.log('Enhanced phone logic');
