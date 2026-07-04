const fs = require('fs');
let content = fs.readFileSync('src/numerologyEngine.ts', 'utf8');

const startStr = "function generateMasterCrystals(";
const endStr = "function generateLifePredictions(";
const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
    let funcBody = content.slice(startIndex, endIndex);
    
    funcBody = funcBody.replace(
      "function generateMasterCrystals(metrics: NumerologyMetrics, karmicDebts: KarmicDebt[], lifePredictions: any[]): MasterCrystal[] {",
      "function generateMasterCrystals(metrics: NumerologyMetrics, karmicDebts: KarmicDebt[], lifePredictions: any[], pinnacles: PinnacleCycle[], challenges: ChallengeCycle[], birthYear: number): MasterCrystal[] {"
    );

    // Let's add phase-specific crystal based on current pinnacle/challenge
    const returnStart = funcBody.lastIndexOf("return crystals;");
    if (returnStart !== -1) {
      const phaseCrystalLogic = `
  const currentAge = new Date().getFullYear() - birthYear;
  const extractAgeEnd = (ageStr: string) => {
    const match = ageStr.match(/Age (\\d+)/);
    return match ? parseInt(match[1], 10) : 99;
  };

  let currentChallenge = challenges[3];
  let currentPinnacle = pinnacles[3];
  for (let i = 0; i < 3; i++) {
    const ageEnd = extractAgeEnd(pinnacles[i].ageRange);
    if (currentAge <= ageEnd) {
      currentChallenge = challenges[i];
      currentPinnacle = pinnacles[i];
      break;
    }
  }

  // Suggest a crystal for the current Pinnacle/Challenge
  const challengeNum = currentChallenge.number;
  const pinnacleNum = currentPinnacle.number;
  
  let phaseCrystalName = "Clear Quartz";
  let phaseCrystalBenefit = "Amplifies your overall intentions during this transitional phase.";
  if (challengeNum === 1 || pinnacleNum === 1) { phaseCrystalName = "Carnelian"; phaseCrystalBenefit = "Ignites courage, motivation, and leadership needed for your current cycle."; }
  else if (challengeNum === 2 || pinnacleNum === 2) { phaseCrystalName = "Moonstone"; phaseCrystalBenefit = "Balances emotional turbulence and supports the diplomacy required in your current phase."; }
  else if (challengeNum === 3 || pinnacleNum === 3) { phaseCrystalName = "Blue Lace Agate"; phaseCrystalBenefit = "Clears the throat chakra, enabling the creative expression demanded by your current cycle."; }
  else if (challengeNum === 4 || pinnacleNum === 4) { phaseCrystalName = "Hematite"; phaseCrystalBenefit = "Provides heavy grounding to help you establish the discipline and structure needed now."; }
  else if (challengeNum === 5 || pinnacleNum === 5) { phaseCrystalName = "Aquamarine"; phaseCrystalBenefit = "Cools anxiety and brings flow to the rapid, unpredictable changes of your current cycle."; }
  else if (challengeNum === 6 || pinnacleNum === 6) { phaseCrystalName = "Emerald (or Green Jasper)"; phaseCrystalBenefit = "Nurtures the heart and provides patience for the heavy domestic or community responsibilities you face."; }
  else if (challengeNum === 7 || pinnacleNum === 7) { phaseCrystalName = "Labradorite"; phaseCrystalBenefit = "Protects your aura and deepens the spiritual insight required during this introspective phase."; }
  else if (challengeNum === 8 || pinnacleNum === 8) { phaseCrystalName = "Malachite"; phaseCrystalBenefit = "Draws immense material manifestation power while protecting you from unethical business energies."; }
  else if (challengeNum === 9 || pinnacleNum === 9) { phaseCrystalName = "Lepidolite"; phaseCrystalBenefit = "Eases the emotional pain of letting go and helps you surrender to the completions happening in this cycle."; }
  else if (challengeNum === 0) { phaseCrystalName = "Fluorite"; phaseCrystalBenefit = "Maintains mental clarity and protects against the subtle illusion that you have no challenges right now."; }

  crystals.push({
    name: phaseCrystalName,
    benefits: phaseCrystalBenefit,
    methodOfUse: "Keep close to you throughout your day to harmonize with the specific frequencies of your active Pinnacle and Challenge."
  });

  `;
      funcBody = funcBody.slice(0, returnStart) + phaseCrystalLogic + funcBody.slice(returnStart);
    }
    
    content = content.slice(0, startIndex) + funcBody + content.slice(endIndex);
    fs.writeFileSync('src/numerologyEngine.ts', content, 'utf8');
    console.log("Successfully replaced generateMasterCrystals");
} else {
    console.log("Could not find boundaries for generateMasterCrystals");
}
