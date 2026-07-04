const fs = require('fs');
let content = fs.readFileSync('src/numerologyEngine.ts', 'utf8');

// Replace the return block in generateNumerologyReport
const returnBlockStartStr = "    lifePredictions: generateLifePredictions(metrics, challenges),";
const returnBlockEndStr = "masterCrystals: generateMasterCrystals(metrics, karmicDebts),";
const rbStartIndex = content.indexOf(returnBlockStartStr);
const rbEndIndex = content.indexOf(returnBlockEndStr) + returnBlockEndStr.length;

if (rbStartIndex !== -1 && rbEndIndex !== -1) {
    const newReturnBlock = `    lifePredictions: (() => {
      const preds = generateLifePredictions(metrics, challenges);
      return preds;
    })(),
    remedies: generateRemedies(metrics),
    spiritualRemedies: generateSpiritualRemedies(metrics, challenges, karmicLessons, karmicDebts),
    masterCrystals: generateMasterCrystals(metrics, karmicDebts, generateLifePredictions(metrics, challenges)),`;
    content = content.slice(0, rbStartIndex) + newReturnBlock + content.slice(rbEndIndex);
    console.log("Replaced generateNumerologyReport return block");
} else {
    console.log("Could not find generateNumerologyReport return block");
}

// Replace generateMasterCrystals
const mcStartStr = "function generateMasterCrystals(";
const mcEndStr = "function generateLifePredictions(";
const mcStartIndex = content.indexOf(mcStartStr);
const mcEndIndex = content.indexOf(mcEndStr);

if (mcStartIndex !== -1 && mcEndIndex !== -1) {
    const newFunc = `function generateMasterCrystals(metrics: NumerologyMetrics, karmicDebts: KarmicDebt[], lifePredictions: any[]): MasterCrystal[] {
  const lp = metrics.lifePath.number;
  const su = metrics.soulUrge.number;
  
  // Sort sectors by lowest score first
  const sortedSectors = [...lifePredictions].sort((a, b) => a.score - b.score);
  const weakestSector = sortedSectors[0];
  const secondWeakestSector = sortedSectors[1];

  const crystals: MasterCrystal[] = [];

  const getCrystalForSector = (category: string, isPrimary: boolean): MasterCrystal => {
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
          ? "Directly neutralizes relational friction in your lowest-scoring sector by dissolving emotional armor and promoting unconditional empathy." 
          : "Balances your emotional frequencies, helping you attract and maintain harmonious, deeply connected partnerships.",
        methodOfUse: "Wear as a pendant over the heart chakra or place on your bedside table."
      };
    } else if (category.includes('Health')) {
      return {
        name: [3, 5].includes(lp) ? "Amethyst" : "Clear Quartz",
        benefits: isPrimary 
          ? "Targets your critical vitality deficit by clearing nervous system static and promoting deep, cellular-level restorative rest." 
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

  crystals.push(getCrystalForSector(weakestSector.category, true));
  if (secondWeakestSector) {
    crystals.push(getCrystalForSector(secondWeakestSector.category, false));
  }

  // If there's a strong karmic debt, add a 3rd overarching karmic crystal
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
    content = content.slice(0, mcStartIndex) + newFunc + content.slice(mcEndIndex);
    fs.writeFileSync('src/numerologyEngine.ts', content, 'utf8');
    console.log("Successfully replaced generateMasterCrystals");
} else {
    console.log("Could not find boundaries for generateMasterCrystals");
}
