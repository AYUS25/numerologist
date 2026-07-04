const fs = require('fs');
let content = fs.readFileSync('src/numerologyEngine.ts', 'utf8');

const startStr = "function generateSpiritualRemedies(";
const endStr = "function generateMasterCrystals(";
const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
    let funcBody = content.slice(startIndex, endIndex);
    
    funcBody = funcBody.replace(
      "function generateSpiritualRemedies(\n  metrics: NumerologyMetrics,\n  challenges: ChallengeCycle[],\n  karmicLessons: KarmicLesson[],\n  karmicDebts: KarmicDebt[],\n  lifePredictions: any[]\n)",
      "function generateSpiritualRemedies(\n  metrics: NumerologyMetrics,\n  challenges: ChallengeCycle[],\n  karmicLessons: KarmicLesson[],\n  karmicDebts: KarmicDebt[],\n  lifePredictions: any[],\n  birthYear: number,\n  pinnacles: PinnacleCycle[]\n)"
    );

    content = content.slice(0, startIndex) + funcBody + content.slice(endIndex);
    fs.writeFileSync('src/numerologyEngine.ts', content, 'utf8');
    console.log("Successfully replaced generateSpiritualRemedies");
} else {
    console.log("Could not find boundaries for generateSpiritualRemedies");
}
