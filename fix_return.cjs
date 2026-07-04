const fs = require('fs');
let content = fs.readFileSync('src/numerologyEngine.ts', 'utf8');

content = content.replace(
  "const preds = generateLifePredictions(metrics, challenges);",
  "const preds = generateLifePredictions(metrics, challenges, pinnacles, birthYear);"
);

content = content.replace(
  "spiritualRemedies: generateSpiritualRemedies(metrics, challenges, karmicLessons, karmicDebts, generateLifePredictions(metrics, challenges), birthYear, pinnacles),",
  "spiritualRemedies: generateSpiritualRemedies(metrics, challenges, karmicLessons, karmicDebts, generateLifePredictions(metrics, challenges, pinnacles, birthYear), birthYear, pinnacles),"
);

content = content.replace(
  "masterCrystals: generateMasterCrystals(metrics, karmicDebts, generateLifePredictions(metrics, challenges), pinnacles, challenges, birthYear),",
  "masterCrystals: generateMasterCrystals(metrics, karmicDebts, generateLifePredictions(metrics, challenges, pinnacles, birthYear), pinnacles, challenges, birthYear),"
);

fs.writeFileSync('src/numerologyEngine.ts', content, 'utf8');
