const fs = require('fs');
let code = fs.readFileSync('src/numerologyEngine.ts', 'utf8');

const newFunction = `// COMPLETE COOPERATIVE COMPATIBILITY CALCULATOR
export function calculatePartnerCompatibility(
  ownerReport: NumerologyReport,
  partnerName: string,
  partnerDob: string
): CompatibilityResult {
  const pReport = generateNumerologyReport(partnerName, partnerDob);
  
  const oLp = ownerReport.metrics.lifePath.number;
  const pLp = pReport.metrics.lifePath.number;
  
  const oSu = ownerReport.metrics.soulUrge.number;
  const pSu = pReport.metrics.soulUrge.number;
  
  const oEx = ownerReport.metrics.expression.number;
  const pEx = pReport.metrics.expression.number;
  
  const oDe = ownerReport.metrics.destiny?.number || ownerReport.metrics.lifePath.number;
  const pDe = pReport.metrics.destiny?.number || pReport.metrics.lifePath.number;

  // Let's compare Life Paths (Foundation)
  let lpScore = 50;
  let lpMatchText = "";
  if (oLp === pLp) {
    lpScore = 95;
    lpMatchText = "Identical Paths! You travel the exact same wavelength, understanding each other's core motivations instantly. Highly synergistic but watch for mirroring negative habits.";
  } else {
    const lpTriads = [[1, 5, 7], [2, 4, 8], [3, 6, 9]];
    const sameTriad = lpTriads.some(triad => triad.includes(oLp) && triad.includes(pLp));
    if (sameTriad) {
      lpScore = 90;
      lpMatchText = "Triad Harmony! You are in the same element. You express yourselves in compatible, highly supportive ways that form an organic alignment.";
    } else if (Math.abs(oLp - pLp) === 1 || Math.abs(oLp - pLp) === 5) {
      lpScore = 75;
      lpMatchText = "Friendly Vibe. Your Life Paths cooperate easily. One provides structure or fuel, while the other offers perspective. Minimal natural friction.";
    } else {
      lpScore = 40;
      lpMatchText = "Complementary Growth. Your paths are highly diverse, meaning you act as teachers for one another. Mutual adjustments and listening will release major potential, but expect initial friction.";
    }
  }

  // Compare Soul Urges (Heart's Desire - Romance/Intimacy)
  let suScore = 50;
  let suMatchText = "";
  if (oSu === pSu) {
    suScore = 98;
    suMatchText = "Spiritual Soulmates! Your inner longings and emotional hungers are completely identical. You find emotional safety in the exact same environments.";
  } else if ([oSu, pSu].includes(6) || [oSu, pSu].includes(2) || [oSu, pSu].includes(9)) {
    suScore = 85;
    suMatchText = "Warm resonance. At least one partner carries a high nurturing vibration, creating a highly sympathetic and emotionally safe bond.";
  } else if (Math.abs(oSu - pSu) === 3 || Math.abs(oSu - pSu) === 2) {
    suScore = 70;
    suMatchText = "Adaptive Desire. You are motivated by different dreams, but they balance each other beautifully without colliding.";
  } else {
    suScore = 45;
    suMatchText = "Diverse Motivators. Your private drives differ. Speak openly about what truly makes you happy to align your core forces.";
  }

  // Compare Expressions (Working/Talents - Business/Colleagues)
  let exScore = 50;
  let exMatchText = "";
  if (oEx === pEx) {
    exScore = 90;
    exMatchText = "Coordinated Execution! You have identical approaches to solving daily challenges and managing work. You make an incredibly fast-paced, effective business or project team.";
  } else {
    const businessTriad = [2, 4, 8];
    if (businessTriad.includes(oEx) && businessTriad.includes(pEx)) {
      exScore = 95;
      exMatchText = "Master Builders together! Both carry natural practical discipline, organizational strength, or financial leadership. Amazing team dynamics.";
    } else if (Math.abs(oEx - pEx) <= 2) {
      exScore = 75;
      exMatchText = "Easy Collaboration. Your professional styles align easily. You are comfortable sharing tasks and understand each other's communication style.";
    } else {
      exScore = 50;
      exMatchText = "Contrasting Methods. One is highly spontaneous or intellectual, while the other is systematic or emotional. Balance is your power when you divide responsibilities.";
    }
  }
  
  // Compare Destiny (Long term goals)
  let deScore = 50;
  let deMatchText = "";
  if (oDe === pDe) {
     deScore = 95;
     deMatchText = "Parallel Destinies! Your ultimate goals and life purpose point in the exact same direction. A powerful alliance.";
  } else if (Math.abs(oDe - pDe) === 3) {
     deScore = 80;
     deMatchText = "Synergistic Ambitions. Your destinies complement each other nicely, creating a balanced and progressive momentum together.";
  } else {
     deScore = 45;
     deMatchText = "Divergent Horizons. You may find yourselves being pulled in different directions over the long term. Requires conscious compromise.";
  }
  
  // Karmic Friction Check
  let karmicScore = 80;
  let karmicMatchText = "Smooth Karmic Flow. No major overlapping karmic debts detected.";
  const oDebts = ownerReport.karmicDebts.map(d => d.number);
  const pDebts = pReport.karmicDebts.map(d => d.number);
  const sharedDebts = oDebts.filter(d => pDebts.includes(d));
  
  let warnings: string[] = [];
  
  if (sharedDebts.length > 0) {
     karmicScore = 30;
     karmicMatchText = "Karmic Mirroring. You both carry the same karmic debts (" + sharedDebts.join(", ") + "), which means you will likely trigger each other's deepest unresolved patterns.";
     warnings.push("Karmic Trigger Warning: You both share the Karmic Debt " + sharedDebts[0] + ". This relationship may feel intensely familiar but can trap you in repetitive negative cycles if you aren't both consciously healing.");
  }
  
  // Toxic combinations logic (hypothetical examples)
  if ((oLp === 1 && pLp === 8) || (oLp === 8 && pLp === 1)) {
     warnings.push("Power Struggle Warning: 1 and 8 are both strong-willed leaders. Unless you divide domains of authority, extreme power struggles and ego clashes are likely.");
     lpScore -= 20;
  }
  if ((oLp === 4 && pLp === 5) || (oLp === 5 && pLp === 4)) {
     warnings.push("Instability Warning: 4 needs rigid structure, 5 craves absolute freedom. This pairing often leads to the 4 feeling anxious and the 5 feeling suffocated. Stay away unless willing to severely compromise.");
     lpScore -= 25;
  }

  const overallScore = Math.round((lpScore * 0.3) + (suScore * 0.25) + (exScore * 0.2) + (deScore * 0.15) + (karmicScore * 0.1));
  let overallSynergy = "";
  let verdict: 'Excellent' | 'Good' | 'Neutral' | 'Challenging' | 'Warning' = 'Neutral';

  if (overallScore >= 85) {
    verdict = 'Excellent';
    overallSynergy = "A high-vibrational celestial match. Your core blueprints lock together like ancient gears. You share deeply compatible spiritual pathways and emotional blueprints.";
  } else if (overallScore >= 70) {
    verdict = 'Good';
    overallSynergy = "A highly balanced and cooperative resonance. Your paths are supportive, offering rich balances where one partner's strengths support the other's karmic opportunities.";
  } else if (overallScore >= 55) {
    verdict = 'Neutral';
    overallSynergy = "A diverse 'Soul Teacher' relationship. Your vibrational patterns are contrasting. You serve to trigger each other's hidden spiritual maturity.";
  } else if (overallScore >= 40) {
    verdict = 'Challenging';
    overallSynergy = "A difficult alignment requiring intense compromise. The numerological vibrations are naturally at odds, leading to frequent misunderstandings.";
  } else {
    verdict = 'Warning';
    overallSynergy = "High Karmic Friction. The energetic signatures here are highly antagonistic. Without extreme self-awareness, this connection can be draining or destructive.";
    warnings.push("General Warning: The overall synergy score is exceptionally low. Proceed with caution and maintain strong personal boundaries.");
  }

  // Calculate Romance
  const romanceScore = Math.round((suScore * 0.5) + (lpScore * 0.3) + (karmicScore * 0.2));
  let romanceLabel = romanceScore >= 80 ? "Highly Recommended" : romanceScore >= 60 ? "Favorable" : romanceScore >= 40 ? "Needs Work" : "Not Recommended";
  
  // Calculate Friendship
  const friendshipScore = Math.round((lpScore * 0.4) + (exScore * 0.3) + (deScore * 0.3));
  let friendshipLabel = friendshipScore >= 80 ? "Highly Recommended" : friendshipScore >= 60 ? "Favorable" : friendshipScore >= 40 ? "Needs Work" : "Not Recommended";

  // Calculate Business
  const businessScore = Math.round((exScore * 0.5) + (deScore * 0.3) + (lpScore * 0.2));
  let businessLabel = businessScore >= 80 ? "Highly Recommended" : businessScore >= 60 ? "Favorable" : businessScore >= 40 ? "Needs Work" : "Not Recommended";

  return {
    partnerName,
    partnerDob,
    score: overallScore,
    overallSynergy,
    verdict,
    warnings,
    recommendations: {
      romance: { score: romanceScore, label: romanceLabel, description: "Evaluates emotional safety, intimate desires, and spiritual alignment (Soul Urge & Life Path heavily weighted)." },
      friendship: { score: friendshipScore, label: friendshipLabel, description: "Evaluates lifestyle rhythm, social expression, and shared long-term directions (Life Path & Expression heavily weighted)." },
      business: { score: businessScore, label: businessLabel, description: "Evaluates practical execution, work ethic, and material goals (Expression & Destiny heavily weighted)." }
    },
    matchDetails: {
      lifePath: lpMatchText,
      soulUrge: suMatchText,
      expression: exMatchText,
      destiny: deMatchText,
      karmic: karmicMatchText
    }
  };
}
`;

const startIndex = code.indexOf('// COMPLETE COOPERATIVE COMPATIBILITY CALCULATOR');
code = code.slice(0, startIndex) + newFunction;

fs.writeFileSync('src/numerologyEngine.ts', code);
console.log('calculatePartnerCompatibility updated');
