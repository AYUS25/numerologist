const fs = require('fs');

let engine = fs.readFileSync('src/numerologyEngine.ts', 'utf8');

const updatedNameAnalysis = `
  // Enhanced Name Analysis
  let suggestion = metrics.expression.number === metrics.lifePath.number ? 
      'Your name harmonizes well with your Life Path.' : 
      'Consider emphasizing a middle initial or nickname to shift Expression closer to Life Path.';
      
  let insight = 'Your name frequency creates a unique energetic signature.';
  
  if (metrics.expression.number !== metrics.lifePath.number) {
    let diff = metrics.lifePath.number - metrics.expression.number;
    if (diff < 0) diff += 9;
    
    // Letters mapping to this diff
    const letterMap: Record<number, string> = {
      1: 'A, J, S', 2: 'B, K, T', 3: 'C, L, U', 4: 'D, M, V', 5: 'E, N, W', 6: 'F, O, X', 7: 'G, P, Y', 8: 'H, Q, Z', 9: 'I, R'
    };
    const suggestedLetters = letterMap[diff] || '';
    
    suggestion = \`To align with your Life Path (\${metrics.lifePath.number}), consider emphasizing or adding letters that sum to \${diff} (e.g., \${suggestedLetters}).\`;
  }

  const nameAnalysis = {
    currentExpression: metrics.expression.number,
    insight,
    suggestion
  };
`;

engine = engine.replace(
  /const nameAnalysis = \{[\s\S]*?\};\n/,
  updatedNameAnalysis
);

fs.writeFileSync('src/numerologyEngine.ts', engine);
console.log('Patched name analysis');
