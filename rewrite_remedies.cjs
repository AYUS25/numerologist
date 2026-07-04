const fs = require('fs');
let content = fs.readFileSync('src/numerologyEngine.ts', 'utf8');

const returnBlockStr = `    lifePredictions: (() => {
      const preds = generateLifePredictions(metrics, challenges);
      return preds;
    })(),
    remedies: generateRemedies(metrics, pinnacles, challenges),
    spiritualRemedies: generateSpiritualRemedies(metrics, challenges, pinnacles, karmicLessons, karmicDebts, generateLifePredictions(metrics, challenges)),
    masterCrystals: generateMasterCrystals(metrics, karmicDebts, generateLifePredictions(metrics, challenges), pinnacles, challenges),`;

const returnBlockStartStr = "    lifePredictions: (() => {";
const returnBlockEndStr = "masterCrystals: generateMasterCrystals(metrics, karmicDebts, generateLifePredictions(metrics, challenges)),";
const rbStartIndex = content.indexOf(returnBlockStartStr);
const rbEndIndex = content.indexOf(returnBlockEndStr) + returnBlockEndStr.length;

if (rbStartIndex !== -1 && rbEndIndex !== -1) {
    content = content.slice(0, rbStartIndex) + returnBlockStr + content.slice(rbEndIndex);
    console.log("Replaced generateNumerologyReport return block");
} else {
    console.log("Could not find generateNumerologyReport return block");
}

fs.writeFileSync('src/numerologyEngine.ts', content, 'utf8');
