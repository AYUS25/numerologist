const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');
const lines = code.split('\n');
console.log(lines[1905]);
console.log(lines[1906]);
console.log(lines[1907]);
