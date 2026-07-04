const fs = require('fs');
let code = fs.readFileSync('src/components/AssetAnalyzer.tsx', 'utf8');

const newCalc = `  const calculateVibration = (input: string) => {
    if (!input) return null;
    
    let sum = 0;
    const alphanumeric = input.toUpperCase().replace(/[^A-Z0-9]/g, '');
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

code = code.replace(
  /'Enter your license plate number. Letters are ignored for vehicles, only numbers are calculated.'/,
  `'Enter your license plate number. Letters are converted to numbers based on the selected system.'`
);
fs.writeFileSync('src/components/AssetAnalyzer.tsx', code);
