const fs = require('fs');

let engine = fs.readFileSync('src/numerologyEngine.ts', 'utf8');

const analysisLogic = `
  const peaceIndex = Math.min(100, Math.max(0, 50 + (metrics.lifePath.number * 2) - (metrics.personalYear.number * 3)));
  const prosperityPotential = Math.min(100, Math.max(0, 60 + (metrics.expression.number * 3) + (metrics.personalYear.number * 2)));

  let phoneAnalysis = undefined;
  if (phoneNumber) {
    const digits = phoneNumber.replace(/\\D/g, '');
    let sum = 0;
    for (const char of digits) {
      sum += parseInt(char, 10);
    }
    const vibration = sum > 0 ? reduceNumber(sum) : 0;
    
    let score = 50;
    if (vibration === metrics.lifePath.number) score = 100;
    else if (vibration % 2 === metrics.lifePath.number % 2) score = 80;
    else score = 60;

    phoneAnalysis = {
      number: phoneNumber,
      vibration,
      insight: \`A phone vibration of \${vibration} aligns with \${vibration % 2 === 0 ? 'receptive' : 'active'} energies.\`,
      suggestion: \`Compatibility Score: \${score}/100 against your Life Path (\${metrics.lifePath.number}).\`
    };
  }

  const nameAnalysis = {
    currentExpression: metrics.expression.number,
    insight: 'Your name frequency creates a unique energetic signature.',
    suggestion: metrics.expression.number === metrics.lifePath.number ? 
      'Your name harmonizes well with your Life Path.' : 
      'Consider emphasizing a middle initial or nickname to shift Expression closer to Life Path.'
  };

  return {
    peaceIndex,
    prosperityPotential,
    phoneAnalysis,
    nameAnalysis,
    input: { fullName, dateOfBirth, timeOfBirth, placeOfBirth, phoneNumber },`;

engine = engine.replace(
  /return \{\s*input: \{ fullName, dateOfBirth, timeOfBirth, placeOfBirth, phoneNumber \},/,
  analysisLogic
);

fs.writeFileSync('src/numerologyEngine.ts', engine);
console.log('Patched numerologyEngine with all new features');
