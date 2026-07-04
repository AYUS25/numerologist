const fs = require('fs');
let code = fs.readFileSync('src/components/AssetAnalyzer.tsx', 'utf8');

code = code.replace(
  /const \[assetInput, setAssetInput\] = useState\(''\);/,
  `const [assetInput, setAssetInput] = useState('');\n  const [system, setSystem] = useState<'pythagorean' | 'chaldean'>('pythagorean');`
);

const newCalc = `  const calculateVibration = (input: string) => {
    if (!input) return null;
    const alphanumeric = input.toUpperCase().replace(/[^A-Z0-9]/g, '');
    let sum = 0;
    
    const pythagoreanValues: Record<string, number> = {
      A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
      J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
      S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
    };

    const chaldeanValues: Record<string, number> = {
      A: 1, I: 1, J: 1, Q: 1, Y: 1,
      B: 2, K: 2, R: 2,
      C: 3, G: 3, L: 3, S: 3,
      D: 4, M: 4, T: 4,
      E: 5, H: 5, N: 5, X: 5,
      U: 6, V: 6, W: 6,
      O: 7, Z: 7,
      F: 8, P: 8
    };

    const letterValues = system === 'pythagorean' ? pythagoreanValues : chaldeanValues;

    for (const char of alphanumeric) {
      if (/[0-9]/.test(char)) {
        sum += parseInt(char, 10);
      } else if (letterValues[char]) {
        sum += letterValues[char];
      }
    }

    if (sum === 0) return null;
    
    let current = sum;
    while (current > 9 && current !== 11 && current !== 22 && current !== 33) {
      current = current.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    }
    
    return current;
  };`;

code = code.replace(/const calculateVibration = \(input: string\) => \{[\s\S]*?return current;\n  \};/, newCalc);

const toggleHtml = `          <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 mt-4">
            <button
              onClick={() => { playMechanicalDial(); setSystem('pythagorean'); }}
              onMouseEnter={() => playHoverTick()}
              className={\`flex-1 py-2 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all \${
                system === 'pythagorean' ? 'bg-indigo-500/20 text-indigo-400 shadow-md' : 'text-zinc-500 hover:text-zinc-300'
              }\`}
            >
              Pythagorean
            </button>
            <button
              onClick={() => { playMechanicalDial(); setSystem('chaldean'); }}
              onMouseEnter={() => playHoverTick()}
              className={\`flex-1 py-2 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all \${
                system === 'chaldean' ? 'bg-indigo-500/20 text-indigo-400 shadow-md' : 'text-zinc-500 hover:text-zinc-300'
              }\`}
            >
              Chaldean
            </button>
          </div>`;

code = code.replace(
  /<\/p>\n          <\/div>/,
  `</p>\n          </div>\n${toggleHtml}`
);

fs.writeFileSync('src/components/AssetAnalyzer.tsx', code);
console.log("Patched system toggle");
