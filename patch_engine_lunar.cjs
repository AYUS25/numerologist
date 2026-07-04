const fs = require('fs');
let code = fs.readFileSync('src/numerologyEngine.ts', 'utf8');

const lunarLogic = `
function calculateLunarPhase(date: Date): LunarPhase {
  // Simple approximation for lunar phase
  const lp = 2551443; 
  const now = date.getTime();
  const newMoon = new Date(1970, 0, 7, 20, 35, 0).getTime();
  const phase = ((now - newMoon) / 1000) % lp;
  const days = Math.floor(phase / (24 * 3600));
  
  let phaseName = "";
  let insight = "";
  
  if (days <= 1) { phaseName = "New Moon"; insight = "A time for setting deep intentions and planting seeds for the coming cycle."; }
  else if (days <= 6) { phaseName = "Waxing Crescent"; insight = "Focus on actionable steps. Your energy is building towards manifestation."; }
  else if (days <= 9) { phaseName = "First Quarter"; insight = "Friction may arise. Push through resistance and maintain your commitments."; }
  else if (days <= 13) { phaseName = "Waxing Gibbous"; insight = "Refine your plans. Trust the process as things are coming to fruition."; }
  else if (days <= 16) { phaseName = "Full Moon"; insight = "Heightened emotions and culmination. Release what no longer serves your highest good."; }
  else if (days <= 21) { phaseName = "Waning Gibbous"; insight = "Gratitude and introspection. Reflect on the harvest of this cycle."; }
  else if (days <= 24) { phaseName = "Last Quarter"; insight = "Re-evaluation and letting go. Clear physical and energetic clutter."; }
  else { phaseName = "Waning Crescent"; insight = "Rest and surrender. Conserve your energy for the upcoming new cycle."; }

  return {
    phase: phaseName,
    illumination: Math.round((1 - Math.cos((days / 29.53) * 2 * Math.PI)) * 50),
    insight
  };
}

function calculatePlanetaryHour(date: Date): PlanetaryHour {
  const hours = [
    { planet: "Sun", energy: "Vitality, leadership, and self-expression." },
    { planet: "Venus", energy: "Love, aesthetics, harmony, and wealth." },
    { planet: "Mercury", energy: "Communication, commerce, and swift intellect." },
    { planet: "Moon", energy: "Intuition, emotions, and nurturing domestic affairs." },
    { planet: "Saturn", energy: "Discipline, structure, karma, and long-term planning." },
    { planet: "Jupiter", energy: "Expansion, luck, higher learning, and spirituality." },
    { planet: "Mars", energy: "Action, courage, conflict, and physical exertion." }
  ];
  // Simplification: based on current hour of the day (0-23) + day of the week
  const day = date.getDay();
  const hour = date.getHours();
  // Chaldean order base index per day (0=Sun, 1=Mon...6=Sat)
  const dayStarts = [0, 3, 6, 2, 5, 1, 4];
  const planetIndex = (dayStarts[day] + hour) % 7;
  
  return hours[planetIndex];
}
`;

code = code.replace(
  'export function generateNumerologyReport',
  lunarLogic + '\nexport function generateNumerologyReport'
);

code = code.replace(
  '    remedies: generateRemedies(metrics)',
  '    remedies: generateRemedies(metrics),\n    lunarPhase: calculateLunarPhase(new Date()),\n    planetaryHour: calculatePlanetaryHour(new Date())'
);

fs.writeFileSync('src/numerologyEngine.ts', code);
console.log("Patched engine with Lunar/Planetary logic");
