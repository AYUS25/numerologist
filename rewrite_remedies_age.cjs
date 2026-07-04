const fs = require('fs');
let content = fs.readFileSync('src/numerologyEngine.ts', 'utf8');

const returnBlockStartStr = "    lifePredictions: (() => {";
const returnBlockEndStr = "masterCrystals: generateMasterCrystals(metrics, karmicDebts, generateLifePredictions(metrics, challenges), pinnacles, challenges),";

const rbStartIndex = content.indexOf(returnBlockStartStr);
const rbEndIndex = content.indexOf(returnBlockEndStr) + returnBlockEndStr.length;

if (rbStartIndex !== -1 && rbEndIndex !== -1) {
    const newReturnBlock = `    lifePredictions: (() => {
      const preds = generateLifePredictions(metrics, challenges);
      return preds;
    })(),
    remedies: generateRemedies(metrics, pinnacles, challenges, birthYear),
    spiritualRemedies: generateSpiritualRemedies(metrics, challenges, karmicLessons, karmicDebts, generateLifePredictions(metrics, challenges), birthYear, pinnacles),
    masterCrystals: generateMasterCrystals(metrics, karmicDebts, generateLifePredictions(metrics, challenges), pinnacles, challenges, birthYear),`;
    content = content.slice(0, rbStartIndex) + newReturnBlock + content.slice(rbEndIndex);
    console.log("Updated generateNumerologyReport return block with birthYear");
} else {
    console.log("Could not find generateNumerologyReport return block");
}

fs.writeFileSync('src/numerologyEngine.ts', content, 'utf8');
