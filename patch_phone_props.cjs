const fs = require('fs');
let code = fs.readFileSync('src/components/DynamicPhoneAnalyzer.tsx', 'utf8');

code = code.replace(/interface Props \{[\s\S]*?\}/, `interface Props {\n  initialPhone?: string;\n  lifePathNumber: number;\n  rootNumber: number;\n}`);
code = code.replace(/export default function DynamicPhoneAnalyzer\(\{ initialPhone, lifePathNumber \}: Props\) \{/, `export default function DynamicPhoneAnalyzer({ initialPhone, lifePathNumber, rootNumber }: Props) {`);

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
    if (row.best.includes(vibration)) return 100;
    if (row.avoid.includes(vibration)) return 40;
    return 70; // Neutral
  };`;

code = code.replace(/const getCompatibility = \(vibration: number, lp: number\) => \{[\s\S]*?return 60;\n  \};/, newCompat);

code = code.replace(/getCompatibility\(vibration, lifePathNumber\)/g, 'getCompatibility(vibration, rootNumber)');
code = code.replace(/lifePathNumber > \(vibration%9\|\|9\) \? lifePathNumber - \(vibration%9\|\|9\) : lifePathNumber \+ 9 - \(vibration%9\|\|9\)/g, 
  `(() => {
    const matrix: Record<number, { best: number[], avoid: number[] }> = {
      1: { best: [1, 2, 3, 9], avoid: [8] }, 2: { best: [1, 5], avoid: [4, 8, 9] }, 3: { best: [1, 2, 3, 9], avoid: [6] },
      4: { best: [5, 6, 7], avoid: [2, 8, 9] }, 5: { best: [1, 4, 5, 6], avoid: [] }, 6: { best: [4, 5, 6, 8], avoid: [3] },
      7: { best: [5, 6], avoid: [8, 9] }, 8: { best: [3, 5, 6], avoid: [1, 2, 4, 9] }, 9: { best: [1, 3, 5], avoid: [2, 4, 8] }
    };
    const best = matrix[rootNumber]?.best[0] || rootNumber;
    let diff = best - (vibration % 9 || 9);
    if (diff < 0) diff += 9;
    return diff;
  })()`
);

// We should also replace the text {lifePathNumber} with the lucky number inside the recommendation
code = code.replace(/whose digits reduce to <strong>\{lifePathNumber\}<\/strong>/, 
`whose digits reduce to <strong>{(() => {
  const matrix: Record<number, { best: number[], avoid: number[] }> = {
    1: { best: [1, 2, 3, 9], avoid: [8] }, 2: { best: [1, 5], avoid: [4, 8, 9] }, 3: { best: [1, 2, 3, 9], avoid: [6] },
    4: { best: [5, 6, 7], avoid: [2, 8, 9] }, 5: { best: [1, 4, 5, 6], avoid: [] }, 6: { best: [4, 5, 6, 8], avoid: [3] },
    7: { best: [5, 6], avoid: [8, 9] }, 8: { best: [3, 5, 6], avoid: [1, 2, 4, 9] }, 9: { best: [1, 3, 5], avoid: [2, 4, 8] }
  };
  return matrix[rootNumber]?.best[0] || rootNumber;
})()}</strong>`
);

code = code.replace(/lifePathNumber % 2 === 0 \? 'cool tones \(blue, silver, white\)' : 'warm tones \(red, gold, orange\)'/,
  `rootNumber % 2 === 0 ? 'cool tones (blue, silver, white)' : 'warm tones (red, gold, orange)'`
);

fs.writeFileSync('src/components/DynamicPhoneAnalyzer.tsx', code);
