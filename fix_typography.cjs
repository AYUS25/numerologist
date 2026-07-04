const fs = require('fs');

const files = ['src/App.tsx', 'src/components/ReportView.tsx', 'src/components/IntakeForm.tsx', 'src/components/ChatBot.tsx', 'src/components/DailyAffirmation.tsx'];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  const replacements = [
    { from: /text-\[10px\]/g, to: 'text-xs' },
    { from: /text-\[9px\]/g, to: 'text-[11px]' },
    { from: /text-\[11px\]/g, to: 'text-xs' },
    { from: /text-\[13px\]/g, to: 'text-sm' },
    { from: /tracking-widest/g, to: 'tracking-wider' },
    { from: /tracking-tighter/g, to: 'tracking-tight' },
    { from: /font-serif/g, to: 'font-sans font-medium' },
    { from: /font-mono/g, to: 'font-sans font-medium' },
    { from: /text-blue-500\/5/g, to: 'text-blue-500/10' },
  ];

  replacements.forEach(r => {
    content = content.replace(r.from, r.to);
  });

  fs.writeFileSync(filePath, content);
}

files.forEach(processFile);
console.log("Typography scaled up slightly for premium readability.");
