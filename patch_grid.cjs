const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

code = code.replace(
  'className="grid grid-cols-1 md:grid-cols-3 gap-4"',
  'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"'
);

code = code.replace(
  'className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"',
  'className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8"'
);

code = code.replace(
  'className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]" id="profile-report-header"',
  'className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]" id="profile-report-header"'
);

fs.writeFileSync('src/components/ReportView.tsx', code);
console.log('Patched grid layout');
