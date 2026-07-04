const fs = require('fs');
let code = fs.readFileSync('src/numerologyEngine.ts', 'utf8');

const regex = /return \[\s*\{\s*category: "Career & Ambition"[\s\S]*?\}\s*\];/;
const match = code.match(regex);
if (match) {
  let returnBlock = match[0];
  
  // Create strings for Prosperity and Inner Peace based on existing logic
  // Just use existing dictionaries or create inline generic ones to satisfy user
  const addedSectors = `
    {
      category: "Prosperity & Abundance",
      score: Math.min(100, Math.max(10, baseMoney + Math.floor(Math.random()*20 - 10))),
      potential: "Capability to attract resources by aligning personal skills with cosmic timing and karmic flow.",
      setbacks: "Subconscious blockages around receiving wealth or sudden disruptions in accumulation.",
      avoidance: "Hoarding mentality or equating self-worth entirely with material accumulation."
    },
    {
      category: "Inner Peace & Harmony",
      score: Math.min(100, Math.max(10, baseHealth + Math.floor(Math.random()*15))),
      potential: "Deep resonance with the spiritual self, bringing mental clarity and emotional equilibrium.",
      setbacks: "Tendency to absorb chaotic frequencies from the environment, leading to existential anxiety.",
      avoidance: "Escapism and spiritual bypassing to avoid dealing with practical earthly matters."
    },
    {
      category: "Spiritual Growth",
      score: Math.min(100, Math.max(10, baseMarriage + 10)),
      potential: "Awakening to higher dimensional truths and dissolving the ego's rigid structures.",
      setbacks: "Getting lost in dogmatic systems or experiencing 'dark night of the soul' periods.",
      avoidance: "Dismissing intuition in favor of pure, rigid materialism."
    }
  `;
  
  returnBlock = returnBlock.replace('];', `, ${addedSectors} ];`);
  code = code.replace(match[0], returnBlock);
  fs.writeFileSync('src/numerologyEngine.ts', code);
  console.log("Added new sectors to numerologyEngine.ts");
}
