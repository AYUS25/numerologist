const fs = require('fs');
let code = fs.readFileSync('src/numerologyEngine.ts', 'utf8');

const additionalWarnings = `
  if ((oLp === 1 && pLp === 1)) {
     warnings.push("Clash of Egos: Two 1s can be a highly competitive match. You both want to be in charge. If you don't support each other's independence, this can turn into a battleground.");
     lpScore -= 15;
  }
  if ((oLp === 2 && pLp === 2)) {
     warnings.push("Action Paralysis: Two 2s create a very sensitive and loving bond, but you might both avoid necessary confrontation, letting resentments build up. Make sure someone takes the lead.");
     lpScore -= 10;
  }
  if ((oLp === 3 && pLp === 4) || (oLp === 4 && pLp === 3)) {
     warnings.push("Spontaneity vs. Routine: The 3 wants fun and flexibility; the 4 demands structure and predictability. This can lead to the 3 feeling bored and the 4 feeling anxious. Major compromises required.");
     lpScore -= 20;
  }
  if ((oLp === 5 && pLp === 8) || (oLp === 8 && pLp === 5)) {
     warnings.push("Freedom vs. Control: 5 requires absolute freedom, while 8 naturally seeks to manage and control outcomes. This is a classic recipe for rebellion and power struggles.");
     lpScore -= 25;
  }
  if ((oLp === 6 && pLp === 7) || (oLp === 7 && pLp === 6)) {
     warnings.push("Misaligned Needs: The 6 needs constant emotional connection and reassurance, while the 7 requires deep isolation and intellectual space. This often results in the 6 feeling abandoned and the 7 feeling smothered.");
     lpScore -= 20;
  }
`;

code = code.replace(/if \(\(oLp === 1 && pLp === 8\)/, additionalWarnings + '\n  if ((oLp === 1 && pLp === 8)');

fs.writeFileSync('src/numerologyEngine.ts', code);
console.log('Added more warnings');
