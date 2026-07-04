const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

code = code.replace(/X\n\} from 'lucide-react';/, "X,\n  Users,\n  Briefcase\n} from 'lucide-react';");

fs.writeFileSync('src/components/ReportView.tsx', code);
console.log('Lucide imports patched');
