const fs = require('fs');
const lines = fs.readFileSync('src/components/ReportView.tsx', 'utf8').split('\n');
for (let i = 1900; i < 1920; i++) {
  console.log(`${i+1}: ${lines[i]}`);
}
