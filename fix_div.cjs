const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

const target = `          </p>
        </div>
        <div className="flex flex-wrap gap-3">`;

const replacement = `          </p>
        </div>
        </div>
        <div className="flex flex-wrap gap-3">`;

code = code.replace(target, replacement);

fs.writeFileSync('src/components/ReportView.tsx', code);
console.log('Fixed div');
