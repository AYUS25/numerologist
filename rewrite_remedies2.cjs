const fs = require('fs');
let content = fs.readFileSync('src/numerologyEngine.ts', 'utf8');

const startStr = "function generateRemedies(";
const endStr = "function generateSpiritualRemedies(";
const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
    const newFunc = `function generateRemedies(metrics: NumerologyMetrics, pinnacles: PinnacleCycle[], challenges: ChallengeCycle[]): { category: string, advice: string }[] {
  const lp = metrics.lifePath.number;
  const remedies = [];
  
  // Phase-based remedies
  const currentAge = new Date().getFullYear() - (metrics.personalYear.year - metrics.personalYear.number); 
  // Wait, year calculation isn't exactly currentAge, let's just use personal year directly.
  const py = metrics.personalYear.number;
  
  if (py === 1) remedies.push({ category: "Personal Year Phase", advice: "You are in a Year 1. Take bold action and start new projects. Remedy: Avoid clinging to past routines; wear carnelian or red to boost courage." });
  else if (py === 2) remedies.push({ category: "Personal Year Phase", advice: "You are in a Year 2. Focus on partnerships and patience. Remedy: Practice active listening and diplomacy; avoid rushing things." });
  else if (py === 3) remedies.push({ category: "Personal Year Phase", advice: "You are in a Year 3. This is a time for self-expression. Remedy: Engage in creative writing or speaking; guard against scattered energy." });
  else if (py === 4) remedies.push({ category: "Personal Year Phase", advice: "You are in a Year 4. Build solid foundations. Remedy: Organize your finances and home; embrace discipline over spontaneity." });
  else if (py === 5) remedies.push({ category: "Personal Year Phase", advice: "You are in a Year 5. Expect rapid changes. Remedy: Stay adaptable and travel if possible; guard against reckless impulses." });
  else if (py === 6) remedies.push({ category: "Personal Year Phase", advice: "You are in a Year 6. Focus on family and domestic harmony. Remedy: Nurture your home environment; avoid taking on others' burdens unnecessarily." });
  else if (py === 7) remedies.push({ category: "Personal Year Phase", advice: "You are in a Year 7. A period for spiritual introspection. Remedy: Schedule solitary retreats; prioritize meditation over socializing." });
  else if (py === 8) remedies.push({ category: "Personal Year Phase", advice: "You are in a Year 8. Time for material manifestation and career growth. Remedy: Step into leadership; ensure ethical dealings to avoid karmic backlash." });
  else if (py === 9) remedies.push({ category: "Personal Year Phase", advice: "You are in a Year 9. Completion and release. Remedy: Forgive past grievances, declutter your life, and prepare for a new cycle." });

  // Life Path specific
  if (lp === 1 || lp === 8) {
    remedies.push({ category: "Lifestyle Adjustment", advice: "Incorporate intense physical exercise (like martial arts, weightlifting) to burn off excess ambition and prevent stress-induced cardiovascular issues." });
    remedies.push({ category: "Mental Framing", advice: "Practice active listening. Your tendency to dominate conversations can alienate allies you need for long-term success." });
  } else if (lp === 2 || lp === 6) {
    remedies.push({ category: "Lifestyle Adjustment", advice: "Establish strict personal boundaries. You must practice saying 'no' without guilt to prevent emotional burnout from helping others." });
    remedies.push({ category: "Environmental", advice: "Spend time near water or in meticulously organized, peaceful environments to reset your highly sensitive nervous system." });
  } else if (lp === 3 || lp === 5) {
    remedies.push({ category: "Lifestyle Adjustment", advice: "Grounding routines are essential. Commit to waking up at the exact same time every day to counteract your naturally scattered, restless energy." });
    remedies.push({ category: "Mental Framing", advice: "Finish what you start. Before picking up a new hobby or project, force yourself to complete the previous one to build self-trust." });
  } else if (lp === 4) {
    remedies.push({ category: "Lifestyle Adjustment", advice: "Incorporate flexibility into your life—both physically (yoga, stretching) and mentally (spontaneous weekend trips without an itinerary)." });
  } else if (lp === 7 || lp === 9) {
    remedies.push({ category: "Environmental", advice: "You require solitary retreats. Designate a quiet space in your home strictly for meditation, reading, or processing your deep thoughts." });
    remedies.push({ category: "Mental Framing", advice: "Avoid intellectual arrogance (7) or playing the martyr (9). Stay connected to the mundane, practical world to avoid severe detachment." });
  }

  // Check for karmic debts
  const debts = [];
  if (metrics.lifePath.rawBeforeReduction === 13 || metrics.expression.rawBeforeReduction === 13 || metrics.soulUrge.rawBeforeReduction === 13) debts.push(13);
  if (metrics.lifePath.rawBeforeReduction === 14 || metrics.expression.rawBeforeReduction === 14 || metrics.soulUrge.rawBeforeReduction === 14) debts.push(14);
  if (metrics.lifePath.rawBeforeReduction === 16 || metrics.expression.rawBeforeReduction === 16 || metrics.soulUrge.rawBeforeReduction === 16) debts.push(16);
  if (metrics.lifePath.rawBeforeReduction === 19 || metrics.expression.rawBeforeReduction === 19 || metrics.soulUrge.rawBeforeReduction === 19) debts.push(19);

  if (debts.includes(13)) remedies.push({ category: "Karmic Debt 13 Remedy", advice: "You must overcome laziness and shortcuts. Success will only come through disciplined, hard work. Never give up when obstacles arise." });
  if (debts.includes(14)) remedies.push({ category: "Karmic Debt 14 Remedy", advice: "You must learn temperance and moderation. Avoid overindulgence in food, alcohol, or risky behaviors to balance past-life excesses." });
  if (debts.includes(16)) remedies.push({ category: "Karmic Debt 16 Remedy", advice: "You will experience sudden ego-deaths or relationship resets. Practice deep humility and spirituality; do not cling to material status." });
  if (debts.includes(19)) remedies.push({ category: "Karmic Debt 19 Remedy", advice: "You must learn to ask for help and not abuse your power. Stand on your own two feet, but realize you are part of a larger community." });

  return remedies;
}

`;
    content = content.slice(0, startIndex) + newFunc + content.slice(endIndex);
    console.log("Replaced generateRemedies");
} else {
    console.log("Could not find boundaries for generateRemedies");
}

fs.writeFileSync('src/numerologyEngine.ts', content, 'utf8');
