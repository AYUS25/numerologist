const fs = require('fs');
let code = fs.readFileSync('src/numerologyEngine.ts', 'utf8');

const chaldeanMapStr = `const chaldeanMap: Record<string, number> = { A: 1, I: 1, J: 1, Q: 1, Y: 1, B: 2, K: 2, R: 2, C: 3, G: 3, L: 3, S: 3, D: 4, M: 4, T: 4, E: 5, H: 5, N: 5, X: 5, U: 6, V: 6, W: 6, O: 7, Z: 7, F: 8, P: 8 };`;

const getChaldeanCompound = `
function getChaldeanCompound(name: string): number {
  let sum = 0;
  for (const char of name.toUpperCase().replace(/[^A-Z]/g, '')) {
    sum += chaldeanMap[char] || 0;
  }
  return sum;
}
function getChaldeanMeaning(num: number): string {
  switch(num) {
    case 10: return "Wheel of Fortune. Success, honor, and faith.";
    case 11: return "A hidden danger, trial, or treachery. Great difficulty.";
    case 12: return "The Sacrifice. Suffering or anxiety. The victim.";
    case 13: return "Upheaval and destruction, yet rebirth.";
    case 14: return "Movement, combination of people and things. Risk.";
    case 15: return "Magic and mystery. Charisma. Good for receiving gifts.";
    case 16: return "The Shattered Citadel. Defeat of plans.";
    case 17: return "The Star of the Magi. Peace and love. Highly fortunate.";
    case 18: return "Materialism destroying spiritual sides. Bitter quarrels.";
    case 19: return "Prince of Heaven. Highly fortunate. Success and honor.";
    case 20: return "The Awakening. New purpose, new plans, new ambitions.";
    case 21: return "The Crown of the Magi. General success, advancement.";
    case 22: return "Illusion and delusion. A good person who lives in a fool's paradise.";
    case 23: return "The Royal Star of the Lion. Success, help from superiors.";
    case 24: return "Love, money, and creativity. Fortunate through opposite sex.";
    case 25: return "Strength through experience. Success comes after early trials.";
    case 26: return "Disasters brought about by association with others.";
    case 27: return "The Sceptre. Good for authority, command, and intellect.";
    case 28: return "The Trusting Lamb. Loss through trust in others.";
    case 29: return "Grace under pressure. Deception by others, but internal strength.";
    case 30: return "Mental deduction. Usually puts intellect over material success.";
    case 31: return "The Recluse. Isolation. Not very fortunate from a worldly standpoint.";
    case 32: return "Communication. Good for mass movements and speaking.";
    case 33: return "A fortunate number promising help and protection from others.";
    case 37: return "Royal Star of the Bull. Good and fortunate friendships in love.";
    case 42: return "Love, affection, and sympathy. But can be naive.";
    case 52: return "A combination of creativity and sudden reversals.";
    default: return "A uniquely vibrating karmic compound pattern.";
  }
}
`;

if (!code.includes('const chaldeanMap')) {
  code = code.replace(
    /\} from '\.\/types';/,
    "} from './types';\n" + chaldeanMapStr + "\n" + getChaldeanCompound
  );
  
  fs.writeFileSync('src/numerologyEngine.ts', code);
  console.log("Added Chaldean compound properly.");
}
