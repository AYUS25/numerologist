const fs = require('fs');
let content = fs.readFileSync('src/numerologyEngine.ts', 'utf8');

const target = "masterCrystals: generateMasterCrystals(metrics, karmicDebts, generateLifePredictions(metrics, challenges, pinnacles, birthYear), pinnacles, challenges, birthYear),nacleCycle,\n  ChallengeCycle,\n  KarmicDebt,\n  CompatibilityResult,\n  SpiritualRemedySection\n} from './types';";

if (content.includes(target)) {
  console.log("Found the target exactly");
  // We lost the end of generateNumerologyReport!
  // It was:
  //    lunarPhase: calculateLunarPhase(new Date()),
  //    planetaryHour: calculatePlanetaryHour(new Date())
  //  };
  // }
  // And it overwrote some other things... wait, it overwrote up to `nacleCycle, ... } from './types';`!
  // Wait, `nacleCycle` is part of `import { ... } from './types'` at the TOP of the file?!
  // But line 1159 is in the middle of the file.
  // Oh, my `replace` script probably found the FIRST occurrence of the end string which matched something else?
  // No, `returnBlockEndStr` was:
  // "masterCrystals: generateMasterCrystals(metrics, karmicDebts, generateLifePredictions(metrics, challenges, pinnacles, birthYear), pinnacles, challenges, birthYear),"
  // How did it end up with `nacleCycle, ...` right after?
  // I will just replace the exact `target` with the correct code.
  
  const replacement = `masterCrystals: generateMasterCrystals(metrics, karmicDebts, generateLifePredictions(metrics, challenges, pinnacles, birthYear), pinnacles, challenges, birthYear),
    lunarPhase: calculateLunarPhase(new Date()),
    planetaryHour: calculatePlanetaryHour(new Date())
  };
}
`;
  content = content.replace(target, replacement);
  fs.writeFileSync('src/numerologyEngine.ts', content, 'utf8');
} else {
  console.log("Could not find the exact target to replace.");
}

