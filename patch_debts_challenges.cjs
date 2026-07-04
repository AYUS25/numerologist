const fs = require('fs');
let code = fs.readFileSync('src/numerologyEngine.ts', 'utf8');

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

  // Cross-reference with Challenge Numbers (simulate the current active challenge)
  const currentYear = new Date().getFullYear();
  // We can just use the first challenge for this example if it's not provided explicitly
  // We don't have direct access to 'challenges' array here without passing it in.
  // Actually, wait, \`metrics\` doesn't contain challenges, it's calculated in the main block.
`;
