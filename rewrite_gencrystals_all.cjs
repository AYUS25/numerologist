const fs = require('fs');
let content = fs.readFileSync('src/numerologyEngine.ts', 'utf8');

const startStr = "function generateMasterCrystals(";
const endStr = "function generateLifePredictions(";
const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
    const newFunc = `function generateMasterCrystals(metrics: NumerologyMetrics, karmicDebts: KarmicDebt[], lifePredictions: any[], pinnacles: PinnacleCycle[], challenges: ChallengeCycle[], birthYear: number): MasterCrystal[] {
  const lp = metrics.lifePath.number;
  const su = metrics.soulUrge.number;
  
  const crystals: MasterCrystal[] = [];

  const getCrystalForSector = (category: string, score: number): MasterCrystal => {
    const isPrimary = score < 60;
    if (category.includes('Career')) {
      return {
        name: [1, 8].includes(lp) ? "Tiger's Eye" : "Pyrite",
        benefits: isPrimary 
          ? "Urgently addresses your Career sector blockage by grounding erratic ambitions and activating the solar plexus for sustained executive focus." 
          : "Harmonizes your professional drive, preventing ego burnout and ensuring your efforts yield tangible structural results.",
        methodOfUse: "Keep visibly on your work desk or carry in your pocket during high-stakes negotiations."
      };
    } else if (category.includes('Marriage') || category.includes('Love')) {
      return {
        name: [2, 6, 9].includes(su) ? "Rose Quartz" : "Rhodonite",
        benefits: isPrimary 
          ? "Directly neutralizes relational friction by dissolving emotional armor and promoting unconditional empathy." 
          : "Balances your emotional frequencies, helping you attract and maintain harmonious, deeply connected partnerships.",
        methodOfUse: "Wear as a pendant over the heart chakra or place on your bedside table."
      };
    } else if (category.includes('Health')) {
      return {
        name: [3, 5].includes(lp) ? "Amethyst" : "Clear Quartz",
        benefits: isPrimary 
          ? "Targets your vitality deficit by clearing nervous system static and promoting deep, cellular-level restorative rest." 
          : "Amplifies your natural life force and purifies your auric field to support ongoing physical and mental resilience.",
        methodOfUse: "Place under your pillow to combat insomnia or hold during deep breathing exercises."
      };
    } else if (category.includes('Wealth') || category.includes('Finance')) {
      return {
        name: [4, 8].includes(lp) ? "Citrine" : "Green Aventurine",
        benefits: isPrimary 
          ? "Urgently clears scarcity mindset blockages in your financial sector, stimulating the continuous flow of material abundance." 
          : "Acts as a magnetic amplifier for wealth opportunities, ensuring your cosmic timing aligns with financial growth.",
        methodOfUse: "Keep in your wallet, safe, or the far-left corner (wealth corner) of your workspace."
      };
    } else {
      // Spiritual
      return {
        name: [7, 9, 11, 22].includes(lp) ? "Selenite" : "Lapis Lazuli",
        benefits: isPrimary 
          ? "Directly addresses your spiritual misalignment by cutting through dense ego structures and opening a clear channel to higher guidance." 
          : "Deepens your intuitive capacity, allowing you to access ancestral wisdom and quiet the disruptive chatter of the mind.",
        methodOfUse: "Use to sweep your aura at the end of the day to clear energetic debris, or hold to the third eye during meditation."
      };
    }
  };

  // Add crystal for each sector
  lifePredictions.forEach(sector => {
    crystals.push(getCrystalForSector(sector.category, sector.score));
  });

  // Current Phase Crystal
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

  // If there's a strong karmic debt, add a karmic crystal
  const debtNumbers = karmicDebts.map(d => d.debtNumber);
  if (debtNumbers.length > 0) {
    const debt = debtNumbers[0];
    if (debt === 13 || debt === 19) {
      crystals.push({
        name: "Black Tourmaline",
        benefits: \`Provides overarching karmic protection, deeply absorbing blockages related to your Karmic Debt \${debt}.\`,
        methodOfUse: "Wear continuously as a pendant or bracelet to ground erratic karmic cycles."
      });
    } else if (debt === 14 || debt === 16) {
      crystals.push({
        name: "Smoky Quartz",
        benefits: \`Transmutes the chaotic frequency of your Karmic Debt \${debt} into grounded, spiritual wisdom and emotional peace.\`,
        methodOfUse: "Hold during moments of acute stress or karmic triggering to rapidly return to center."
      });
    }
  }

  return crystals;
}

`;
    content = content.slice(0, startIndex) + newFunc + content.slice(endIndex);
    fs.writeFileSync('src/numerologyEngine.ts', content, 'utf8');
    console.log("Successfully replaced generateMasterCrystals");
} else {
    console.log("Could not find boundaries for generateMasterCrystals");
}
