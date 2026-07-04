const fs = require('fs');
let content = fs.readFileSync('src/numerologyEngine.ts', 'utf8');

content = content.replace("masterCrystals: generateMasterCrystals(metrics, karmicDebts, generateLifePredictions(metrics, challenges, pinnacles, birthYear), pinnacles, challenges, birthYear),nacleCycle,",
"masterCrystals: generateMasterCrystals(metrics, karmicDebts, generateLifePredictions(metrics, challenges, pinnacles, birthYear), pinnacles, challenges, birthYear)\n  };\n}\n\n");

// wait, the return block ends the function `generateNumerologyReport`. So it should end with `}; }`
// The rest of the file after `masterCrystals` was supposed to be:
// lunarPhase: calculateLunarPhase(new Date()),
// planetaryHour: calculatePlanetaryHour(new Date())
// }; }

const corruptedStr = "masterCrystals: generateMasterCrystals(metrics, karmicDebts, generateLifePredictions(metrics, challenges, pinnacles, birthYear), pinnacles, challenges, birthYear),nacleCycle,\n  ChallengeCycle,\n  KarmicDebt,\n  CompatibilityResult,\n  SpiritualRemedySection\n} from './types';";

if (content.includes(corruptedStr)) {
  content = content.replace(corruptedStr, `masterCrystals: generateMasterCrystals(metrics, karmicDebts, generateLifePredictions(metrics, challenges, pinnacles, birthYear), pinnacles, challenges, birthYear),
    lunarPhase: calculateLunarPhase(new Date()),
    planetaryHour: calculatePlanetaryHour(new Date())
  };
}

import {
  PinnacleCycle,
  ChallengeCycle,
  KarmicDebt,
  CompatibilityResult,
  SpiritualRemedySection
} from './types';`);
  
  fs.writeFileSync('src/numerologyEngine.ts', content, 'utf8');
  console.log("Fixed corrupted string.");
} else {
  console.log("Could not find exactly that string. Let's see what is really there.");
}
