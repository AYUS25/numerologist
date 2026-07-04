const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

if (!code.includes('CosmicClockWidget')) {
  code = code.replace(
    "import AssetAnalyzer from './AssetAnalyzer';",
    "import AssetAnalyzer from './AssetAnalyzer';\nimport CosmicClockWidget from './CosmicClockWidget';"
  );
  
  const target = `<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]" id="profile-report-header">`;
  const widget = `
      <div className="mb-8">
        <CosmicClockWidget />
      </div>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]" id="profile-report-header">`;
      
  code = code.replace(target, widget);
  fs.writeFileSync('src/components/ReportView.tsx', code);
  console.log("Added CosmicClockWidget");
} else {
  console.log("CosmicClockWidget already added");
}
