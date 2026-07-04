const fs = require('fs');
let code = fs.readFileSync('src/numerologyEngine.ts', 'utf8');

// We need to inject some helper functions at the top or bottom and update the main export.
const injections = `
function analyzePhone(phone: string | undefined, lp: number) {
  if (!phone) return undefined;
  // strip non-digits
  const digits = phone.replace(/\\D/g, '');
  if (!digits) return undefined;
  let sum = 0;
  for(let i=0; i<digits.length; i++) sum += parseInt(digits[i]);
  const vibration = reduceNumber(sum);
  
  let insight = "This number carries a neutral resonance.";
  let suggestion = "Consider adding digits to reach a harmonious frequency.";
  
  if (vibration === lp) {
    insight = "This number perfectly aligns with your Life Path, amplifying your natural magnetic field.";
    suggestion = "Keep this number. It acts as a powerful amplifier for your core destiny.";
  } else if ([3, 6, 9].includes(vibration) && [3, 6, 9].includes(lp)) {
    insight = "Creative and expansive resonance; highly harmonious for social connections.";
    suggestion = "Excellent for networking and creative ventures.";
  } else if ([1, 4, 8].includes(vibration) && [1, 4, 8].includes(lp)) {
    insight = "Strong material and structural resonance; ideal for business.";
    suggestion = "Perfect for career and accumulating resources.";
  } else if ([2, 5, 7].includes(vibration) && [2, 5, 7].includes(lp)) {
    insight = "Deeply analytical or adaptable frequency.";
    suggestion = "Good for research, spiritual work, or travel.";
  } else {
    insight = \`The vibration of \${vibration} may introduce subtle friction against your Life Path \${lp} energy.\`;
    const target = lp;
    const diff = target - vibration > 0 ? target - vibration : target + 9 - vibration;
    suggestion = \`To align this with your Life Path (\${lp}), you might consider adding the number \${diff} to your contacts name or acquiring a number summing to \${lp}.\`;
  }
  
  return { number: phone, vibration, insight, suggestion };
}

function analyzeName(name: string, expr: number, lp: number) {
  let insight = "Your name frequency creates a unique energetic signature.";
  let suggestion = "No immediate changes recommended.";
  if (expr === lp) {
    insight = "Your name perfectly mirrors your destiny. You are walking your true path.";
    suggestion = "Your current name is a profound asset.";
  } else if ((expr%2) !== (lp%2)) {
    insight = "Your name introduces a contrasting elemental energy to your core path, causing occasional internal friction.";
    suggestion = "Consider emphasizing a middle initial or a nickname that shifts your Expression number closer to your Life Path.";
  } else {
    insight = "Your name harmonizes well with your Life Path, offering supplementary strengths.";
    suggestion = "Embrace the diverse talents your name vibration brings.";
  }
  return { currentExpression: expr, insight, suggestion };
}

function getLifecyclePhases(pinnacles: any) {
  return [
    { stage: 'Youth', ageRange: '0 - ' + pinnacles[0].age, theme: 'Formation & First Lessons', pinnacle: pinnacles[0].number, challenge: pinnacles[0].challenge || 0 },
    { stage: 'Mature', ageRange: pinnacles[0].age + ' - ' + pinnacles[2].age, theme: 'Action & Fruition', pinnacle: pinnacles[1].number, challenge: pinnacles[1].challenge || 0 },
    { stage: 'Wisdom', ageRange: pinnacles[2].age + '+', theme: 'Integration & Legacy', pinnacle: pinnacles[3].number, challenge: pinnacles[3].challenge || 0 }
  ];
}
`;

if (!code.includes('analyzePhone')) {
  // Inject right before generateNumerologyReport
  code = code.replace(/export function generateNumerologyReport/, injections + '\nexport function generateNumerologyReport');
  
  // Update generateNumerologyReport return
  const returnPattern = /return \{\s*input:\s*input,\s*metrics:\s*metrics,\s*pinnacles:\s*pinnacles,\s*challenges:\s*challenges,\s*karmicDebts:\s*karmicDebts,\s*lifePredictions:\s*generateLifePredictions\(metrics, challenges\),\s*remedies:\s*generateRemedies\(metrics\),\s*lunarPhase:\s*calculateLunarPhase\(new Date\(\)\),\s*planetaryHour:\s*calculatePlanetaryHour\(new Date\(\)\)\s*\};/m;
  
  if(code.match(returnPattern)) {
    code = code.replace(returnPattern, `
  // Calculate Peace & Prosperity
  const currentYear = new Date().getFullYear();
  const py = reduceNumber(reduceNumber(metrics.lifePath.number) + reduceNumber(currentYear));
  const peaceIndex = Math.min(100, Math.max(0, 50 + (py * 3) + (metrics.soulUrge.number * 2)));
  const prosperityPotential = Math.min(100, Math.max(0, 40 + (py * 4) + (metrics.expression.number * 3)));

  return {
    input,
    metrics: { ...metrics, peaceIndex, prosperityPotential },
    pinnacles,
    challenges,
    karmicDebts,
    lifePredictions: generateLifePredictions(metrics, challenges),
    remedies: generateRemedies(metrics),
    lunarPhase: calculateLunarPhase(new Date()),
    planetaryHour: calculatePlanetaryHour(new Date()),
    phoneAnalysis: analyzePhone(input.phoneNumber, metrics.lifePath.number),
    nameAnalysis: analyzeName(input.fullName, metrics.expression.number, metrics.lifePath.number),
    lifecyclePhases: getLifecyclePhases(pinnacles)
  };`);
  }
  
  // Replace Emotional Peace and Spiritual Fulfillment
  code = code.replace(/"Inner Peace & Harmony"/g, '"Emotional Peace"');
  code = code.replace(/"Spiritual Growth"/g, '"Spiritual Fulfillment"');
  
  fs.writeFileSync('src/numerologyEngine.ts', code);
  console.log("Engine additions applied");
}
