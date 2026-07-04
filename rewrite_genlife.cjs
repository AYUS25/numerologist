const fs = require('fs');
let content = fs.readFileSync('src/numerologyEngine.ts', 'utf8');

const startStr = "function generateLifePredictions(";
const endStr = "// COMPLETE COOPERATIVE COMPATIBILITY CALCULATOR";
const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
    let funcBody = content.slice(startIndex, endIndex);
    
    // Replace the signature
    funcBody = funcBody.replace(
      "function generateLifePredictions(metrics: NumerologyMetrics, challenges: ChallengeCycle[]): any[] {",
      "function generateLifePredictions(metrics: NumerologyMetrics, challenges: ChallengeCycle[], pinnacles: PinnacleCycle[], birthYear: number): any[] {"
    );

    // Replace the challenge application
    const challengeBlockStart = funcBody.indexOf("// Cross-reference with Challenge Numbers");
    const challengeBlockEnd = funcBody.indexOf("const getNumLabel", challengeBlockStart);
    
    if (challengeBlockStart !== -1 && challengeBlockEnd !== -1) {
      const newChallengeBlock = `// Cross-reference with Current Challenge and Pinnacle
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

  const mainChallenge = currentChallenge.number; 
  if (mainChallenge === 4 || mainChallenge === 8) {
    baseMoney = Math.max(10, baseMoney - 15); 
    baseCareer = Math.max(10, baseCareer - 10);
  }
  if (mainChallenge === 2 || mainChallenge === 6) {
    baseMarriage = Math.max(10, baseMarriage - 20);
  }
  if (mainChallenge === 5) {
    baseHealth = Math.max(10, baseHealth - 15);
  }
  if (mainChallenge === 7 || mainChallenge === 9) {
    baseSpiritual = Math.max(10, baseSpiritual - 15);
  }
  
  const mainPinnacle = currentPinnacle.number;
  if (mainPinnacle === 4 || mainPinnacle === 8) {
    baseMoney = Math.min(100, baseMoney + 15); 
    baseCareer = Math.min(100, baseCareer + 15);
  }
  if (mainPinnacle === 2 || mainPinnacle === 6) {
    baseMarriage = Math.min(100, baseMarriage + 15);
  }
  if (mainPinnacle === 1 || mainPinnacle === 5) {
    baseHealth = Math.min(100, baseHealth + 10);
  }
  if (mainPinnacle === 7 || mainPinnacle === 9 || mainPinnacle === 11 || mainPinnacle === 22 || mainPinnacle === 33) {
    baseSpiritual = Math.min(100, baseSpiritual + 20);
  }

  `;
      funcBody = funcBody.slice(0, challengeBlockStart) + newChallengeBlock + funcBody.slice(challengeBlockEnd);
    }
    
    content = content.slice(0, startIndex) + funcBody + content.slice(endIndex);
    fs.writeFileSync('src/numerologyEngine.ts', content, 'utf8');
    console.log("Successfully replaced generateLifePredictions");
} else {
    console.log("Could not find boundaries for generateLifePredictions");
}
