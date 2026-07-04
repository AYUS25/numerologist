const fs = require('fs');
let code = fs.readFileSync('src/numerologyEngine.ts', 'utf8');

const regex = /  return \{\n    partnerName,\n    partnerDob,\n    score: overallScore,\n    overallSynergy,\n    verdict,\n    warnings,\n    recommendations: \{[\s\S]*?\},\n    matchDetails: \{[\s\S]*?\}\n  \};\n\}/;

const match = regex.exec(code);
if (match) {
  let rep = match[0].replace(/warnings,/, "warnings,\n    synergyIndex: overallScore,\n    cautionaryInsights,\n    radarData,");
  code = code.substring(0, match.index) + rep + code.substring(match.index + match[0].length);
  fs.writeFileSync('src/numerologyEngine.ts', code);
  console.log('Fixed return statement');
} else {
  console.log('Regex did not match return');
}
