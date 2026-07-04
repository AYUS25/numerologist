const fs = require('fs');
let code = fs.readFileSync('src/components/AssetAnalyzer.tsx', 'utf8');

const houseRemedies = `  const getHouseRemedies = (vibration: number, root: number) => {
    let remedyText = \`Your living space vibrates at a \${vibration}. \`;
    
    // House specific meanings
    switch(vibration) {
      case 2:
      case 6: remedyText += "Ideal for families, nurturing, and domestic harmony. "; break;
      case 3: remedyText += "Great for artists, creatives, or entertainers. "; break;
      case 8: remedyText += "Excellent for ambitious professionals or wealth-building, but can create a stressful environment. "; break;
      case 9: remedyText += "Suited for humanitarians, teachers, or a transitional phase in life. "; break;
    }

    const compat = getCompatibility(vibration, root);
    if (compat.score === 100) {
      remedyText += \`This is a highly compatible, lucky energetic match for your Root Number (\${root})! Your home naturally supports you.\`;
    } else if (compat.score === 70) {
      remedyText += \`This is a neutral match for your Root Number (\${root}). It offers balanced energy without extreme friction.\`;
    } else {
      // Find a lucky target number
      const matrix: Record<number, { best: number[], avoid: number[] }> = {
        1: { best: [1, 2, 3, 9], avoid: [8] }, 2: { best: [1, 5], avoid: [4, 8, 9] }, 3: { best: [1, 2, 3, 9], avoid: [6] },
        4: { best: [5, 6, 7], avoid: [2, 8, 9] }, 5: { best: [1, 4, 5, 6], avoid: [] }, 6: { best: [4, 5, 6, 8], avoid: [3] },
        7: { best: [5, 6], avoid: [8, 9] }, 8: { best: [3, 5, 6], avoid: [1, 2, 4, 9] }, 9: { best: [1, 3, 5], avoid: [2, 4, 8] }
      };
      const best = matrix[root]?.best[0] || root;
      let targetDiff = best - vibration;
      if (targetDiff < 0) targetDiff += 9;
      
      remedyText += \`If choosing a new home, aim for a house number that reduces to \${best} (one of your lucky numbers). To harmonize the current energy using the 'Add a Digit' fix, place a small, barely visible letter '\${targetDiff === 1 ? 'A' : targetDiff === 2 ? 'B' : targetDiff === 3 ? 'C' : targetDiff === 4 ? 'D' : targetDiff === 5 ? 'E' : targetDiff === 6 ? 'F' : targetDiff === 7 ? 'G' : targetDiff === 8 ? 'H' : 'I'}' (or number \${targetDiff}) near your front door. This shifts the vibration to \${best}.\`;
    }
  
    const colors = [
      "Ruby Red, Gold, Bright Orange", "Silver, Pearl White", "Yellow, Amethyst Purple", 
      "Earthy Brown, Terracotta", "Light Blue, Silver, Turquoise", "Indigo, Rose Pink", 
      "Violet, Sea Green", "Charcoal Black, Dark Blue", "Crimson, Maroon" 
    ];
    const symbols = [
      "Sun motifs, bold geometric shapes", "Crescent moons, paired objects", "Triangles, vibrant blooming flowers", 
      "Squares, heavy wooden furniture", "Stars, wind chimes", "Hexagrams, family portraits", 
      "Heptagrams, indoor water fountains", "Octagons, metallic accents", "Enneagrams, global artifacts" 
    ];
  
    return {
      text: remedyText,
      colors: colors[(root - 1) % 9] || colors[0],
      symbols: symbols[(root - 1) % 9] || symbols[0],
      placement: "Focus these enhancements near your front entrance and primary living areas."
    };
  };`;

const vehicleRemedies = `  const getVehicleRemedies = (vibration: number, root: number) => {
    let remedyText = \`This vehicle holds a \${vibration} frequency. \`;
    let safety = "";
    
    if (vibration === 5) {
      safety = "Number 5 is generally considered the best universal number for vehicles, associated with smooth communication, trade, and movement.";
    } else if (vibration === 4 || vibration === 8) {
      safety = "Numbers 4 and 8 are widely avoided for vehicles as they can attract sudden events (4) or delays (8), unless they specifically complement your chart.";
    } else {
      safety = "Maintain regular checkups and fluid levels.";
    }
  
    const compat = getCompatibility(vibration, root);
    if (compat.score === 100) {
      remedyText += \`It is perfectly aligned as a 'lucky' number for you, offering natural protection and smooth transits.\`;
    } else if (compat.score === 70) {
      remedyText += \`It holds neutral alignment with your Root Number. Solid and dependable.\`;
    } else {
      const matrix: Record<number, { best: number[], avoid: number[] }> = {
        1: { best: [1, 2, 3, 9], avoid: [8] }, 2: { best: [1, 5], avoid: [4, 8, 9] }, 3: { best: [1, 2, 3, 9], avoid: [6] },
        4: { best: [5, 6, 7], avoid: [2, 8, 9] }, 5: { best: [1, 4, 5, 6], avoid: [] }, 6: { best: [4, 5, 6, 8], avoid: [3] },
        7: { best: [5, 6], avoid: [8, 9] }, 8: { best: [3, 5, 6], avoid: [1, 2, 4, 9] }, 9: { best: [1, 3, 5], avoid: [2, 4, 8] }
      };
      const best = matrix[root]?.best[0] || root;
      let targetDiff = best - vibration;
      if (targetDiff < 0) targetDiff += 9;
      
      remedyText += \`If choosing a new vehicle, aim for a license plate whose digits sum to \${best}. To improve current energetic alignment, keep a small talisman with the number '\${targetDiff}' inside the glovebox to shift the net vibration to \${best}.\`;
    }
  
    return {
      text: remedyText,
      maintenance: safety
    };
  };`;

code = code.replace(/const getHouseRemedies = \([\s\S]*?Focus these enhancements near your front entrance and primary living areas."\n    \};\n  \};/, houseRemedies);
code = code.replace(/const getVehicleRemedies = \([\s\S]*?maintenance: safety\n    \};\n  \};/, vehicleRemedies);

fs.writeFileSync('src/components/AssetAnalyzer.tsx', code);
