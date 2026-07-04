const fs = require('fs');
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  const replacements = [
    { from: /text-white/g, to: 'text-slate-900' },
    { from: /text-slate-200/g, to: 'text-slate-800' },
    { from: /text-slate-300/g, to: 'text-slate-700' },
    { from: /text-slate-400/g, to: 'text-slate-500' },
    { from: /bg-dark-bg/g, to: 'bg-slate-50' },
    { from: /bg-dark-panel/g, to: 'bg-white' },
    { from: /border-dark-border/g, to: 'border-slate-200' },
    { from: /bg-\[\#121212\]/g, to: 'bg-slate-50' },
    { from: /bg-\[\#171717\]/g, to: 'bg-white' },
    { from: /bg-\[\#0a0a0a\]/g, to: 'bg-slate-100' },
    { from: /bg-black/g, to: 'bg-white' },
    { from: /text-black/g, to: 'text-white' },
    { from: /gold-accent/g, to: 'indigo-600' },
    { from: /gold-dark/g, to: 'indigo-800' },
    { from: /text-\[\#71717a\]/g, to: 'text-slate-500' },
    { from: /text-\[\#525252\]/g, to: 'text-slate-400' },
    { from: /text-\[\#404040\]/g, to: 'text-slate-400' }
  ];

  replacements.forEach(r => {
    content = content.replace(r.from, r.to);
  });

  fs.writeFileSync(filePath, content);
}

['src/App.tsx', 'src/components/ChatBot.tsx', 'src/components/IntakeForm.tsx', 'src/components/DailyAffirmation.tsx', 'src/components/InfoTooltip.tsx'].forEach(processFile);
