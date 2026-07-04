const fs = require('fs');

const files = ['src/components/ReportView.tsx', 'src/components/IntakeForm.tsx'];

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace background and border utilities with glass-panel for standard containers
  content = content.replace(/bg-white\/\[0\.03\] backdrop-blur-md border border-white\/\[0\.08\]/g, 'glass-panel');
  content = content.replace(/bg-white\/\[0\.03\] backdrop-blur-md border border-violet-900\/20/g, 'glass-panel');

  fs.writeFileSync(filePath, content);
}

files.forEach(processFile);
console.log("Updated cards to use glass-panel");
