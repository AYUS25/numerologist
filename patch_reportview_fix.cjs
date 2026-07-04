const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

code = code.replace(/const data = await res\.json\(\);/, '');

fs.writeFileSync('src/components/ReportView.tsx', code);
