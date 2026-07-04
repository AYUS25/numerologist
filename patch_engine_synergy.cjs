const fs = require('fs');
let code = fs.readFileSync('src/numerologyEngine.ts', 'utf8');

const additionalLogic = `
  // Karmic Dissonance Calculation
  const cautionaryInsights: string[] = [];
  let karmicDissonanceScore = 0;
  
  if (oCore.karmicDebts.length > 0 && pCore.karmicDebts.length > 0) {
     const sharedDebts = oCore.karmicDebts.filter(d => pCore.karmicDebts.includes(d));
     if (sharedDebts.length > 0) {
        // We already handled sharedDebts in warnings, let's keep it there or here.
     }
     
     // Cross-referencing dissonance: e.g., one has 13/4 (hard work) and another has 14/5 (freedom/excess)
     if ((oCore.karmicDebts.includes(13) && pCore.karmicDebts.includes(14)) || (oCore.karmicDebts.includes(14) && pCore.karmicDebts.includes(13))) {
        cautionaryInsights.push("Karmic Dissonance (13 vs 14): Extreme friction between a need for rigid control and a drive for reckless escape. High probability of mutual frustration.");
        karmicDissonanceScore -= 15;
     }
     if ((oCore.karmicDebts.includes(16) && pCore.karmicDebts.includes(19)) || (oCore.karmicDebts.includes(19) && pCore.karmicDebts.includes(16))) {
        cautionaryInsights.push("Karmic Dissonance (16 vs 19): A clash between the collapse of ego (16) and the assertion of independence (19). Can lead to profound miscommunications and power vacuums.");
        karmicDissonanceScore -= 15;
     }
     if ((oCore.karmicDebts.includes(14) && pCore.karmicDebts.includes(16)) || (oCore.karmicDebts.includes(16) && pCore.karmicDebts.includes(14))) {
        cautionaryInsights.push("Karmic Dissonance (14 vs 16): Sudden upheavals meeting emotional unavailability. This pairing requires immense spiritual maturity to navigate without trauma.");
        karmicDissonanceScore -= 20;
     }
  }

  // Adjusted Synergy Index calculation
  let synergyIndex = Math.max(10, Math.round((lpScore * 0.3) + (suScore * 0.25) + (exScore * 0.2) + (deScore * 0.15) + (karmicScore * 0.1) + karmicDissonanceScore));

  const radarData = [
    { subject: 'Communication', score: Math.round(Math.max(20, Math.min(100, exScore + (karmicDissonanceScore/2)))), fullMark: 100 },
    { subject: 'Long-Term Stability', score: Math.round(Math.max(20, Math.min(100, (lpScore + deScore)/2 + karmicDissonanceScore))), fullMark: 100 },
    { subject: 'Creative Alignment', score: Math.round(Math.max(20, Math.min(100, suScore * 0.8 + exScore * 0.2))), fullMark: 100 },
    { subject: 'Emotional Intelligence', score: Math.round(Math.max(20, Math.min(100, suScore + (karmicScore > 70 ? 10 : -10)))), fullMark: 100 },
    { subject: 'Professional Potential', score: Math.round(Math.max(20, Math.min(100, deScore * 0.7 + lpScore * 0.3))), fullMark: 100 }
  ];
`;

const replaceRegex = /const overallScore = Math\.round\(\(lpScore \* 0\.3\) \+ \(suScore \* 0\.25\) \+ \(exScore \* 0\.2\) \+ \(deScore \* 0\.15\) \+ \(karmicScore \* 0\.1\)\);\s*let overallSynergy = "";\s*let verdict:/;

const replacementStr = additionalLogic + 
  "\n  const overallScore = synergyIndex;\n  let overallSynergy = \"\";\n  let verdict:";

code = code.replace(replaceRegex, replacementStr);

const retRegex = /return \{\s*partnerName: pName,\s*partnerDob: pDob,\s*score: overallScore,\s*overallSynergy,\s*verdict,\s*recommendations,\s*warnings,\s*matchDetails\s*\};/;
const retReplacement = `return {
    partnerName: pName,
    partnerDob: pDob,
    score: overallScore,
    synergyIndex: overallScore,
    overallSynergy,
    verdict,
    recommendations,
    warnings,
    cautionaryInsights,
    radarData,
    matchDetails
  };`;
  
code = code.replace(retRegex, retReplacement);

fs.writeFileSync('src/numerologyEngine.ts', code);
console.log('numerologyEngine.ts updated');
