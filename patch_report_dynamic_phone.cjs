const fs = require('fs');
let code = fs.readFileSync('src/components/ReportView.tsx', 'utf8');

if (!code.includes('DynamicPhoneAnalyzer')) {
  code = code.replace(
    "import AssetAnalyzer from './AssetAnalyzer';",
    "import AssetAnalyzer from './AssetAnalyzer';\nimport DynamicPhoneAnalyzer from './DynamicPhoneAnalyzer';"
  );
  
  // Replace the old phone analyzer
  const oldPhoneSectionRegex = /\{report\.phoneAnalysis \? \([\s\S]*?<\/div>\s*\)\}/;
  
  const newPhoneSection = `
              <DynamicPhoneAnalyzer initialPhone={report.phoneAnalysis?.number || ''} lifePathNumber={report.metrics.lifePath.number} />
  `;
  
  code = code.replace(oldPhoneSectionRegex, newPhoneSection);
  fs.writeFileSync('src/components/ReportView.tsx', code);
  console.log("Patched ReportView with DynamicPhoneAnalyzer");
}
