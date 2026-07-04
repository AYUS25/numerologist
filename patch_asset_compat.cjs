const fs = require('fs');
let code = fs.readFileSync('src/components/AssetAnalyzer.tsx', 'utf8');

const newCompat = `  const getCompatibility = (vibration: number, root: number) => {
    const matrix: Record<number, { best: number[], avoid: number[] }> = {
      1: { best: [1, 2, 3, 9], avoid: [8] },
      2: { best: [1, 5], avoid: [4, 8, 9] },
      3: { best: [1, 2, 3, 9], avoid: [6] },
      4: { best: [5, 6, 7], avoid: [2, 8, 9] },
      5: { best: [1, 4, 5, 6], avoid: [] },
      6: { best: [4, 5, 6, 8], avoid: [3] },
      7: { best: [5, 6], avoid: [8, 9] },
      8: { best: [3, 5, 6], avoid: [1, 2, 4, 9] },
      9: { best: [1, 3, 5], avoid: [2, 4, 8] }
    };
    const row = matrix[root] || { best: [], avoid: [] };
    if (row.best.includes(vibration)) return { status: 'Lucky', score: 100 };
    if (row.avoid.includes(vibration)) return { status: 'Incompatible', score: 40 };
    return { status: 'Neutral', score: 70 };
  };`;

code = code.replace(/const getCompatibility = \(vibration: number, lp: number\) => \{[\s\S]*?return \{ status: 'Neutral', score: 60 \};\n  \};/, newCompat);

code = code.replace(/getCompatibility\(vibration, lifePathNumber\)/g, 'getCompatibility(vibration, rootNumber)');
code = code.replace(/getHouseRemedies\(vibration, lifePathNumber\)/g, 'getHouseRemedies(vibration, rootNumber)');
code = code.replace(/getVehicleRemedies\(vibration, lifePathNumber\)/g, 'getVehicleRemedies(vibration, rootNumber)');

fs.writeFileSync('src/components/AssetAnalyzer.tsx', code);
