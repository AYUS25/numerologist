const fs = require('fs');

const files = [
  'src/components/ReportView.tsx',
  'src/components/LifecyclePhasesWidget.tsx',
  'src/components/AssetAnalyzer.tsx',
  'src/components/CosmicClockWidget.tsx',
  'src/App.tsx',
  'src/components/ZodiacConstellation.tsx'
];

files.forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/indigo-/g, 'blue-');
  code = code.replace(/violet-/g, 'blue-');
  code = code.replace(/purple-/g, 'blue-');
  fs.writeFileSync(file, code);
});
