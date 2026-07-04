const fs = require('fs');
let content = fs.readFileSync('src/numerologyEngine.ts', 'utf8');

// Update generateNumerologyReport signature
const srStart = content.indexOf("spiritualRemedies: generateSpiritualRemedies(");
if (srStart !== -1) {
    const nextLine = content.indexOf("\n", srStart);
    const line = content.substring(srStart, nextLine);
    content = content.replace(line, "spiritualRemedies: generateSpiritualRemedies(metrics, challenges, karmicLessons, karmicDebts, generateLifePredictions(metrics, challenges)),");
    console.log("Updated generateNumerologyReport call");
} else {
    console.log("Could not find call to generateSpiritualRemedies");
}

// Replace generateSpiritualRemedies
const funcStart = "function generateSpiritualRemedies(";
const funcEnd = "const allRemedies = [careerRemedy, loveRemedy, wealthRemedy, healthRemedy, spiritualRemedy];";
const startIndex = content.indexOf(funcStart);
const endIndex = content.indexOf(funcEnd) + funcEnd.length + "\n  return allRemedies;\n}".length;

if (startIndex !== -1 && endIndex !== -1) {
    const newFunc = `function generateSpiritualRemedies(
  metrics: NumerologyMetrics,
  challenges: ChallengeCycle[],
  karmicLessons: KarmicLesson[],
  karmicDebts: KarmicDebt[],
  lifePredictions: any[]
): SpiritualRemedySection[] {
  const lp = metrics.lifePath.number;
  const lessonNumbers = karmicLessons.map(l => l.number);

  const getScore = (cat: string) => lifePredictions.find(p => p.category.includes(cat))?.score || 50;

  const careerScore = getScore("Career");
  const careerRemedy: SpiritualRemedySection = {
    sector: 'Career & Purpose',
    alignmentScore: careerScore,
    challengeText: careerScore < 70 
      ? \`Your path is currently blocked by challenges around self-confidence, professional discipline, or fear of standing alone.\`
      : \`Your professional vibrations are highly aligned, but you require micro-adjustments to fully unlock your leadership and entrepreneurial legacy.\`,
    colorRemedy: {
      color: [1, 8].includes(lp) ? "Crimson Red" : "Deep Royal Blue",
      vibration: [1, 8].includes(lp) 
        ? "Vibration of raw ambition, leadership courage, and physical action." 
        : "Vibration of focused logic, executive communication, and structural truth.",
      practice: "Incorporate this color in your workspace decor or wear small crimson accessories during negotiation sessions to command authority."
    },
    sacredPractice: {
      title: "Solar Plexus Breathing & Action Intentions",
      frequency: "Daily, before starting work (5 minutes)",
      instructions: "Sit upright. Perform 2 minutes of rapid abdominal breathing (Breath of Fire) to activate your willpower. Then, write down exactly three micro-goals for the day and visualize them as already accomplished with resolute focus."
    },
    mantra: {
      sanskrit: "Om Hreem Shreem Lakshmibhayo Namah",
      englishTranslation: "Om, salutations to the divine frequency of ultimate prosperity and professional alignment.",
      benefits: "Removes blockages in your career path, aligns your willpower with material success, and calms executive anxiety."
    }
  };

  const loveScore = getScore("Marriage");
  const loveRemedy: SpiritualRemedySection = {
    sector: 'Love & Relationships',
    alignmentScore: loveScore,
    challengeText: loveScore < 70
      ? \`Your relationship sector is carrying friction from codependency, fear of abandonment, or an inability to communicate your true emotional needs.\`
      : \`Your heart chakra is functioning optimally, but you must ensure you are not absorbing your partner's negative energies.\`,
    colorRemedy: {
      color: "Soft Rose Pink",
      vibration: "Fosters absolute emotional safety, unconditional love, and inner-child healing.",
      practice: "Visualize a soft pink light surrounding you and your partner (or future partner) during conflicts, immediately de-escalating tension."
    },
    sacredPractice: {
      title: "Heart Chakra Tapping & Forgiveness",
      frequency: "Weekly (Sunday evenings)",
      instructions: "Gently tap the center of your chest while repeating, 'I release all past relationship trauma. I am worthy of safe, reciprocal love.' Focus entirely on the physical sensation of the tapping."
    },
    mantra: {
      sanskrit: "Aham Prema",
      englishTranslation: "I am Divine Love.",
      benefits: "Re-tunes your auric field to attract partners who match your soul vibration rather than your unhealed trauma."
    }
  };

  const wealthScore = getScore("Wealth");
  const wealthRemedy: SpiritualRemedySection = {
    sector: 'Wealth & Finance',
    alignmentScore: wealthScore,
    challengeText: wealthScore < 70
      ? \`Your wealth manifestation is impacted by scarcity cycles, risky impulses, or inconsistent material organization.\`
      : \`Your abundance attraction is in a healthy, progressive flow, backed by strong structural habits.\`,
    colorRemedy: {
      color: "Rich Antique Gold",
      vibration: "Vibration of absolute abundance, prosperity intelligence, and spiritual luxury.",
      practice: "Incorporate gold tones in your daily belongings, or visualize a gold sun radiating warmth and wealth over your crown chakra."
    },
    sacredPractice: {
      title: "Gratitude & Bay Leaf Manifestation Ritual",
      frequency: "Every New Moon",
      instructions: "On a dried bay leaf, write down a specific, realistic financial goal using gold or black ink. Hold the leaf, feel the gratitude of already having it, and then safely burn the leaf, letting the smoke carry your intention to the universe."
    },
    mantra: {
      sanskrit: "Om Shreem Maha Lakshmiyei Namaha",
      englishTranslation: "Om, salutations to the supreme goddess of abundance, material beauty, and ultimate spiritual wealth.",
      benefits: "Clears financial anxieties, aligns your subconscious with the flow of money, and encourages ethical accumulation."
    }
  };

  const healthScore = getScore("Health");
  const healthRemedy: SpiritualRemedySection = {
    sector: 'Health & Vitality',
    alignmentScore: healthScore,
    challengeText: healthScore < 70
      ? \`Your vitality is challenged by nervous exhaustion, stress accumulation, or ignoring dietary balance.\`
      : \`You carry robust energetic recovery, but need to guard against overworking your mental reserves.\`,
    colorRemedy: {
      color: "Sage Green",
      vibration: "Promotes nervous system decompression, deep organic healing, and cellular regeneration.",
      practice: "Spend time walking barefoot on grassy ground, or incorporate soft sage green elements in your bedroom to induce immediate calm."
    },
    sacredPractice: {
      title: "Pranayama Grounding & Earthing",
      frequency: "Daily, upon waking (5 minutes)",
      instructions: "Perform 4-7-8 breathing (inhale for 4s, hold for 7s, exhale for 8s) to downregulate your sympathetic nervous system. If possible, walk barefoot on grass or bare soil to discharge built-up electrical charge."
    },
    mantra: {
      sanskrit: "Om Sri Dhanvantre Namaha",
      englishTranslation: "Om, salutations to the divine master of healing and holistic health.",
      benefits: "Regulates body frequencies, clears cellular blockages, and encourages an intuitive understanding of your body's needs."
    }
  };

  const spiritualScore = getScore("Spiritual");
  const spiritualRemedy: SpiritualRemedySection = {
    sector: 'Spiritual Path',
    alignmentScore: spiritualScore,
    challengeText: spiritualScore < 70
      ? \`Your spiritual pathway is experiencing lessons in mental trust, letting go of dogmas, or recovering from a 'Dark Night of the Soul'.\`
      : \`Your cosmic connection is highly active, with deep intuitive awareness and psychic sensitivity.\`,
    colorRemedy: {
      color: "Deep Indigo Violet",
      vibration: "Fosters crown chakra activation, cosmic truth integration, and quiet inner peace.",
      practice: "Wear violet or deep purple clothing during private reading, meditation, or prayer to raise your frequency."
    },
    sacredPractice: {
      title: "Vipassana Silent Breath Watching",
      frequency: "Daily, before sleep (10-15 minutes)",
      instructions: "Sit comfortably. Close your eyes. Simply observe the natural rise and fall of your breath. Do not try to control it. When your mind drifts, gently bring it back to the breath, training yourself to dissolve your ego's control."
    },
    mantra: {
      sanskrit: "Om Namah Shivaya",
      englishTranslation: "Om, I bow to the infinite, inner divinity that destroys all illusion and purifies the soul.",
      benefits: "Burns away deep-seated karmic blockages, dissolves spiritual arrogance, and brings profound mental serenity."
    }
  };

  return [careerRemedy, loveRemedy, wealthRemedy, healthRemedy, spiritualRemedy];
}`;

    content = content.slice(0, startIndex) + newFunc + content.slice(endIndex);
    fs.writeFileSync('src/numerologyEngine.ts', content, 'utf8');
    console.log("Successfully replaced generateSpiritualRemedies");
} else {
    console.log("Could not find boundaries for generateSpiritualRemedies");
}
