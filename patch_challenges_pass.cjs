const fs = require('fs');
let code = fs.readFileSync('src/numerologyEngine.ts', 'utf8');

code = code.replace(
  'function generateLifePredictions(metrics: NumerologyMetrics): any[] {',
  'function generateLifePredictions(metrics: NumerologyMetrics, challenges: ChallengeCycle[]): any[] {'
);

code = code.replace(
  '    lifePredictions: generateLifePredictions(metrics),',
  '    lifePredictions: generateLifePredictions(metrics, challenges),'
);

const updatedScoreLogic = `
  // Calculate deterministic but seemingly deep scores based on numerology rules
  let baseCareer = (lp * 7 + ex * 3) % 40 + 60;
  let baseMoney = (lp * 4 + ex * 5) % 40 + 55;
  let baseMarriage = (su * 8 + lp * 2) % 40 + 50;
  let baseHealth = (lp * 5 + su * 3) % 40 + 55;
  let baseProperty = (ex * 6 + lp * 4) % 40 + 50;

  // Apply Karmic Debt Weightings
  const debts = [];
  if (metrics.lifePath.rawBeforeReduction === 13 || metrics.expression.rawBeforeReduction === 13 || metrics.soulUrge.rawBeforeReduction === 13) debts.push(13);
  if (metrics.lifePath.rawBeforeReduction === 14 || metrics.expression.rawBeforeReduction === 14 || metrics.soulUrge.rawBeforeReduction === 14) debts.push(14);
  if (metrics.lifePath.rawBeforeReduction === 16 || metrics.expression.rawBeforeReduction === 16 || metrics.soulUrge.rawBeforeReduction === 16) debts.push(16);
  if (metrics.lifePath.rawBeforeReduction === 19 || metrics.expression.rawBeforeReduction === 19 || metrics.soulUrge.rawBeforeReduction === 19) debts.push(19);

  if (debts.includes(13)) {
    baseCareer = Math.max(10, baseCareer - 15); // Laziness penalty
    baseProperty = Math.max(10, baseProperty - 10);
  }
  if (debts.includes(14)) {
    baseMoney = Math.max(10, baseMoney - 18); // Indulgence/risk penalty
    baseHealth = Math.max(10, baseHealth - 15);
  }
  if (debts.includes(16)) {
    baseMarriage = Math.max(10, baseMarriage - 20); // Ego/isolation penalty
  }
  if (debts.includes(19)) {
    baseCareer = Math.max(10, baseCareer - 12); // Abuse of power / stubbornness
    baseMarriage = Math.max(10, baseMarriage - 10);
  }

  // Cross-reference with Challenge Numbers
  if (challenges && challenges.length > 0) {
    const mainChallenge = challenges[challenges.length - 1].number; // The Main Challenge (4th) is lifelong
    if (mainChallenge === 4 || mainChallenge === 8) {
      baseMoney = Math.max(10, baseMoney - 10); // Constant financial friction
      baseCareer = Math.max(10, baseCareer - 5);
    }
    if (mainChallenge === 2 || mainChallenge === 6) {
      baseMarriage = Math.max(10, baseMarriage - 15); // Constant relationship friction
    }
    if (mainChallenge === 5) {
      baseHealth = Math.max(10, baseHealth - 10); // Nervous system burnout
    }
  }
`;

code = code.replace(
  /  \/\/ Calculate deterministic but seemingly deep scores based on numerology rules[\s\S]*?  const getNumLabel = \(num: number, dict: Record<number, string>\) => \{/,
  updatedScoreLogic + '\n  const getNumLabel = (num: number, dict: Record<number, string>) => {'
);

fs.writeFileSync('src/numerologyEngine.ts', code);
console.log("Patched challenges weighting.");
