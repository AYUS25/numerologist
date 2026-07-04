const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

// Update Tab name in the nav
code = code.replace(
  "{ id: 'compatibility', label: 'Compatibility', icon: Heart },",
  "{ id: 'compatibility', label: 'Synastry (Compatibility)', icon: Heart },"
);

// Update Header in the tab
code = code.replace(
  '<span>Interactive Synergy & Relationship Compatibility Calculator</span>',
  '<span>Interactive Synastry & Relationship Compatibility Calculator</span>'
);

fs.writeFileSync('src/components/ReportView.tsx', code);
console.log("Patched Synastry");
